/// <reference types="react" />
export declare function parseRoute(route: string): {
    path: {
        name: string;
        type: string;
        _default: null;
    }[];
    params: Map<any, any>;
};
declare type RoutePart = {
    _type: 'path' | 'string' | 'number' | 'boolean';
    name: string;
};
declare type Param = {
    _type: 'path' | 'string' | 'number' | 'boolean';
    _default: string | number | boolean | null;
};
declare type Route = {
    path: RoutePart[];
    params: Map<string, Param>;
};
declare type RouteState = {
    [key: string]: string | number | boolean;
};
export declare function matchRouteAndGenerateState(hash: string, routes: Map<string, Route>): {
    name: string;
    state: RouteState;
};
export declare function formatUrl(name: string, params: {
    [key: string]: string | number | boolean;
}, routes: Map<string, Route>): string;
export declare function useRouter(component: JSX.Element, routes: {
    [key: string]: string;
}): JSX.Element;
export declare function useRouting(): null;
export {};
