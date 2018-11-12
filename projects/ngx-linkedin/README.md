# Angular 6 / 7 LinkedIn authorization

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.0.5.

## Getting started

### Install via npm 

```sh
npm install --save ngx-linkedin
```

### Import the module

In your `AppModule`, import the `SocialLoginModule`

```typescript
import { NgModule } from '@angular/core';
import { NgxLinkedinModule } from 'ngx-linkedin';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        NgxLinkedinModule.forRoot({
            clientId: ':clientId:'
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
```

### Sign in and out users

```typescript
import { Component } from '@angular/core';
import { NgxLinkedinService } from 'ngx-linkedin';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(private ngxLinkedinService: NgxLinkedinService) {}

    login() {
        this.ngxLinkedinService.signIn().subscribe(user => {
            console.info('signIn', user);
        });
    }
}
```

### Subscribe to the authentication state

```typescript
import { Component } from '@angular/core';
import { NgxLinkedinService } from 'ngx-linkedin';

@Component({
    selector: 'app-root',
    template: `
    isAuthorized: {{isAuthorized$ | async}}
    `,
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    public isAuthorized$ = this.ngxLinkedinService.isAuthorized();

    constructor(private ngxLinkedinService: NgxLinkedinService) {}
}

```

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
