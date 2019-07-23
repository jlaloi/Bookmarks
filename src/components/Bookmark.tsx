import * as React from 'react';
import {useMutation} from '@apollo/react-hooks';
import {BookmarkTagList} from './BookmarkTagList';
import {EditableText} from './EditableText';
import {DELETE_BOOKMARK, UPDATE_BOOKMARK_META} from '../config/queries';
import {Bookmark as BookmarkType} from '../config/types';
import {getMetadata} from '../config/metadataProvider';

export const Bookmark = ({bookmark}: {bookmark: BookmarkType}) => {
  // Mutation to delete Bookmark
  const [deleteBookmark, {error: errorD}] = useMutation(DELETE_BOOKMARK, {
    variables: {id: bookmark.id},
    refetchQueries: ['allBookmarks'],
  });

  // Mutation to update Bookmark metadata
  const [updateBookmarkMetadata, {error: errorM}] = useMutation(UPDATE_BOOKMARK_META, {
    refetchQueries: ['allBookmarks'],
  });

  /**
   * Persist new url to database with optionnal metadata
   */
  const updateUrl = async (newUrl: string) => {
    const metadata = await getMetadata(newUrl);
    updateBookmarkMetadata({variables: {id: bookmark.id, url: newUrl, ...metadata}});
  };

  // Metadatas to display
  const computeMetatada = ({author, duration, publicationDate, width, height}: BookmarkType) => {
    let metadataText = ``;
    if (publicationDate) metadataText += `${new Date(publicationDate).toLocaleDateString()} `;
    if (author) metadataText += `${author} `;
    if (width && height) metadataText += ` -  ${width}x${height}px `;
    if (duration) metadataText += ` -  ${duration}s`;
    return metadataText;
  };
  const metadatas = React.useMemo(() => computeMetatada(bookmark), [
    bookmark.author,
    bookmark.duration,
    bookmark.publicationDate,
    bookmark.width,
    bookmark.height,
  ]);

  return (
    <div className="Bookmark">
      {/* Display attributes */}
      <a href={bookmark.url} target="_blank" title="Open link in new tab">
        {bookmark.title && <h3>{bookmark.title}</h3>}
        {bookmark.thumbnail ? (
          <img src={bookmark.thumbnail} alt={bookmark.title} />
        ) : (
          <span className="noThumbnail">No preview</span>
        )}
        <div className="metadataText">{metadatas}</div>
      </a>
      {/* Edit url form */}
      <EditableText value={bookmark.url} onUpdate={updateUrl} placeholder="New url" />
      {/* Bookmark list */}
      <BookmarkTagList bookmark={bookmark} />
      {/* Delete button */}
      <button onClick={e => deleteBookmark()}>Delete Bookmark</button>
      {/* Delete mutation error */}
      {errorD && <div className="error">{errorD.message}</div>}
      {/* Update mutation error */}
      {errorM && <div className="error">{errorM.message}</div>}
    </div>
  );
};
