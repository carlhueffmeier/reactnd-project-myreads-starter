import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';

const BookshelfChanger = props => {
  return (
    <div className="book-shelf-changer">
      <select
        value={props.value}
        onChange={event => props.onChange(event.target.value)}
      >
        <option value="none" disabled>
          Move to...
        </option>
        <option value="currentlyReading">Currently Reading</option>
        <option value="wantToRead">Want to Read</option>
        <option value="read">Read</option>
        <option value="none">none</option>
      </select>
    </div>
  );
};

BookshelfChanger.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default BookshelfChanger;
