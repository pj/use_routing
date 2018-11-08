import React, { useState, useEffect } from 'react';
import './App.css';

function useRouting(routes) {
  const [currentRoute, setCurrentRoute] = useState('default');

  useEffect(() => {
    // Alert some text if there has been changes to the anchor part
    function hashChange() {
      setCurrentRoute(window.location.hash);
    }

    window.addEventListener("hashchange", hashChange, false);

    return (function () {
      window.removeEventListener("hashchange", hashChange, false);
    });
  });

  return [currentRoute, setCurrentRoute];
}

function App(props) {
  const routes = [:w
    {

    }
  ];
  const [currentRoute, setCurrentRoute] = useRouting();

  return (
    <div className="App">
      Current route is: {currentRoute}
      <button onClick={(e) => setCurrentRoute('thing')}>thing</button>
      <button onClick={(e) => setCurrentRoute('other')}>other</button>
      <button onClick={(e) => setCurrentRoute('yet_another')}>yet_another</button>
    </div>
  );
}

export default App;
