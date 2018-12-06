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
    </div>
  );
}

function App(props) {
  return useRouter(
    <SubApp />,
    {
      thing: '/thing',
      other: '/other/other_id=number',
      yet_another: '/other?thing=42'

    }
  );
}

export default App;
