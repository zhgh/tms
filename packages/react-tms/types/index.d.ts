import Tms, { TmsDepNotifyParams } from '@fmfe/tms.js';
export { createContext, forEachTms, command } from './helper';
export interface ReactTmsDepNotifyParams extends TmsDepNotifyParams {
    position: string;
    time: number;
}
export interface ReactTmsOptions {
    isDebugLog?: boolean;
}
declare type SubFunc = (event: ReactTmsDepNotifyParams) => void;
export default class ReactTms extends Tms {
    private onList;
    private subs;
    private options;
    constructor(options?: ReactTmsOptions);
    run(): this;
    subscribe(fn: SubFunc): this;
    unsubscribe(fn: SubFunc): this;
    destroy(): this;
}
