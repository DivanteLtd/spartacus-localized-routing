import { APP_INITIALIZER, NgModule } from '@angular/core';
import {
  Config,
  ConfigModule,
  RoutingConfig,
  SemanticPathService,
} from '@spartacus/core';
import { CustomSemanticPathService } from './custom-semantic-path.service';
import { I18nRoutingConfig } from './i18n-routing.config';

const i18nRoutingConfig: I18nRoutingConfig = {
  i18nRouting: {
    product: {
      en: {
        paths: ['products/:productCode'],
      },
      de: {
        paths: ['produkten/:productCode'],
      },
    },
    category: {
      en: {
        paths: ['category/:categoryCode'],
      },
      de: {
        paths: ['category/:categoryCode'],
      },
    },
  },
};

@NgModule({
  declarations: [],
  imports: [
    ConfigModule.withConfig(i18nRoutingConfig as I18nRoutingConfig),
    ConfigModule.withConfig({
      routing: {
        routes: {
          product: {
            paths: Array.prototype.concat.apply(
              [],
              Object.values(i18nRoutingConfig.i18nRouting.product).map(
                (value) => {
                  return value.paths;
                }
              )
            ),
          },
        },
      },
    } as RoutingConfig),
  ],
  providers: [
    { provide: I18nRoutingConfig, useExisting: Config },
    { provide: SemanticPathService, useExisting: CustomSemanticPathService },
    {
      provide: APP_INITIALIZER,
      useFactory: (sps: CustomSemanticPathService) => () => sps.initialize(),
      deps: [CustomSemanticPathService],
      multi: true,
    },
  ],
})
export class LocalizedRoutingModule {}
