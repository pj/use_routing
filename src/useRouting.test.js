import {parseRoute, matchRouteAndGenerateState} from './useRouting';

it('parses routes', () => {
  let route = parseRoute('');
  expect(route.path.length).toEqual(0);
  expect(route.params.size).toEqual(0);

  route = parseRoute('/');
  expect(route.path.length).toEqual(0);
  expect(route.params.size).toEqual(0);

  route = parseRoute('/hello_id=number');
  expect(route.path.length).toEqual(1);
  expect(route.path[0].name).toEqual('hello_id');
  expect(route.path[0].type).toEqual('number');
  expect(route.params.size).toEqual(0);

  route = parseRoute('/hello');
  expect(route.path.length).toEqual(1);
  expect(route.path[0].name).toEqual('hello');
  expect(route.path[0].type).toEqual('path');
  expect(route.params.size).toEqual(0);

  route = parseRoute('/hello/world');
  expect(route.path.length).toEqual(2);
  expect(route.path[0].name).toEqual('hello');
  expect(route.path[0].type).toEqual('path');
  expect(route.path[1].name).toEqual('world');
  expect(route.path[1].type).toEqual('path');
  expect(route.params.size).toEqual(0);

  route = parseRoute('/hello/hello_id=number');
  expect(route.path.length).toEqual(2);
  expect(route.path[0].name).toEqual('hello');
  expect(route.path[0].type).toEqual('path');
  expect(route.path[1].name).toEqual('hello_id');
  expect(route.path[1].type).toEqual('number');
  expect(route.params.size).toEqual(0);

  route = parseRoute('?hello_id=number');
  expect(route.path.length).toEqual(0);
  expect(route.params.size).toEqual(1);
  const hello_id = route.params.get('hello_id');
  expect(hello_id).not.toBeNull();
  expect(hello_id.type).toBe('number');
  expect(hello_id._default).toBeNull();

  route = parseRoute('/hello/hello_id=string/world/world_id=number?x=boolean&y=1.234&z=42');
  expect(route.path.length).toEqual(4);
  expect(route.path[0].name).toEqual('hello');
  expect(route.path[0].type).toEqual('path');
  expect(route.path[1].name).toEqual('hello_id');
  expect(route.path[1].type).toEqual('string');
  expect(route.path[2].name).toEqual('world');
  expect(route.path[2].type).toEqual('path');
  expect(route.path[3].name).toEqual('world_id');
  expect(route.path[3].type).toEqual('number');
  expect(route.params.size).toEqual(3);
  const x = route.params.get('x');
  expect(x).not.toBeNull();
  expect(x.type).toBe('boolean');
  expect(x._default).toBeNull();
  const y = route.params.get('y');
  expect(y).not.toBeNull();
  expect(y.type).toBe('number');
  expect(y._default).toBe(1.234);
  const z = route.params.get('z');
  expect(z).not.toBeNull();
  expect(z.type).toBe('number');
  expect(z._default).toBe(42);
});

it('matches routes', () => {
  const routes = new Map([
    [
      'hello',
      {
        path: [{
          name: 'hello',
          type: 'path',
          _default: null
        },{
          name: 'hello_id',
          type: 'number',
          _default: null
        }],
        params: new Map([['x', {type: 'boolean', _default: null}]])
      }
    ],[
      'hello_world',
      {
        path: [{
          name: 'hello',
          type: 'path',
          _default: null
        },
        {
          name: 'hello_id',
          type: 'number',
          _default: null
        },
        {
          name: 'world',
          type: 'path',
          _default: null
        },
        {
          name: 'world_id',
          type: 'string',
          _default: null
        }
        ],
        params: new Map([
          ['x', {type: 'boolean', _default: null}],
          ['y', {type: 'number', _default: 1234}]
        ])
      }
    ]
  ]);

  //let result = matchRouteAndGenerateState('', routes);
  //expect(result.name).toEqual('root');
  //expect(result.type).toEqual('path');

  let result = matchRouteAndGenerateState('/hello/1234?x=true', routes);
  expect(result.name).toEqual('hello');
  expect(result.state).toEqual({hello_id: 1234, x: true});

  result = matchRouteAndGenerateState('/hello/1234/world/blah?x=true', routes);
  expect(result.name).toEqual('hello_world');
  expect(result.state).toEqual({hello_id: 1234, world_id: 'blah', x: true, y: 1234});

  result = matchRouteAndGenerateState('/hello/1234/world/blah?x=true&y=4343', routes);
  expect(result.name).toEqual('hello_world');
  expect(result.state).toEqual({hello_id: 1234, world_id: 'blah', x: true, y: 4343});
});
