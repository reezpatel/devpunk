import React from 'react';
import './icons.scss';

const ShareIcon = ({ onClick }) => {
  return (
    <svg
      version="1.1"
      x="0px"
      y="0px"
      width="24"
      height="24"
      onClick={onClick}
      viewBox="0 0 24 24"
    >
      <circle className="st0" cx="18" cy="5" r="3" />
      <circle className="st0" cx="6" cy="12" r="3" />
      <circle className="st0" cx="18" cy="19" r="3" />
      <line className="st0" x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
      <line className="st0" x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
    </svg>
  );
};

export { ShareIcon };
