import React from 'react';
import ReactDOM from 'react-dom';
import { register } from './sw';

import App from './app/App';

ReactDOM.render(<App />, document.getElementById('root'));
register().then(() => {
  console.log('Registered..');
});
