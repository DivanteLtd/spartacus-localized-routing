import { Injectable } from '@angular/core';
import { Router, UrlSegmentGroup, PRIMARY_OUTLET } from '@angular/router';
import {
  LanguageService,
  ParamsMapping,
  RouteConfig,
  RoutingConfigService,
  UrlCommand,
  UrlCommandRoute,
  UrlCommands,
} from '@spartacus/core';
import { I18nRoutingConfig } from './i18n-routing.config';

@Injectable({
  providedIn: 'root',
})
export class CustomSemanticPathService {
  readonly ROOT_URL = ['/'];
  language: string;

  constructor(
    private languageService: LanguageService,
    private i18nRoutingConfig: I18nRoutingConfig,
    protected routingConfigService: RoutingConfigService,
    protected router: Router
  ) {}

  initialize() {
    this.languageService.getActive().subscribe((data) => {
      this.language = data;
    });
  }

  get(routeName: string): string {
    const routeConfig = this.routingConfigService.getRouteConfig(routeName);

    return routeConfig && Array.isArray(routeConfig.paths)
      ? '/' + routeConfig.paths[0]
      : undefined;
  }

  transform(commands: UrlCommands): any[] {
    if (!Array.isArray(commands)) {
      commands = [commands];
    }

    const result: string[] = [];
    for (const command of commands) {
      if (!this.isRouteCommand(command)) {
        // don't modify segment that is not route command:
        result.push(command);
      } else {
        // generate array with url segments for given route command:
        const partialResult = this.generateUrlPart(command);

        if (partialResult === null) {
          return this.ROOT_URL;
        }

        result.push(...partialResult);
      }
    }

    if (this.shouldOutputAbsolute(commands)) {
      result.unshift('/');
    }

    return result;
  }

  private isRouteCommand(command: UrlCommand): boolean {
    return command && Boolean(command.cxRoute);
  }

  private shouldOutputAbsolute(commands: UrlCommands): boolean {
    return this.isRouteCommand(commands[0]);
  }

  private generateUrlPart(command: UrlCommandRoute): string[] | null {
    this.standarizeRouteCommand(command);

    if (!command.cxRoute) {
      return null;
    }

    let routeConfig = this.routingConfigService.getRouteConfig(command.cxRoute);

    routeConfig = this.translateConfigPaths(command.cxRoute, routeConfig);

    // if no route translation was configured, return null:
    if (!routeConfig || !routeConfig.paths) {
      return null;
    }

    // find first path that can satisfy it's parameters with given parameters
    const path = this.findPathWithFillableParams(routeConfig, command.params);

    // if there is no configured path that can be satisfied with given params, return null
    if (!path) {
      return null;
    }

    const result = this.provideParamsValues(
      path,
      command.params,
      routeConfig.paramsMapping
    );

    return result;
  }

  private translateConfigPaths(cxRoute: string, routeConfig: RouteConfig) {
    let routingAliases = this.i18nRoutingConfig.i18nRouting[cxRoute];

    if (routingAliases && routingAliases[this.language]) {
      routeConfig.paths = routingAliases[this.language].paths;
    }

    return routeConfig;
  }

  private standarizeRouteCommand(command: UrlCommandRoute): void {
    command.params = command.params || {};
  }

  private provideParamsValues(
    path: string,
    params: object,
    paramsMapping: ParamsMapping
  ): string[] {
    return this.getPrimarySegments(path).map((segment) => {
      if (this.isParam(segment)) {
        const paramName = this.getParamName(segment);
        const mappedParamName = this.getMappedParamName(
          paramName,
          paramsMapping
        );
        return params[mappedParamName];
      }
      return segment;
    });
  }

  private findPathWithFillableParams(
    routeConfig: RouteConfig,
    params: object
  ): string {
    let foundPath = routeConfig.paths.find((path) =>
      this.getParams(path).every((paramName) => {
        const mappedParamName = this.getMappedParamName(
          paramName,
          routeConfig.paramsMapping
        );

        return params[mappedParamName] !== undefined;
      })
    );

    if (foundPath === undefined || foundPath === null) {
      return null;
    }

    return foundPath;
  }

  private getParams(path: string) {
    return this.getPrimarySegments(path)
      .filter(this.isParam)
      .map(this.getParamName);
  }

  private getMappedParamName(paramName: string, paramsMapping: object): string {
    if (paramsMapping) {
      return paramsMapping[paramName] || paramName;
    }
    return paramName;
  }

  getPrimarySegments(url: string): string[] {
    const urlTree = this.router.parseUrl(url);
    return this._getPrimarySegmentsFromUrlTree(urlTree.root);
  }

  private _getPrimarySegmentsFromUrlTree(tree: UrlSegmentGroup): string[] {
    const segments = tree.segments.map((s) => s.path);
    const childrenSegments = tree.children[PRIMARY_OUTLET]
      ? this._getPrimarySegmentsFromUrlTree(tree.children[PRIMARY_OUTLET])
      : [];
    return segments.concat(childrenSegments);
  }

  private isParam = (segment: string): boolean => segment.startsWith(':');

  private getParamName = (segment: string): string => segment.slice(1); // it just removes leading ':'
}
