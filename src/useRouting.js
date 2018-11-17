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

function checkDefault(type, _default) {
    switch (type) {
    case 'string':
      return typeof _default === 'string';
    case 'number':
      return typeof _default === 'number';
    case 'boolean':
      return typeof _default === 'boolean';
    default:
      return false;
    }
}

const VALID_TYPES = [
  'string',
  'number',
  'boolean'
];

export function p(spec) {
    spec = spec[0];
    switch (spec) {
    case 'string':
      return ['string', null];
    case 'number':
      return ['number', null];
    case 'boolean':
      return ['boolean', null];
    case 'true':
      return ['boolean', true];
    case 'false':
      return ['boolean', false];
    default:
      if (spec.match(/^\d+$/)) {
        return ['number', parseInt(spec)];
      } else if (spec.match(/^\d+\.\d+/)) {
        return ['number', parseFloat(spec)];
      } else {
        return ['string', spec];
      }
    }
}

export function path(name, type, _default) {
  if (_default === undefined) {
    if (_type === undefined) {
      return PathVarSegment(name, 'string', null);
    }
    if (VALID_TYPES.indexOf(type) !== -1) {
      return PathVarSegment(name, type, null);
    }

    switch (typeof type) {
    case 'string':
      return PathVarSegment(name, 'string', type);
    case 'number':
      return PathVarSegment(name, 'number', type);
    case 'boolean':
      return PathVarSegment(name, 'boolean', type);
    }

    throw new Error(`Invalid type or can't infer type: ${type}`);
  }

  if (VALID_TYPES.indexOf(type) !== -1) {
    if (!checkDefault(type, _default)) {
      throw new Error(`Default ${_default} is not of type ${type}`)
    }
    return new PathVarSegment(
      name,
      type,
      _default
    )
  }
  throw new Error(`Invalid type or can't infer type: ${type}`);
}

const VALID_IDENTIFIER = '[a-zA-Z_][a-zA-Z_0-9]*';

export function route(strings, ...exps) {
  const segments = [];
  const params = new Map();
  const queryAmpersand = new RegExp(`^&(${VALID_IDENTIFIER})=$`);
  const queryQuestion = new RegExp(`^\\?(${VALID_IDENTIFIER})=$`);
  const pathQuestion = new RegExp(`^/(${VALID_IDENTIFIER})\\?(${VALID_IDENTIFIER})=$`);
  const pathParam = new RegExp(`^(/${VALID_IDENTIFIER})+/${VALID_IDENTIFIER}=$`);
  const path = new RegExp(`^(/${VALID_IDENTIFIER})+$`);

  let inQuery = false;
  let currentExp = 0;
  for (let piece of strings) {
    if (inQuery) {
      if (piece === '') {
        break;
      }
      const match = piece.match(queryAmpersand);
      if (match) {
        const name = match[1];
        const exp = exps[currentExp];
        currentExp = currentExp + 1;
        params.set(name, exp);
      } else {
        throw new Error(`Invalid query parameter: ${piece}`);
      }
    } else {
      let match = piece.match(queryQuestion);
      if (match) {
        inQuery = true;
        const exp = exps[currentExp];
        currentExp = currentExp + 1;
        params.set(match[1], exp);
        continue;
      }

      let match = piece.match(pathQuestion);
      if (match) {
        inQuery = true;

        const exp = exps[currentExp];
        currentExp = currentExp + 1;
        params.set(match[1], exp);
        continue;
      }

    
    }


  }


  // Interleave strings and exps
  let expPosition = 0;

  return strings;
}

export function matchRoutes(url) {

}

const RoutingContext = React.createContext(null);

export function useRouter(props, routes) {
  const [currentRoute, setCurrentRoute] = useState(null);

  const routingValue = {
    back() {},
    forward() {},
    navigate() {},
  };

  useEffect(() => {
    // Alert some text if there has been changes to the anchor part
    function hashChange() {
      const url = new URL(window.location.hash);
      setCurrentRoute(window.location.hash);
    }

    window.addEventListener("hashchange", hashChange, false);

    return (function () {
      window.removeEventListener("hashchange", hashChange, false);
    });
  });


  return (
    <RoutingContext.Provider value={routingValue}>
      {props.children}
    </RoutingContext.Provider>
  );
}

export function useRouting() {
  const currentRoute = useContext(RoutingContext);
  return currentRoute;
}

