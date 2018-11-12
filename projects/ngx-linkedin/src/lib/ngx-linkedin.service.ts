import { switchMap, filter, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, Observer, interval } from 'rxjs';
import { Injectable, InjectionToken, Inject, NgZone } from '@angular/core';

import { IConfig } from './interfaces/IConfig';

export const NGX_LINKEDIN_CONFIG = new InjectionToken<IConfig>('ngx-linkedin.config');

declare var IN: any;

@Injectable()
export class NgxLinkedinService {
    private _scriptLoaded$ = new BehaviorSubject<boolean>(false);
    private _fields = ['id', 'first-name', 'last-name', 'email-address', 'picture-url', 'vanityName'];
    private _scope = ['r_basicprofile', 'r_emailaddress'];

    constructor(private ngZone: NgZone, @Inject(NGX_LINKEDIN_CONFIG) config: IConfig) {
        window['onLinkedInLoad'] = () => ngZone.run(() => this._onLinkedInLoad());
        const scope = (config.scope || this._scope).join(' ');

        const linkedIn = document.createElement('script');
        linkedIn.type = 'text/javascript';
        linkedIn.src = 'http://platform.linkedin.com/in.js';
        linkedIn.innerHTML = `
        api_key: ${config.clientId}
        authorize: ${config.authorize || false}
        onLoad: onLinkedInLoad
        scope: ${scope}
        `;

        document.head.appendChild(linkedIn);
    }

    public signIn<T>() {
        return this._onScriptLoad().pipe(
            switchMap(() => this._authorize()),
            switchMap(() => this.getUserInfo<T>())
        );
    }

    public getProfile<T>(fields: string[] = this._fields) {
        return Observable.create((observer: Observer<T>) =>
            IN.API.Profile('me')
                .fields(...fields)
                .result((user: T) => {
                    observer.next(user);
                    observer.complete();
                })
                .error((err: any) => observer.error(err))
        );
    }

    public isAuthorized() {
        return interval(1000).pipe(
            map(() => {
                if (window['IN'] && IN.User) {
                    return <boolean>IN.User.isAuthorized();
                }
                return false;
            })
        );
    }

    public onAuth(): Observable<void> {
        return this._onScriptLoad().pipe(
            switchMap(() =>
                Observable.create((observer: Observer<void>) =>
                    IN.Event.onOnce(IN, 'auth', () => {
                        observer.next(void 0);
                        observer.complete();
                    })
                )
            )
        );
    }

    public getUserInfo<T>() {
        return Observable.create((observer: Observer<T>) =>
            IN.API.Raw(`/people/~`)
                .result((user: T) => {
                    observer.next(user);
                    observer.complete();
                })
                .error((err: any) => observer.error(err))
        );
    }

    private _onScriptLoad() {
        return this._scriptLoaded$.pipe(filter(Boolean));
    }

    private _onLinkedInLoad() {
        this._scriptLoaded$.next(true);
        delete window['onLinkedInLoad'];
    }

    private _authorize(): Promise<void> {
        return new Promise(resolve => IN.User.authorize(() => resolve()));
    }
}
