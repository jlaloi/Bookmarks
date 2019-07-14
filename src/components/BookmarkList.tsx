import * as React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {GET_BOOKMARKS} from '../config/queries';
import {Bookmark} from './Bookmark';
import {Bookmark as BookmarkType} from '../config/types';

export const BookmarkList = () => {
  /*
   * Simple pagination.
   *  - Using global store is overkill for such restricted functionnality
   *  - Database pagination is also overskill as  bookmarks are quite small and limited in quantity
   */
  const pageSize = 3;
  const [pagePos, pageDispatch] = React.useReducer((state: number, action: {type: 'next'} | {type: 'prev'}) => {
    switch (action.type) {
      case 'next':
        return state + pageSize;
      case 'prev':
        return Math.max(0, state - pageSize);
      default:
        return state;
    }
  }, 0);

  /*
   * Get all bookmarks
   */
  const {loading, data, error} = useQuery(GET_BOOKMARKS);

  return (
    <div>
      {loading ? (
        <p>Loading ...</p>
      ) : (
        <div>
          {/* Error display */}
          {error && <div className="error">{error.message}</div>}

          {/* Bookmark list */}
          {data.allBookmarks.slice(pagePos, pagePos + pageSize).map((bookmark: BookmarkType) => (
            <Bookmark key={bookmark.id} bookmark={bookmark} />
          ))}

          {/* Pagination */}
          <div>
            {/* Pagination prev */}
            {pagePos > 0 && <button onClick={() => pageDispatch({type: 'prev'})}>&lt;</button>}

            {/* Pagination text */}
            <span>{`${pagePos + 1} to ${Math.min(pagePos + pageSize, data.allBookmarks.length)} over ${
              data.allBookmarks.length
            }`}</span>

            {/* Pagination next */}
            {pagePos + pageSize < data.allBookmarks.length && (
              <button onClick={() => pageDispatch({type: 'next'})}>&gt;</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
