import React from 'react';
import './App.css';
import {useRouter, useRouting} from './useRouting';

function SubApp(props) {
  const currentRoute = useRouting();
  if (currentRoute === null) {
    return null;
  }
  return (
    <div className="App">
      <div id="path">{currentRoute.name}</div>
      <div id="params">{JSON.stringify(currentRoute.state, null, 2)}</div>
      <button id="back" onClick={(e) => currentRoute.back()}>Back</button>
      <button id="thing" onClick={(e) => currentRoute.navigate('thing')}>
        thing
      </button>
      <button id="other" onClick={(e) => currentRoute.navigate('other', {'other_id': 123})}>
        other
      </button>
      <button
        id="yet_another"
        onClick={(e) => currentRoute.navigate('yet_another')}
      >
        yet_another
      </button>
      <button
        id="hello_world"
        onClick={(e) => currentRoute.navigate('hello_world')}
      >
        hello_world
      </button>
      <button
        id="blah"
        onClick={
          (e) => currentRoute.navigate('blah', {'blah_id': 'xxxxx', 'qwer': 42})
        }
      >
        blah
      </button>
      <button id="forward" onClick={(e) => currentRoute.forward()}>
        Forward
      </button>
    </div>
  );
}

function App(props) {
  return useRouter(
    <SubApp />,
    {
      thing: '/thing',
      other: '/other/other_id=number',
      yet_another: '/other?thing=42',
      hello_world: '/hello/world',
      blah: '/blah/blah_id=string/asdf?qwer=number'
    }
  );
}

export default App;
