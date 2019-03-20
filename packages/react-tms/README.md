## 安装
```bash
   yarn add @fmfe/tms.js @fmfe/react-tms
   # or
   npm install @fmfe/tms.js @fmfe/react-tms
```

## 使用
```javascript
import Tms from '@fmfe/tms.js'
import ReactTms, { createContext } from '@fmfe/react-tms'

class Count extends Tms{
    count: number = 0
    $increment() {
        this.count++
    }
}

class Store extends ReactTms {
    count: Count = new Count()
}

const store = new Store({
    // 是否显示 Commit log
    isDebugLog: process.env.NODE_ENV !== 'production'
})

// 运行程序
store.run()

// 订阅状态变化
const onChage = (event) => {
    console.log(event)
}
store.subscribe(onChage)

// 在程序中安装
const ReactTmsStore = createContext<Store>(Store);

ReactTmsStore.getProps<Props, TmsProps>(
    CustomComponent,
    (store): TmsProps => {
        const { count } = store;
        return {
            count
        };
    }
);
