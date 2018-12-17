"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_dom_1 = require("react-dom");
const useRouting_1 = require("./useRouting");
function SubApp(props) {
    const currentRoute = useRouting_1.useRouting();
    if (currentRoute === null) {
        return null;
    }
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("div", { id: "path" }, currentRoute.name),
        react_1.default.createElement("div", { id: "params" }, JSON.stringify(currentRoute.state, null, 2)),
        react_1.default.createElement("button", { id: "back", onClick: (e) => currentRoute.back() }, "Back"),
        react_1.default.createElement("button", { id: "root", onClick: (e) => currentRoute.navigate('root') }, "root"),
        react_1.default.createElement("button", { id: "thing", onClick: (e) => currentRoute.navigate('thing') }, "thing"),
        react_1.default.createElement("button", { id: "other", onClick: (e) => currentRoute.navigate('other', { 'other_id': 123 }) }, "other"),
        react_1.default.createElement("button", { id: "yet_another", onClick: (e) => currentRoute.navigate('yet_another') }, "yet_another"),
        react_1.default.createElement("button", { id: "hello_world", onClick: (e) => currentRoute.navigate('hello_world') }, "hello_world"),
        react_1.default.createElement("button", { id: "blah", onClick: (e) => currentRoute.navigate('blah', { 'blah_id': 'xxxxx', 'qwer': 42 }) }, "blah"),
        react_1.default.createElement("button", { id: "forward", onClick: (e) => currentRoute.forward() }, "Forward")));
}
function App(props) {
    return useRouting_1.useRouter(react_1.default.createElement(SubApp, null), {
        root: '',
        thing: '/thing',
        other: '/other/other_id=number',
        yet_another: '/other?thing=42',
        hello_world: '/hello/world',
        blah: '/blah/blah_id=string/asdf?qwer=number'
    });
}
react_dom_1.default.render(react_1.default.createElement(App, null), document.getElementById('root'));
