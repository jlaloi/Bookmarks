import {API_KEY_FLICKR, API_KEY_VIMEO} from './keys';

interface Metadata {
  author: string;
  publicationDate: Date;
  height: number;
  title: string;
  thumbnail: string;
  width: number;
}

interface MetadataVideo extends Metadata {
  duration: number;
}

interface Provider {
  name: string;
  regexInternalId: RegExp;
  getInternalId: (url: string) => string;
  fetchMetaData: (url: String) => Promise<Metadata | MetadataVideo>;
}

/**
 * Providers list
 */
const providers: Provider[] = [
  {
    name: 'vimeo.com', // https://vimeo.com/346802568
    regexInternalId: /^(?:https?:\/\/)?vimeo\.com(.*)\/([0-9]+)(?:\/.*)?$/i,
    getInternalId(url) {
      return url.match(this.regexInternalId).reduce((a, b) => b);
    },
    async fetchMetaData(url) {
      try {
        const internalId = this.getInternalId(url);
        const request = await fetch(`https://api.vimeo.com/videos/${internalId}`, {
          headers: {
            Authorization: `Bearer ${API_KEY_VIMEO}`,
          },
        });
        const {
          user: {name: author},
          created_time: publicationDate,
          duration,
          height,
          name: title,
          pictures: {sizes: thumbnails},
          width,
        } = await request.json();
        return {
          author,
          publicationDate: new Date(publicationDate),
          duration,
          height,
          title,
          thumbnail: thumbnails.length && thumbnails[0].link,
          width,
        };
      } catch (err) {
        console.error(`Error while quering VIMEO "${url}" metadata : `, err);
      }
    },
  },
  {
    name: 'flickr.com', // https://www.flickr.com/photos/nikpatelphotography/48236495002
    regexInternalId: /^(?:https?:\/\/)?www\.flickr\.com\/photos\/.+\/([0-9]+)(?:\/.*)?$/i,
    getInternalId(url) {
      return url.match(this.regexInternalId)[1];
    },
    async fetchMetaData(url) {
      try {
        const internalId = this.getInternalId(url);
        const request = await fetch(
          `https://api.flickr.com/services/rest?photo_id=${internalId}&method=flickr.photos.getInfo&format=json&nojsoncallback=1&extras=sizes&api_key=${API_KEY_FLICKR}`,
        );
        const metadata = (await request.json()).photo;
        // Original size: Format available sizes then identify the biggest one
        const size = metadata.sizes.size
          .map(size => {
            return {
              width: parseInt(size.width),
              height: parseInt(size.height),
            };
          })
          .reduce((size, current) => (current.width * current.height > size.width * size.height ? current : size), {
            width: 0,
            height: 0,
          });
        // Identify thumbnail
        const thumbnail = metadata.sizes.size.find(s => s.label === 'Thumbnail');
        return {
          author: metadata.owner.username,
          publicationDate: new Date(metadata.dateuploaded * 1000),
          height: size.height,
          title: metadata.title._content,
          thumbnail: thumbnail.source,
          width: size.width,
        };
      } catch (err) {
        console.error(`Error while quering FLICKR "${url}" metadata : `, err);
      }
    },
  },
];

/**
 * Get the metadata
 */
export const getMetaData = (url: string) => {
  const provider = providers.find(provider => url.match(provider.regexInternalId));
  if (provider) return provider.fetchMetaData(url);
  else
    return Promise.resolve({
      author: null,
      publicationDate: null,
      height: null,
      title: null,
      thumbnail: null,
      width: null,
    } as Metadata);
};
