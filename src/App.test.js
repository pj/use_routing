import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {route, p} from './useRouting';

//it('renders without crashing', () => {
//  const div = document.createElement('div');
//  ReactDOM.render(<App />, div);
//  ReactDOM.unmountComponentAtNode(div);
//});

it('renders without crashing', () => {
  const r = route`/hello/hello_id=${p`number`}/world/world_id=${p`2`}?x=${p`number`}&y=${p`1.234`}`;
  console.log(r);
});
