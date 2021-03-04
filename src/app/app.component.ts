import { Component } from '@angular/core';
import { I18nRoutingConfig } from './localized-routing/i18n-routing.config';
import { LanguageService } from '@spartacus/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'spartacus-localized-routing';

  constructor(
    private config: I18nRoutingConfig,
    private language: LanguageService
  ) {
    this.language.getActive().subscribe((lang) => {
      // console.log(lang);
      // console.log(config.i18nRouting.product[lang].paths);
    });
  }
}
