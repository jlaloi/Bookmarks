import * as React from 'react';
import {useMutation} from '@apollo/react-hooks';
import {BookmarkTagList} from './BookmarkTagList';
import {EditableText} from './EditableText';
import {DELETE_BOOKMARK, UPDATE_BOOKMARK_META} from '../config/queries';
import {Bookmark as BookmarkType} from '../config/types';
import {getMetaData} from '../config/metadataProvider';

export const Bookmark = ({bookmark}: {bookmark: BookmarkType}) => {
  // Mutation to delete bookmark
  const [deleteBookmark, {error: errorD}] = useMutation(DELETE_BOOKMARK, {
    variables: {id: bookmark.id},
    refetchQueries: ['allBookmarks'],
  });

  // Mutation to update bookmark metadata
  const [updateBookmarkMetadata, {error: errorM}] = useMutation(UPDATE_BOOKMARK_META, {
    refetchQueries: ['allBookmarks'],
  });

  /**
   * Persist new url to database with optionnal metadata
   */
  const updateUrl = async (newUrl: string) => {
    const metadata = await getMetaData(newUrl);
    updateBookmarkMetadata({variables: {id: bookmark.id, url: newUrl, ...metadata}});
  };

  // Metadatas to display
  let metadataText = ``;
  if (bookmark.publicationDate) metadataText += `${new Date(bookmark.publicationDate).toLocaleDateString()} `;
  if (bookmark.author) metadataText += `${bookmark.author} `;
  if (bookmark.width && bookmark.height) metadataText += ` -  ${bookmark.width} x ${bookmark.height}px `;
  if (bookmark.duration) metadataText += ` -  ${bookmark.duration}s `;

  return (
    <div className="Bookmark">
      {/* Display attributes */}
      <a href={bookmark.url} target="_blank" title="Open link in new tab">
        {bookmark.title && <h3>{bookmark.title}</h3>}
        {bookmark.thumbnail ? <img src={bookmark.thumbnail} alt={bookmark.title}/> : <span className="noThumbnail">No preview</span>}
        <div className="metadatas">{metadataText}</div>
      </a>
      {/* Edit url form */}
      <EditableText value={bookmark.url} onUpdate={updateUrl} placeholder="New url" />
      {/* Bookmark list */}
      <BookmarkTagList bookmark={bookmark} />
      <button onClick={e => deleteBookmark()}>Delete Bookmark</button>
      {/* Delete mutation error */}
      {errorD && <div className="error">{errorD.message}</div>}
      {/* Update mutation error */}
      {errorM && <div className="error">{errorM.message}</div>}
    </div>
  );
};
