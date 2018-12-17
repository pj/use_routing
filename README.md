# Use Routing

Toy react hooks hash router for learning react hooks.

**Do not use for anything real!**

# How to define routes.

Define your routes using an object where the keys are the route name and the 
path is a string that defines the path parts and parameters: 
"/blah/blah_id=string/asdf?qwer=number"

```javascript
import {useRouter} from './useRouting';

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
```

# Getting current route and navigation.

To get the current route and also navigate:

```javascript
import {useRouting} from './useRouting';

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
      <button id="forward" onClick={(e) => currentRoute.forward()}>
        Forward
      </button>
    </div>
  );
}
```

Check examples/App.js for a more complete example.
