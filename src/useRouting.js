import React, { useState, useEffect, useContext } from 'react';

class Segment {

}

class PathSegment extends Segment {
  constructor(name) {
    this.name = name;
  }
}

class PathVarSegment extends Segment {
  constructor(name, type, def) {
    this.name = name;
    this.type = type;
    this.def = def;
  }
}

class Route {
  constructor(segments, params) {
    this.segments = segments;
    this.params = params;
  }
  
  match(url) {
  
  }
}

//function checkDefault(type, _default) {
//    switch (type) {
//    case 'string':
//      return typeof _default === 'string';
//    case 'number':
//      return typeof _default === 'number';
//    case 'boolean':
//      return typeof _default === 'boolean';
//    default:
//      return false;
//    }
//}
//
//const VALID_TYPES = [
//  'string',
//  'number',
//  'boolean'
//];
//
//export function p(spec) {
//    spec = spec[0];
//    switch (spec) {
//    case 'string':
//      return ['string', null];
//    case 'number':
//      return ['number', null];
//    case 'boolean':
//      return ['boolean', null];
//    case 'true':
//      return ['boolean', true];
//    case 'false':
//      return ['boolean', false];
//    default:
//      if (spec.match(/^\d+$/)) {
//        return ['number', parseInt(spec)];
//      } else if (spec.match(/^\d+\.\d+/)) {
//        return ['number', parseFloat(spec)];
//      } else {
//        return ['string', spec];
//      }
//    }
//}
//
//export function path(name, type, _default) {
//  if (_default === undefined) {
//    if (_type === undefined) {
//      return PathVarSegment(name, 'string', null);
//    }
//    if (VALID_TYPES.indexOf(type) !== -1) {
//      return PathVarSegment(name, type, null);
//    }
//
//    switch (typeof type) {
//    case 'string':
//      return PathVarSegment(name, 'string', type);
//    case 'number':
//      return PathVarSegment(name, 'number', type);
//    case 'boolean':
//      return PathVarSegment(name, 'boolean', type);
//    }
//
//    throw new Error(`Invalid type or can't infer type: ${type}`);
//  }
//
//  if (VALID_TYPES.indexOf(type) !== -1) {
//    if (!checkDefault(type, _default)) {
//      throw new Error(`Default ${_default} is not of type ${type}`)
//    }
//    return new PathVarSegment(
//      name,
//      type,
//      _default
//    )
//  }
//  throw new Error(`Invalid type or can't infer type: ${type}`);
//}
//
const VALID_IDENTIFIER = '[a-zA-Z_][a-zA-Z_0-9]*';

//export function route(strings, ...exps) {
//  const segments = [];
//  const params = new Map();
//  const queryAmpersand = new RegExp(`^&(${VALID_IDENTIFIER})=$`);
//  const queryQuestion = new RegExp(`^\\?(${VALID_IDENTIFIER})=$`);
//  const pathQuestion = new RegExp(`^/(${VALID_IDENTIFIER})\\?(${VALID_IDENTIFIER})=$`);
//  const pathParam = new RegExp(`^(/${VALID_IDENTIFIER})+/${VALID_IDENTIFIER}=$`);
//  const path = new RegExp(`^(/${VALID_IDENTIFIER})+$`);
//
//  let inQuery = false;
//  let currentExp = 0;
//  for (let piece of strings) {
//    if (inQuery) {
//      if (piece === '') {
//        break;
//      }
//      const match = piece.match(queryAmpersand);
//      if (match) {
//        const name = match[1];
//        const exp = exps[currentExp];
//        currentExp = currentExp + 1;
//        params.set(name, exp);
//      } else {
//        throw new Error(`Invalid query parameter: ${piece}`);
//      }
//    } else {
//      let match = piece.match(queryQuestion);
//      if (match) {
//        inQuery = true;
//        const exp = exps[currentExp];
//        currentExp = currentExp + 1;
//        params.set(match[1], exp);
//        continue;
//      }
//
//      let match = piece.match(pathQuestion);
//      if (match) {
//        inQuery = true;
//
//        const exp = exps[currentExp];
//        currentExp = currentExp + 1;
//        params.set(match[1], exp);
//        continue;
//      }
//
//    
//    }
//
//
//  }
//
//
//  // Interleave strings and exps
//  let expPosition = 0;
//
//  return strings;
//}
const typeType = '(string|number|boolean)';
const intType = '(\\d+)';
const floatType = '(\\d+\.\\d+)';
const boolType = '(true|false)';
const stringType = '(.*)';

export function parseRoute(route) {
  const url = new URL(route, 'http://hello');

  const segments = [];
  const params = new Map();

  const typeType = '(string|number|boolean)';
  const typePath = new RegExp(`^(${VALID_IDENTIFIER})=${typeType}$`);
  const intType = '(\\d+)';
  const intPath = new RegExp(`^(${VALID_IDENTIFIER})=${intType}$`);
  const floatType = '(\\d+\.\\d+)';
  const floatPath = new RegExp(`^(${VALID_IDENTIFIER})=${floatType}$`);
  const boolType = '(true|false)';
  const boolPath = new RegExp(`^(${VALID_IDENTIFIER})=${boolType}$`);
  const stringType = '(.*)';
  const stringPath = new RegExp(`^(${VALID_IDENTIFIER})=${stringType}$`);
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

    match = value.match(intType);
    if (match) {
      params.set(key, {type: 'number', _default: parseInt(value)});
      continue;
    }

    match = value.match(floatType);
    if (match) {
      params.set(key, {type: 'number', _default: parseFloat(value)});
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

  return [segments, params];
}

export function matchRouteAndGenerateState(hash, routes) {
  const url = new URL(window.location.hash, 'http://hello');
  const pathSplit = url.pathname.split('/');
  let newState = {};

  goto_routes:
  for (let nameRoute of routes) {
    let name = nameRoute[0];
    let route = nameRoute[1];
    let routePath = route[0];
    let routeParams = route[1];
    newState = {};
    if (routePath.length === pathSplit) {
      for (let n in routePath) {
        const routePart = routePath[n];
        const urlPart = pathSplit[n];
        if (routePart.type === 'path' && routePart.name !== urlPart) {
          continue goto_routes;
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
          if (!isNan(intParsed)) {
            newState[routePart.name] = intParsed;
            continue;
          }

          const floatParsed = parseFloat(urlPart);
          if (!isNan(floatParsed)) {
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

      if ()
    }
  }

  throw new Error(`No valid route found for url: ${hash}`);
}

const RoutingContext = React.createContext(null);

export function useRouter(component, routes) {
  const [currentRoute, setCurrentRoute] = useState(null);
  const parsedRoutes = new Map();

  routes.entries().forEach((nameRoute) => {
    parsedRoutes.set(nameRoute[0], parseRoute(nameRoute[1]));
  });

  const routingValue = {
    back() {},
    forward() {},
    navigate() {},
  };

  useEffect(() => {
    // Alert some text if there has been changes to the anchor part
    function hashChange(event) {
      setCurrentRoute(window.location.hash);
    }

    window.addEventListener("hashchange", hashChange, false);

    return (function () {
      window.removeEventListener("hashchange", hashChange, false);
    });
  });


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

