import React, { useState, useEffect, useContext } from 'react';
const VALID_IDENTIFIER = '[a-zA-Z_][a-zA-Z_0-9]*';
const stringType = '(.*)';

export function parseRoute(route) {
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
      segments.push({name: match[1], type: match[2], _default: null});
      continue;
    }

    match = part.match(partPath);

    if (match) {
      segments.push({name: match[1], type: 'path', _default: null});
      continue;
    }

    throw new Error(`Invalid path part ${part} in route ${route}`);
  }

  for (let entry of url.searchParams) {
    let key = entry[0];
    let value = entry[1];

    let match = value.match(typeType);
    if (match) {
      params.set(key, {type: value, _default: null});
      continue;
    }

    match = value.match(floatType);
    if (match) {
      params.set(key, {type: 'number', _default: parseFloat(value)});
      continue;
    }

    match = value.match(intType);
    if (match) {
      params.set(key, {type: 'number', _default: parseInt(value)});
      continue;
    }

    match = value.match(boolType);
    if (match) {
      params.set(key, {type: 'boolean', _default: value === true});
      continue;
    }

    match = value.match(stringType);
    if (match) {
      params.set(key, {type: 'string', _default: value});
      continue;
    }

    throw new Error(`Invalid query parameter name: ${key} value: ${value} in route: ${route}`)
  }

  return {path: segments, params: params};
}

export function matchRouteAndGenerateState(hash, routes) {
  hash = hash.replace('#', '');
  const url = new URL(hash, 'https://hello');
  let pathSplit = url.pathname.split('/');
  pathSplit = pathSplit.filter((part) => !part.match(/^\s*$/));
  let newState = {};

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
        if (routePart.type === 'path' && routePart.name !== urlPart) {
          continue goto_routes;
        } else if (routePart.type === 'path') {
          continue;
        }

        if (routePart.type === 'boolean') {
          if (urlPart === 'true' || urlPart === 'false') {
            newState[routePart.name] = urlPart === 'true';
            continue;
          }
          continue goto_routes;
        }

        if (routePart.type === 'number') {
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

        if (routePart.type === 'string') {
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
        let value = url.searchParams.get(name);

        if (value === null && options._default) {
          value = options._default;
        }

        if (value === null) {
          continue;
        }

        if (options.type === 'boolean') {
          if (value === 'true' || value === 'false') {
            value = value === 'true';
          } else {
            throw new Error(`Invalid boolean for param: ${name} boolean: ${value}`);
          }
        }

        if (options.type === 'number') {
          const intParsed = parseInt(value);
          const floatParsed = parseFloat(value);
          if (!isNaN(intParsed)) {
            value = intParsed;
          } else if (!isNaN(floatParsed)) {
            value = floatParsed;
          } else {
            throw new Error(`Invalid number for param: ${name} number ${value}`);
          }
        }

        newState[name] = value;
      }

      return {name: name, state: newState};
    }
  }

  throw new Error(`No valid route found for url: ${hash}`);
}

export function formatUrl(name, params, routes) {
  params = params || {};
  const route = routes.get(name);
  const pathParts = [];
  if (route) {
    for (let routePart of route.path) {
      if (routePart.type === 'path') {
        pathParts.push(routePart.name);
        continue;
      }

      let value = params[routePart.name];
      if (value === undefined) {
        value = routePart._default;
      }
      if (!value) {
        throw new Error(`Path param ${routePart.name} not found and no default while generating url for ${name}`);
      }
      pathParts.push(value);
    }
    const formattedParams = [];
    for (const param of route.params.entries()) {
      const paramName = param[0];
      const details = param[1];
      let value = params[paramName];
      if (!value) {
        value = details._default;
      }

      if (value) {
        formattedParams.push(`${paramName}=${value}`);
        continue;
      }

      throw new Error(`Query param ${paramName} not found and no default while generating url for ${name}`);
    }

    return `/${pathParts.join('/')}?${formattedParams.join('&')}`;
  } else {
    throw new Error(`No route found for name ${name}`);
  }
}

const RoutingContext = React.createContext(null);
const parsedRoutes = new Map();

export function useRouter(component, routes) {
  const [currentRoute, setCurrentRoute] = useState(null);

  Object.entries(routes).forEach((nameRoute) => {
    parsedRoutes.set(nameRoute[0], parseRoute(nameRoute[1]));
  });

  let routingValue = null;
  if (currentRoute) {
    routingValue = {
      back() {
        window.history.back();
      },
      forward() {
        window.history.forward();
      },
      navigate(name, params) {
        const url = formatUrl(name, params, parsedRoutes);
        window.location.hash = url;
      },
      name: currentRoute.name,
      state: currentRoute.state,
    };
  }

  useEffect(() => {
    function hashChange(event) {
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
  const currentRoute = useContext(RoutingContext);
  return currentRoute;
}

