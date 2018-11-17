import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {parseRoute} from './useRouting';

//it('renders without crashing', () => {
//  const div = document.createElement('div');
//  ReactDOM.render(<App />, div);
//  ReactDOM.unmountComponentAtNode(div);
//});

it('parses routes', () => {
  //const r = route`/hello/hello_id=${p`number`}/world/world_id=${p`2`}?x=${p`number`}&y=${p`1.234`}`;

  console.log(parseRoute(''));
  console.log(parseRoute('/'));
  console.log(parseRoute('/hello_id=number'));
  console.log(parseRoute('/hello'));
  console.log(parseRoute('/hello/world'));
  console.log(parseRoute('/hello/hello_id=number'));
  console.log(parseRoute('/hello/hello_id=number'));
  console.log(parseRoute('/hello/hello_id=number/world/world_id=number?x=number&y=1.234'));
});
