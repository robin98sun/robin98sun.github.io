import React from 'react';
// import logo from './logo.svg';
import './homepage.css';
import Terminal from '../terminal/terminal'

class Homepage extends React.Component {

    // constructor(props: any) {
    //   super(props)
    //   this.state = { 

    //   }
    // }

  render() {

    return (
      <div className="Homepage">

        {/*terminal animation*/}
        <div className="App-header">
          <Terminal lines={["Hello folks,", "today is a good day to die"]}/>
        </div>
      </div>
    );
  }
}

export default Homepage;
