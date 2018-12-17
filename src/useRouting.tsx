import * as React from "react";
import * as ReactDOM from "react-dom";
const VALID_IDENTIFIER = '[a-zA-Z_][a-zA-Z_0-9]*';
const stringType = '(.*)';

export function parseRoute(route: string) {
  const url = new URL(route, 'http://hello');

  const segments = [];
  const params = new Map();

  const typeType = '(string|number|boolean)';
  const typePath = new RegExp(`^(${VALID_IDENTIFIER})=${typeType}$`);
  const intType = '(\\d+)';
  const floatType = '(\\d+\.\\d+)';
  const boolType = '(true|false)';
  const stringType = '(.*)';
  const partPath = new RegExp(`^(${VALID_IDENTIFIER})$`);

  const pathParts = url.pathname.split('/');
  for (let part of pathParts) {
    if (part === '') {
      continue;
    }

    let match = part.match(typePath);

    if (match) {
      segments.push({name: match[1], _type: match[2], _default: null});
      continue;
    }

    match = part.match(partPath);

    if (match) {
      segments.push({name: match[1], _type: 'path', _default: null});
      continue;
    }

    throw new Error(`Invalid path part ${part} in route ${route}`);
  }

  // @ts-ignore
  for (let entry of url.searchParams) {
    let key = entry[0];
    let value = entry[1];

    let match = value.match(typeType);
    if (match) {
      params.set(key, {_type: value, _default: null});
      continue;
    }

    match = value.match(floatType);
    if (match) {
      params.set(key, {_type: 'number', _default: parseFloat(value)});
      continue;
    }

    match = value.match(intType);
    if (match) {
      params.set(key, {_type: 'number', _default: parseInt(value)});
      continue;
    }

    match = value.match(boolType);
    if (match) {
      params.set(key, {_type: 'boolean', _default: value === 'true'});
      continue;
    }

    match = value.match(stringType);
    if (match) {
      params.set(key, {_type: 'string', _default: value});
      continue;
    }

    throw new Error(`Invalid query parameter name: ${key} value: ${value} in route: ${route}`)
  }

  return {path: segments, params: params};
}

type RoutePart = {
  _type: 'path' | 'string' | 'number' | 'boolean';
  name: string;
};

type Param = {
  _type: 'path' | 'string' | 'number' | 'boolean';
  _default: string | number | boolean | null;
};

type Route = {
  path: RoutePart[],
  params: Map<string, Param>
};

type RouteState = {
  [key: string]: string | number | boolean;
}

export function matchRouteAndGenerateState(
  hash: string,
  routes: Map<string, Route>
) {
  hash = hash.replace('#', '');
  const url = new URL(hash, 'https://hello');
  let pathSplit = url.pathname.split('/');
  pathSplit = pathSplit.filter((part) => !part.match(/^\s*$/));
  let newState = ({} as RouteState);

  goto_routes:
  for (let nameRoute of routes) {
    let name = nameRoute[0];
    let route = nameRoute[1];
    let routePath = route.path;
    let routeParams = route.params;
    newState = {};
    if (routePath.length === pathSplit.length) {
      for (let n = 0; n < routePath.length; n++) {
        const routePart = routePath[n];
        const urlPart = pathSplit[n];
        if (routePart._type === 'path' && routePart.name !== urlPart) {
          continue goto_routes;
        } else if (routePart._type === 'path') {
          continue;
        }

        if (routePart._type === 'boolean') {
          if (urlPart === 'true' || urlPart === 'false') {
            newState[routePart.name] = urlPart === 'true';
            continue;
          }
          continue goto_routes;
        }

        if (routePart._type === 'number') {
          const intParsed = parseInt(urlPart);
          if (!isNaN(intParsed)) {
            newState[routePart.name] = intParsed;
            continue;
          }

          const floatParsed = parseFloat(urlPart);
          if (!isNaN(floatParsed)) {
            newState[routePart.name] = floatParsed;
            continue;
          }

          continue goto_routes;
        }

        if (routePart._type === 'string') {
          const match = urlPart.match(stringType);
          if (match) {
            newState[routePart.name] = urlPart;
            continue;
          }
          continue goto_routes;
        }

        throw new Error(`Unable to identify path part ${urlPart} ${routePart}`)
      }

      for (let param of routeParams) {
        const name = param[0];
        const options = param[1]
        let paramValue = url.searchParams.get(name);

        if (paramValue === null && options._default) {
          newState[name] = options._default;
        }

        if (paramValue === null) {
          continue;
        }

        if (options._type === 'boolean') {
          if (paramValue === 'true' || paramValue === 'false') {
            newState[name] = paramValue === 'true';
          } else {
            throw new Error(`Invalid boolean for param: ${name} boolean: ${paramValue}`);
          }
        }

        if (options._type === 'number') {
          const intParsed = parseInt(paramValue);
          const floatParsed = parseFloat(paramValue);
          if (!isNaN(intParsed)) {
            newState[name] = intParsed;
          } else if (!isNaN(floatParsed)) {
            newState[name] = floatParsed;
          } else {
            throw new Error(`Invalid number for param: ${name} number ${paramValue}`);
          }
        }

      }

      return {name: name, state: newState};
    }
  }

  throw new Error(`No valid route found for url: ${hash}`);
}

export function formatUrl(
  name: string,
  params: {[key: string]: string | number | boolean},
  routes: Map<string, Route>
) {
  params = params || {};
  const route = routes.get(name);
  const pathParts = [];
  if (route) {
    for (let routePart of route.path) {
      if (routePart._type === 'path') {
        pathParts.push(routePart.name);
        continue;
      }

      let value = params[routePart.name];
      if (!value) {
        throw new Error(`Path param ${routePart.name} not found while generating url for ${name}`);
      }
      pathParts.push(value);
    }
    const formattedParams = [];
    for (const param of route.params.entries()) {
      const paramName = param[0];
      const details = param[1];
      let paramValue = params[paramName];
      let value: string | boolean | number | null = null;
      if (paramValue) {
        value = paramValue;
      } else {
        value = details._default;
      }

      if (value) {
        formattedParams.push(`${paramName}=${value}`);
        continue;
      }

      throw new Error(`Query param ${paramName} not found and no default while generating url for ${name}`);
    }

    if (formattedParams.length > 0) {
      return `/${pathParts.join('/')}?${formattedParams.join('&')}`;
    }
    return `/${pathParts.join('/')}`;
  } else {
    throw new Error(`No route found for name ${name}`);
  }
}

const RoutingContext = React.createContext(null);
const parsedRoutes = new Map();

type CurrentRoute = {
  name: string;
  state: RouteState;
};

export function useRouter(component: JSX.Element, routes: {[key: string]: string}) {
  const [currentRoute, setCurrentRoute] = (React.useState(null) as [CurrentRoute | null, any]);

  Object.entries(routes).forEach((nameRoute) => {
    parsedRoutes.set(nameRoute[0], parseRoute(nameRoute[1]));
  });

  let routingValue: any = null;
  if (currentRoute) {
    routingValue = {
      back() {
        window.history.back();
      },
      forward() {
        window.history.forward();
      },
      navigate(name: string, params: {[key: string]: string | number | boolean}) {
        const url = formatUrl(name, params, parsedRoutes);
        window.location.hash = url;
      },
      name: currentRoute.name,
      state: currentRoute.state,
    };
  }

  React.useEffect(() => {
    function hashChange(event?: HashChangeEvent) {
      if (event) {
        event.preventDefault();
      }
      const route = matchRouteAndGenerateState(window.location.hash, parsedRoutes);
      setCurrentRoute(route);
    }

    window.addEventListener("hashchange", hashChange, false);
    hashChange();

    return (function () {
      window.removeEventListener("hashchange", hashChange, false);
    });
  }, []);

  return (
    <RoutingContext.Provider value={routingValue}>
      {component}
    </RoutingContext.Provider>
  );
}

export function useRouting() {
  const currentRoute = React.useContext(RoutingContext);
  return currentRoute;
}

