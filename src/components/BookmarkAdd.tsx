import * as React from 'react';
import {useMutation} from '@apollo/react-hooks';
import {getMetadata} from '../config/metadataProvider';
import {CREATE_BOOKMARK} from '../config/queries';

export const BookmarkAdd = () => {
  // New Bookmark url
  const [url, setUrl] = React.useState('');
  // Form ref to reset
  const formRef = React.useRef(null);

  // Mutation to create new Bookmark
  const [createBookmark, {error}] = useMutation(CREATE_BOOKMARK, {
    refetchQueries: ['allBookmarks'],
  });

  // Handle form submit to persist
  const handleSubmit = async event => {
    event.preventDefault();
    const metadata = await getMetadata(url);
    createBookmark({variables: {url, createdDate: new Date(), ...metadata}});
    formRef.current.reset();
  };

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      {url}
      {/* No need of "value={url}" as the form is reseted to clear validation */}
      <input type="text" placeholder="New Bookmark" onChange={e => setUrl(e.target.value)} required />
      <button>Add</button>
      {/* Mutation error */}
      {error && <div className="error">{error.message}</div>}
    </form>
  );
};
