import { RoutingConfig } from '@spartacus/core';
import { I18nRoutingConfig } from './i18n-routing.config';

export function generateRoutingConfig(
  i18nRoutingConfig: I18nRoutingConfig
): any {
  let routingConfig: RoutingConfig = {
    routing: {
      routes: {},
    },
  };

  Object.entries(i18nRoutingConfig.i18nRouting).forEach((entry) => {
    let pathName = entry[0];

    routingConfig.routing.routes[pathName] = {
      paths: Array.prototype.concat.apply(
        [],
        Object.values(entry[1]).map((value) => value.paths)
      ),
    };
  });

  return { ...routingConfig, ...i18nRoutingConfig };
}
