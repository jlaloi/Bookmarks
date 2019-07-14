import * as React from 'react';

interface EditableTextInput {
  value: string;
  onUpdate: (v: string) => any;
  placeholder: string;
}

export const EditableText = ({value, onUpdate, placeholder}: EditableTextInput) => {
  // Input elt ref to manage focus
  const inputRef = React.useRef(null);

  // Is the text editable
  const [edit, setEdit] = React.useState(false);

  // New value state
  const [newValue, setNewValue] = React.useState(value);

  // Form submit handler to update parent
  const updateHandler = event => {
    event.preventDefault();
    onUpdate(newValue);
    setEdit(false);
  };

  // On edition > focus to the input elt
  React.useEffect(() => {
    if (edit) inputRef.current.focus();
  }, [edit]);
  return !edit ? (
    /* Text display (read only) */
    <div className="EditableText" onClick={() => setEdit(true)} title="Click to edit">
      {value}
    </div>
  ) : (
    /* Text edit form */
    <form onSubmit={updateHandler}>
      <input
        type="text"
        value={newValue}
        placeholder={placeholder}
        onChange={event => setNewValue(event.target.value)}
        ref={inputRef}
        onBlur={() => setEdit(false)}
        required
      />
    </form>
  );
};
