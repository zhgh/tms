import ReactTms, { createContext } from '@fmfe/react-tms';
import Tms from '@fmfe/tms.js';

class Count extends Tms {
    public sum: number = 0;

    public $add(): void {
        this.sum ++;
    }

    public $subtract(): void {
        this.sum --;
    }
}

class Store extends ReactTms {
    public count: Count;
    constructor() {
        super({
            isDebugLog: true
        });
        this.count = new Count();

        this.run();
    }
}

export const ReactTmsStore = createContext(Store);