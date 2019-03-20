
import Tms, { TmsDepNotifyParams } from '@fmfe/tms.js';
export {
    createContext,
    forEachTms,
    command
} from './helper';

export interface ReactTmsDepNotifyParams extends TmsDepNotifyParams {
    position: string;
    time: number;
}
export interface ReactTmsOptions {
    isDebugLog?: boolean;
}
type SubFunc = (event: ReactTmsDepNotifyParams) => void;

const getType = (payload: any): string => {
    return Object.prototype.toString
        .call(payload)
        .replace(/^(.*?) |]$/g, '')
        .toLowerCase();
};

export default class ReactTms extends Tms {
    private onList: Array<{ target: Tms; onChage: Function }> = [];
    private subs: Array<SubFunc> = [];
    private options: ReactTmsOptions = { isDebugLog: false };
    public constructor(options: ReactTmsOptions = {}) {
        super();
        if (typeof options.isDebugLog === 'boolean') {
            this.options.isDebugLog = options.isDebugLog;
        }
    }
    public run(): this {
        Object.defineProperty(this, 'subs', {
            enumerable: false
        });
        Object.defineProperty(this, 'onList', {
            enumerable: false
        });
        const observeTms = (opts: any, paths: Array<string>): void => {
            Object.keys(opts).forEach(k => {
                const item: Tms = opts[k];
                if (item instanceof Tms) {
                    const onChage = (event: TmsDepNotifyParams): void => {
                        const position = `${paths
                            .concat([k, event.type])
                            .join('.')}`;
                        if (this.options.isDebugLog && console) {
                            // eslint-disable-next-line
                            console.log(
                                `position   ${position}(payload: ${getType(
                                    event.payload
                                )});`,
                                `\n\rpayload   `,
                                typeof event.payload === 'object'
                                    ? JSON.parse(JSON.stringify(event.payload))
                                    : event.payload,
                                `\n\rpayloads  `,
                                JSON.parse(JSON.stringify(event.payloads)),
                                `\n\rtarget    `,
                                event.target,
                                `\n\r---`
                            );
                        }
                        this.subs.forEach(fn =>
                            fn({
                                ...event,
                                position,
                                time: Date.now()
                            })
                        );
                    };
                    item.dep.addSub(onChage);
                    this.onList.push({
                        target: item,
                        onChage
                    });
                    observeTms(item, [...paths, k]);
                }
            });
        };
        observeTms(this, []);
        return this;
    }
    public subscribe(fn: SubFunc): this {
        this.subs.push(fn);
        return this;
    }
    public unsubscribe(fn: SubFunc): this {
        const index = this.subs.indexOf(fn);
        this.subs.splice(index, 1);
        return this;
    }
    public destroy(): this {
        this.onList.splice(0, this.onList.length);
        this.subs.splice(0, this.subs.length);
        return this;
    }
}
