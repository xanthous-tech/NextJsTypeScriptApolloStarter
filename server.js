// server.js
const next = require('next');
const express = require('express');
const routes = require('./routes');

const app = next({ dev: process.env.NODE_ENV !== 'production' });
// const app = next({ dev: false });
const handler = routes.getRequestHandler(app);

// With express

app.prepare().then(() => {
  express()
    .use(handler)
    .listen(3000);
});
