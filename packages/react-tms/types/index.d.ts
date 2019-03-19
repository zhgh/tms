import * as React from 'react';
import Tms, { TmsDepNotifyParams } from '@fmfe/tms.js';
export interface ReactTmsDepNotifyParams extends TmsDepNotifyParams {
    position: string;
    time: number;
}
declare type GetProps<T> = <Props, Props2>(Component: React.ComponentType<Props & Props2>, getProps: (store: T) => Props2) => React.ComponentType<Props>;
interface Returns<T> {
    getProvider: <C>(C: C) => C;
    getProps: GetProps<T>;
}
export declare const forEachTms: (store: any, fn: (tms: Tms) => void) => void;
export declare function createContext<T>(Store: {
    new (...args: any[]): T;
}): Returns<T>;
export declare function command(store: any, path: string, ...payloads: any[]): void;
export {};
