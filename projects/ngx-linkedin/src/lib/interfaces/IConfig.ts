'use strict';

export interface IConfig {
    clientId: string;
    ssl?: boolean;
    authorize?: boolean;
    scope?: string[];
    fields?: string[];
}
