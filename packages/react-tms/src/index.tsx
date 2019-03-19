import * as React from 'react';
import Tms, { TmsDepNotifyParams } from '@fmfe/tms.js';
const hoistNonReactStatics = require('hoist-non-react-statics');

export interface ReactTmsDepNotifyParams extends TmsDepNotifyParams {
    position: string;
    time: number;
}

interface State<T> {
    count: number;
    store: T | null;
}
interface ProviderProps<T> {
    children: React.ReactNode;
    store: T;
}

type GetProps<T> = <Props, Props2>(
    Component: React.ComponentType<Props & Props2>,
    getProps: (store: T) => Props2
) => React.ComponentType<Props>;

interface Returns<T> {
    getProvider: <C>(C: C) => C;
    getProps: GetProps<T>;
}
export const forEachTms = (store: any, fn: (tms: Tms) => void): void => {
    Object.keys(store).forEach(k => {
        const cur = store[k];
        if (cur instanceof Tms) {
            fn(cur);
            forEachTms(cur, fn);
        }
    });
};

export function createContext<T>(Store: {
    new (...args: any[]): T;
}): Returns<T> {
    const defaultValue: State<T> = {
        count: 0,
        store: null
    };
    const Context = React.createContext<State<T>>(defaultValue);

    return {
        getProvider<C>(Component: C): C {
            class Provider extends React.Component<ProviderProps<T>, State<T>> {
                private onTmsChange: Function;
                private subscribe: Function;
                private unsubscribe: Function;
                public state: State<T>;
                public constructor(props: any) {
                    super(props);
                    const S: any = Store;
                    const store: T =
                        typeof S.getReactTmsStore === 'function'
                            ? S.getReactTmsStore(this.props)
                            : new S();
                    this.state = {
                        count: 0,
                        store
                    };
                    this.onTmsChange = () => {
                        const count = this.state.count + 1;
                        const store = this.state.store;
                        this.setState({
                            count,
                            store
                        });
                    };
                    this.subscribe = () => {
                        forEachTms(this.state, (tms: Tms) => {
                            tms.dep.addSub(this.onTmsChange);
                        });
                    };
                    this.unsubscribe = () => {
                        forEachTms(this.state, (tms: Tms) => {
                            tms.dep.removeSub(this.onTmsChange);
                        });
                    };
                    this.subscribe();
                }
                public componentWillUnmount() {
                    this.unsubscribe();
                }
                public render() {
                    const C: any = Component;
                    return (
                        <Context.Provider value={this.state}>
                            <C {...this.props} />
                        </Context.Provider>
                    );
                }
            }
            if (typeof (Store as any).getReactTmsProvider === 'function') {
                (Store as any).getReactTmsProvider(Component);
            }
            hoistNonReactStatics(Provider, Component as any);
            return (Provider as any) as C;
        },
        getProps<Props, Props2>(
            Component: React.ComponentType<Props & Props2>,
            getProps: (store: T) => Props2
        ): React.ComponentType<Props> {
            class GetProps extends React.Component<Props> {
                public render() {
                    return (
                        <Context.Consumer>
                            {({ store }) => {
                                if (!store) return null;
                                const props: Props2 = getProps(store);
                                return <Component {...this.props} {...props} />;
                            }}
                        </Context.Consumer>
                    );
                }
            }
            hoistNonReactStatics(GetProps, Component);
            return GetProps;
        }
    };
}

export function command(store: any, path: string, ...payloads: any[]): void {
    const paths = path.split('.');
    let len = paths.length - 1;
    let current = store;
    for (let i = 0; i < len; i++) {
        const name = paths[i];
        if (current[name] && current[name] instanceof Tms) {
            current = current[name];
        } else {
            throw new Error(`${path} 的 ${name} class 不存在`);
        }
    }
    const fnName: string = paths[paths.length - 1];
    const fn: Function = current[fnName];
    if (typeof fn === 'function') {
        fn.call(current, ...payloads);
    } else {
        throw new Error(`${path} 的 ${fnName} 方法不存在`);
    }
}
