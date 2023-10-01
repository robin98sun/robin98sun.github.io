import React from 'react';
import './terminal.css';


interface TerminalProps {
  lines?: Array<string>,
  onAnimationEnd?(elem:any):void,
}

interface TerminalState {
  terminal_line_classes: Array<string>,
  lines: Array<string>
}

class Terminal extends React.Component<TerminalProps, TerminalState> {

    constructor(props: TerminalProps) {
      super(props)
      const lines: Array<string> = props.lines?JSON.parse(JSON.stringify(props.lines)):[];
      lines.push("> ")
      this.state = {
        terminal_line_classes: lines.map((line, i) => (i===0?`line_${line.length}`:"")),
        lines: lines,
      }
    }

  do_it(i: number) {

    let { terminal_line_classes } = this.state;

    if (i !== this.state.lines.length-1) {
      terminal_line_classes[i] = "done";
    } else {
      terminal_line_classes[i] = "last-done";
    }

    if (i < terminal_line_classes.length-1) {
      const next_line = this.state.lines[i+1];
      if (i < terminal_line_classes.length-2) {
        terminal_line_classes[i+1] = `line_${next_line.length}`;
      } else {
        terminal_line_classes[i+1] = "last-done";
      }
    }
    this.setState({terminal_line_classes})
  }  

  render() {

    const setStyleLineTyping = (length:number) => `
      .line_${length} {
        white-space: nowrap;
        overflow: hidden;
        border-right: .2em solid #999;
        transform: translateY(-50%);
        animation: typing ${length*0.1}s steps(${length}, end);
        display: block !important;
      }
    `

    const style = this.props.lines
        ? (this.state.lines).map((line, i) => setStyleLineTyping(line.length)) : ""

    const terminal = this.state.lines 
        ? this.state.lines.map((line, i)=>
              <p 
                key={i} 
                className={this.state.terminal_line_classes[i]} 
                onAnimationEnd={(e:any) => {this.do_it(i)}}
              >
               {line}
              </p>
          ) 

        : <span/>

    return (
      <div>
        <style children={style} />
        <div className="terminal">
          <div id="terminal_text">
        
          {terminal}

          </div>
        </div>
      </div>
    );
  }
}

export default Terminal;
