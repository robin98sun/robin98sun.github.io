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
          <Terminal 
            prompt = "$"
            stdout_lines={[
              "Hello folks,", "today is a good day to die!", "have fun!",
              "The second layer is our caret. Here we will perform two animations. The first one is a background-size animation similar to the text coloration since the caret needs to follow the text. The second one is a background-position animation to create the blinking effect.",
            ]}
          />
        </div>
      </div>
    );
  }
}

export default Homepage;
