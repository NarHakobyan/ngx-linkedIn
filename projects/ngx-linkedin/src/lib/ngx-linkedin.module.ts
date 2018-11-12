import { NgModule, ModuleWithProviders } from '@angular/core';

import { NgxLinkedinService, NGX_LINKEDIN_CONFIG } from './ngx-linkedin.service';
import { IConfig } from './interfaces/IConfig';

@NgModule({
    imports: [],
    declarations: [],
    exports: []
})
export class NgxLinkedinModule {
    static forRoot(config: IConfig): ModuleWithProviders {
        return {
            ngModule: NgxLinkedinModule,
            providers: [NgxLinkedinService, { provide: NGX_LINKEDIN_CONFIG, useValue: config }]
        };
    }
}
