export abstract class I18nRoutingConfig {
  i18nRouting: {
    [route: string]: {
      [lang: string]: {
        paths: string[]
      },
    }
  };
}
