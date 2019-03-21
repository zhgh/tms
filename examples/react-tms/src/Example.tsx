import React, { PureComponent } from 'react';
import { ReactTmsStore } from './store/index';
import './Example.css';

interface ExampleProps {}
interface ExampleTmsProps {
  sum: number;
  count: any;
}

class Example extends PureComponent<ExampleProps & ExampleTmsProps> {

  add = () => {
    this.props.count.$add();
  }

  sub = () => {
    this.props.count.$subtract();
  }
  
  render() {
    return (
      <div>
        <p>sum is: {this.props.sum}</p>
        <button onClick={this.add} className="btn">add</button>
        <button onClick={this.sub} className="btn">subtract</button>
      </div>
    );
  }
}

export default  ReactTmsStore.getProps<ExampleProps, ExampleTmsProps>(Example, (store): ExampleTmsProps => {
  const count = store.count;
  return {
    count,
    sum: count.sum
  }
})
