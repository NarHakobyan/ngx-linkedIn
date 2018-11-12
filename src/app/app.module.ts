import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxLinkedinModule } from 'ngx-linkedin';

import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        NgxLinkedinModule.forRoot({
            clientId: '77x4a6q4l4fmw5'
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
