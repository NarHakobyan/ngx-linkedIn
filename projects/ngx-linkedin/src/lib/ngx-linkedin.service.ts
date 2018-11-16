import { Observable, interval, BehaviorSubject } from 'rxjs';
import { switchMap, filter, map, take } from 'rxjs/operators';
import { Injectable, InjectionToken, Inject, NgZone } from '@angular/core';

import { IConfig } from './interfaces/IConfig';

export const NGX_LINKEDIN_CONFIG = new InjectionToken<IConfig>('ngx-linkedin.config');

@Injectable()
export class NgxLinkedinService {
    /**
     * An subject that emits true if library has finished loading.
     */
    public sdkInitialized$ = new BehaviorSubject<boolean>(false);

    /**
     * reference to linkedIn sdk
     */
    private _sdkIN: any;

    /**
     * default field list
     */
    private _fields = ['id', 'first-name', 'last-name', 'email-address', 'picture-url', 'vanityName'];

    /**
     * default scopes
     */
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
        return this.onSdkInitialize().pipe(
            switchMap(() => this._authorize()),
            switchMap(() => this.getUserInfo<T>())
        );
    }

    /**
     * Gets the IN variable from the LinkedIN SDK.
     */
    public getSdkIN(): any {
        return this._sdkIN;
    }

    /**
     * get user profile info
     * @param {string[]} fields
     */
    public getProfile<T>(fields: string[] = this._fields) {
        return new Observable<T>(subscriber =>
            this.getSdkIN()
                .API.Profile('me')
                .fields(...fields)
                .result((user: T) => {
                    subscriber.next(user);
                    subscriber.complete();
                })
                .error((err: any) => subscriber.error(err))
        );
    }

    public isAuthorized() {
        return interval(1000).pipe(
            map(() => {
                const IN = this.getSdkIN();
                if (IN && IN.User) {
                    return <boolean>IN.User.isAuthorized();
                }
                return false;
            })
        );
    }

    public onAuth(): Observable<void> {
        return this.onSdkInitialize().pipe(
            switchMap(
                () =>
                    new Observable<void>(subscriber =>
                        this.getSdkIN().Event.onOnce(this._sdkIN, 'auth', () => {
                            subscriber.next(void 0);
                            subscriber.complete();
                        })
                    )
            )
        );
    }

    public getToken(): string {
        const IN = this.getSdkIN();
        return IN.ENV.auth.oauth_token;
    }

    public getUserInfo<T>() {
        return this.raw<T>(`/people/~`);
    }

    public raw<T>(url: string) {
        return new Observable<T>(subscriber =>
            this.getSdkIN()
                .API.Raw(url)
                .result((data: T) => {
                    subscriber.next(data);
                    subscriber.complete();
                })
                .error((err: any) => subscriber.error(err))
        );
    }

    /**
     * emit when sdk script was initialized and completes
     */
    public onSdkInitialize() {
        return this.sdkInitialized$.pipe(
            filter(Boolean),
            take(1)
        );
    }

    private _onLinkedInLoad() {
        this._sdkIN = window['IN'];
        this.sdkInitialized$.next(true);
        delete window['onLinkedInLoad'];
    }

    private _authorize(): Promise<void> {
        return new Promise(resolve => this.getSdkIN().User.authorize(() => resolve()));
    }
}
