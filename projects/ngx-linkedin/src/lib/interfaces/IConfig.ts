'use strict';

export interface IConfig {
    clientId: string;
    authorize?: boolean;
    scope?: string[];
    fields?: string[];
}
