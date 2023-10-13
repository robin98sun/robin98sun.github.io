import React from 'react';
// import logo from './logo.svg';
import './homepage.css';
import Stories from '../terminal/stories'
import welcome_stories from '../static-data/welcome-story.json'




class Homepage extends React.Component <any, any> {

    // constructor(props: any) {
    //   super(props)
    //   this.state = { 
    //   }
    // }

    render() {


      return (
        <div className="Homepage">


          {/*terminal animation*/}
          <div className="background">
              
              <Stories
                stories={welcome_stories}
                containerClassName="stories"
                disactive={false}
                prompt={">"}
              />

          </div>
        </div>
      );
    }
}

export default Homepage;
