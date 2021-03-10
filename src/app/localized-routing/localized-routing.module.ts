import { APP_INITIALIZER, NgModule } from '@angular/core';
import { Config, ConfigModule, SemanticPathService } from '@spartacus/core';
import { CustomSemanticPathService } from './custom-semantic-path.service';
import { I18nRoutingConfig } from './i18n-routing.config';
import { generateRoutingConfig } from './localized-routing.utils';
import { UrlLocalizedService } from './url-localized-service';

const i18nRoutingConfig: I18nRoutingConfig = {
  i18nRouting: {
    product: {
      en: {
        paths: ['products/:productCode/:name'],
      },
      de: {
        paths: ['produkten/:productCode/:name'],
      },
    },
    category: {
      en: {
        paths: ['category/:categoryCode'],
      },
      de: {
        paths: ['kategorien/:categoryCode'],
      },
    },
  },
};

@NgModule({
  declarations: [],
  imports: [ConfigModule.withConfig(generateRoutingConfig(i18nRoutingConfig))],
  providers: [
    { provide: I18nRoutingConfig, useExisting: Config },
    { provide: SemanticPathService, useExisting: CustomSemanticPathService },
    {
      provide: APP_INITIALIZER,
      useFactory: (sps: CustomSemanticPathService) => () => sps.initialize(),
      deps: [CustomSemanticPathService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (uls: UrlLocalizedService) => () => uls.initialize(),
      deps: [UrlLocalizedService],
      multi: true,
    },
  ],
})
export class LocalizedRoutingModule {}
