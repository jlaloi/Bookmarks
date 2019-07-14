import * as React from 'react';
import {useMutation} from '@apollo/react-hooks';
import {getMetaData} from '../config/metadataProvider';
import {CREATE_BOOKMARK} from '../config/queries';

export const BookmarkAdd = () => {
  // Bookmark url
  const [url, setUrl] = React.useState('');
  const formRef = React.useRef(null);

  // Mutation to persit
  const [createBookmark, {error}] = useMutation(CREATE_BOOKMARK, {
    refetchQueries: ['allBookmarks'],
  });

  // Handle form submit to persist
  const handleSubmit = async event => {
    event.preventDefault();
    const metadata = await getMetaData(url);
    createBookmark({variables: {url, createdDate: new Date(), ...metadata}});
    formRef.current.reset();
  };

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <input type="text" required placeholder="New Bookmark" onChange={e => setUrl(e.target.value)} />
      <button>Add</button>
      {error && <div className="error">{error.message}</div>}
    </form>
  );
};
