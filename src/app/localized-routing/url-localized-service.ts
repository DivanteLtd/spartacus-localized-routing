import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import {
  LanguageService,
  ParamsMapping,
  RoutingConfigService,
  RoutingService,
} from '@spartacus/core';

@Injectable({
  providedIn: 'root',
})
export class UrlLocalizedService {
  language$ = this.languageService.getActive();

  constructor(
    private languageService: LanguageService,
    private router: RoutingService,
    private routingConfigService: RoutingConfigService
  ) {}

  initialize() {
    this.language$.subscribe(() => {
      this.router
        .getRouterState()
        .subscribe((state) => {
          const route = state.state.semanticRoute;
          if (route) {
            let params = state.state.params;
            this.navigateToTranslatedURL(route, params);
          }
        })
        .unsubscribe();
    });
  }

  private navigateToTranslatedURL(route: string, params: Params) {
    if (params) {
      params = this.getMappedParams(
        this.routingConfigService.getRouteConfig(route).paramsMapping,
        params
      );
    }

    this.router.go({
      cxRoute: route,
      params: params,
    });
  }

  //find mapped params values for actual state
  private getMappedParams(
    paramsMapping: ParamsMapping,
    params: Params
  ): Params {
    const result = {};
    Object.keys(params).forEach((paramKey) => {
      const mappedKey = paramsMapping[paramKey];
      result[mappedKey] = params[paramKey];
    });
    return result;
  }
}
