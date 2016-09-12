import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/app';

// Render the main component into the dom
var rootEl = document.getElementById('app');

var t0 = performance.now();

ReactDOM.render(<App />, rootEl);

var t1 = performance.now();

console.log("Call To render app t: " + (t1 - t0) + "ms");
