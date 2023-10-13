import React from 'react';
import Terminal from './terminal'


interface StoriesProps {
  stories: Array<any>,
  containerClassName?: string
  disactive?: boolean
  prompt?: string
}

interface StoriesState {
  stories_rendered: Array<any>,
}


class Stories extends React.Component <StoriesProps, StoriesState> {

    constructor(props: any) {
      super(props)
      this.state = { 
        stories_rendered: [],
      }
    }

    show_next_paragraph() {
      const {stories_rendered} = this.state;
      const {stories} = this.props;

      if (stories.length > stories_rendered.length) {
        stories_rendered.push(stories[stories_rendered.length])
        this.setState({stories_rendered})
      }
    }

    get_next_paragraph():any{
      const {stories_rendered} = this.state;
      const {stories} = this.props;


      if (stories.length === stories_rendered.length) {
        return null
      }

      const next_story = stories[stories_rendered.length]
      return next_story
    }

    render() {


      if (this.props.disactive) {
        return (
          <div className={this.props.containerClassName ? this.props.containerClassName: ""}>

              {
                this.props.stories.map((story,i)=>(
                  <Terminal key={i}
                    disactive = {true}
                    prompt = {this.props.prompt ||"$" }
                    stdin_line = {story.question}
                    stdout_lines = {story.answer}
                  />
                ))
              }
              
          </div>
        );

      } else {
        const next_paragragh = this.get_next_paragraph()

        const next_paragragh_component = next_paragragh 
              ? <Terminal 
                key={this.state.stories_rendered.length}
                prompt = {this.props.prompt ||"$" }
                stdin_line={next_paragragh.question}
                stdout_lines={next_paragragh.answer}
                animationEnded={()=>{this.show_next_paragraph()}}
              />
              : <div/>

        return (
          <div className={this.props.containerClassName ||""}>

              {
                this.state.stories_rendered.map((story,i)=>(
                  <Terminal key={i}
                    disactive = {true}
                    prompt = {this.props.prompt ||"$" }
                    stdin_line = {story.question}
                    stdout_lines = {story.answer}
                  />
                ))
              }

              {next_paragragh_component}
              
          </div>
        );
      }


    }
}

export default Stories;
