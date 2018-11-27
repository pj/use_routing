import React from 'react';
import './App.css';
import {useRouter, useRouting} from './useRouting';

function SubApp(props) {
  const currentRoute = useRouting();
  console.log(currentRoute);
  return (
    <div className="App">
      Current route is: {currentRoute.path}
      <button onClick={(e) => currentRoute.navigate('thing')}>thing</button>
      <button onClick={(e) => currentRoute.navigate('other')}>other</button>
      <button onClick={(e) => currentRoute.navigate('yet_another')}>yet_another</button>
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
