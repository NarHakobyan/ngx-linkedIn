import { Component } from '@angular/core';
import { NgxLinkedinService } from 'ngx-linkedin';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    public isAuthorized$ = this.ngxLinkedinService.isAuthorized();

    constructor(private ngxLinkedinService: NgxLinkedinService) {
        this.ngxLinkedinService.onAuth().subscribe(console.info);
    }

    login() {
        this.ngxLinkedinService.signIn().subscribe(data => {
            console.info('signIn', data);
        });
    }

    getUserInfo() {
        this.ngxLinkedinService.getUserInfo().subscribe(data => {
            console.info('signIn', data);
        });
    }
}
