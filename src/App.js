import React from 'react';
import './App.css';
import {RoutingProvider, useRouting} from './useRouting';

function SubApp(props) {
  const currentRoute = useRouting();
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
  return (
    <RoutingProvider>
      <SubApp />
    </RoutingProvider>
  );
}

export default App;
