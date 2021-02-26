import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { translations, translationChunksConfig } from '@spartacus/assets';
import { B2cStorefrontModule } from '@spartacus/storefront';
import {ConfigModule} from '@spartacus/core';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    B2cStorefrontModule.withConfig({
      backend: {
        occ: {
          baseUrl: 'https://spartacus-demo.eastus.cloudapp.azure.com:8443',
        },
      },
      context: {
        currency: ['USD'],
        language: ['en'],
      },
      i18n: {
        resources: translations,
        chunks: translationChunksConfig,
        fallbackLang: 'en',
      },
      features: {
        level: '3.1',
      },
    }),
    ConfigModule.withConfig({
      routing: {
        routes: {
          product: {
            paths: ['products/:productCode', 'prodotti/:productCode', 'productos/:productCode']
          }
        }
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
