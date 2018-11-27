import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {parseRoute} from './useRouting';
import jsdom

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  window.location = '#/thing';
  ReactDOM.unmountComponentAtNode(div);
});
