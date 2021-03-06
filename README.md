# SpartacusLocalizedRouting

This is an example implementation of localized routing for ths Spartacus storefront, which enables to configure automatically adjusted URL paths on the change of applications language.

You can see the live example [here](https://spartacus-localized-routing.herokuapp.com/electronics-spa/)

# Running application

To run the application simply clone the repository and run following:

`yarn install`

`yarn start:local`

or

`npm install`

`npm start:local`

The application will run on `localhost:4200`

## Configuration

The configuration of translated paths can be found in `localized-routing.module`. Following example shows a configuration of English and German paths for the product page:

```javascript
  i18nRouting: {
      product: {
        en: {
          paths: ['products/:productCode/:name'],
        },
        de: {
          paths: ['produkten/:productCode/:name'],
        },
      }
    }
```

You can configure your own localized paths in the `localized-routing.module`.

## SemanticPathService

Current solution includes the `custom-semantic-path.service`, that overwrites the core `semantic-path.service`. The implementation of this service can be simplified after the following Spartacus issues are resolved:

https://github.com/SAP/spartacus/issues/3623

https://github.com/SAP/spartacus/issues/11373
