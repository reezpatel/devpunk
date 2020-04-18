import React from 'react';
import ReactDOM from 'react-dom';
import { register } from './sw';

import App from './app/app';

ReactDOM.render(<App />, document.getElementById('root'));
register().then(registration => {
  console.log('Registered..');
});
