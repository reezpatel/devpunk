import React from 'react';

const SearchIcon = ({ onClick }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      onClick={onClick}
    >
      <circle cx="10.5" cy="10.5" r="7.5"></circle>
      <line x1="21" y1="21" x2="15.8" y2="15.8"></line>
    </svg>
  );
};

export { SearchIcon };
