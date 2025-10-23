const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  name: 'customers-mfe',

  filename: 'remoteEntry.js',

  exposes: {
  './CustomersModule': './src/app/customers/pages/customers-page/customers-page.ts',
},


  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});
