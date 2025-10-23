const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  name: 'customers-mfe',

  filename: 'remoteEntry.js',

  exposes: {
    './customersRoutes': './projects/customers-mfe/src/app/customers/customers.routes.ts',
  },


  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});
