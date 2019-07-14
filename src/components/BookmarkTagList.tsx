import * as React from 'react';
import {useMutation} from '@apollo/react-hooks';

import {UPDATE_BOOKMARK_TAGS} from '../config/queries';
import {EditableText} from './EditableText';
import {Bookmark} from '../config/types';

type Action =
  | {type: 'add'; payload: string}
  | {type: 'delete'; index: number}
  | {type: 'update'; index: number; payload: string};

export const BookmarkTagList = ({bookmark}: {bookmark: Bookmark}) => {
  // New tag value
  const [newTag, setNewTag] = React.useState('');
  // Reference to new tag form to reset it after submit
  const formRef = React.useRef(null);

  // Reducer to manage an updated list of tags
  const [newTagList, newTagdispatch] = React.useReducer((state: string[], action: Action) => {
    switch (action.type) {
      case 'add':
        return [...state, action.payload];
      case 'delete':
        return [...state.slice(0, action.index), ...state.slice(action.index + 1)];
      case 'update':
        return [...state.slice(0, action.index), action.payload, ...state.slice(action.index + 1)];
      default:
        return state;
    }
  }, bookmark.tags);

  // Mutation to update tag list
  const [updateBookmarkTags, {error}] = useMutation(UPDATE_BOOKMARK_TAGS, {
    variables: {id: bookmark.id, tags: newTagList},
    refetchQueries: ['allBookmarks'],
  });

  // On tag list update > persist it (Avoid first run)
  const isFirstRun = React.useRef(true);
  React.useEffect(() => {
    !isFirstRun.current ? updateBookmarkTags() : (isFirstRun.current = false);
  }, [newTagList]);

  // Form handler to add a new tag
  const handleAddTagForm = event => {
    event.preventDefault();
    newTagdispatch({type: 'add', payload: newTag});
    formRef.current.reset();
  };

  return (
    <div className="BookmarkTagList">
      {/*Tag list*/}
      {newTagList.map((tag, index) => (
        <span key={index} className="BookmarkTag">
          {/* Tag edit name */}
          <EditableText
            value={tag}
            onUpdate={payload => newTagdispatch({type: 'update', index, payload})}
            placeholder="Tag"
          />

          {/* Tag delete */}
          <button onClick={() => newTagdispatch({type: 'delete', index})} className="delete">
            X
          </button>
        </span>
      ))}

      {/* Add new tag form */}
      <form onSubmit={handleAddTagForm} ref={formRef}>
        <input type="text" required placeholder="Add tag" onChange={event => setNewTag(event.target.value)} />
      </form>

      {/* Graphql error */}
      {error && <div className="error">{error.message}</div>}
    </div>
  );
};
