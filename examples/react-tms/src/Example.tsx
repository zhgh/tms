import React, { Component } from 'react';
import { ReactTmsStore } from './store/index';
import './Example.css';

interface ExampleProps {}
interface ExampleTmsProps {
  Count: any;
  count: any;
}

class Example extends Component<ExampleProps & ExampleTmsProps> {
  
  componentWillReceiveProps(nextProps: any) {
    console.log(JSON.stringify(nextProps), "--111---")
  }
  componentDidUpdate() {
    console.log(this.state, '========')
  }

  add = () => {
    this.props.count.$add();
  }

  sub = () => {
    this.props.count.$subtract();
  }
  
  render() {
    const { count } = this.props;
    return (
      <div>
        <p>sum is: {count.sum}</p>
        <button onClick={this.add} className="btn">add</button>
        <button onClick={this.sub} className="btn">subtract</button>
      </div>
    );
  }
}

export default  ReactTmsStore.getProps<ExampleProps, ExampleTmsProps>(Example, (store): ExampleTmsProps => {
  const count = store.count;
  console.log(count, '------')
  return {
    Count: store.count,
    count
  }
})
