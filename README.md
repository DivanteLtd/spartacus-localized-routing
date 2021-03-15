# SpartacusLocalizedRouting

This is an example implementation of localized routing for ths Spartacus storefront, which enables to configure automatically adjusted URL paths on the change of applications language.

Implemented solution allows to change the configured links in the application, as well as the current URL.

# Running application

To run the application simply clone the repository and run following:

`yarn install`
`yarn start`

or

`npm install`
`npm start`

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
