const nextRoutes = require('next-routes');

const routes = nextRoutes();
routes.add('test', '/@:nickname', 'apollo');

module.exports = routes;
