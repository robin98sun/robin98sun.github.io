import React from 'react';
import './terminal.css';


interface TerminalProps {
  stdin_line?: string,
  stdout_lines?: Array<string>,
  prompt?: string,
  disactive?: boolean,
  onTypingEnd?(elem:any):void,
}

interface TerminalState {
  stdin_line: string,
  stdout_classes_characters: Array<Array<string>>,
  stdout_classes_lines: Array<string>,
  stdout_lines: Array<string>,
  active: boolean,
}

class Terminal extends React.Component<TerminalProps, TerminalState> {

  PROMPT = ">";

  constructor(props: TerminalProps) {
    super(props)
    if (props.prompt) {
      this.PROMPT = props.prompt;
    }

    const stdout_lines: Array<string> = props.stdout_lines?JSON.parse(JSON.stringify(props.stdout_lines)):[];

    const state = {
      stdin_line: props.stdin_line ? props.stdin_line : "",
      stdout_classes_characters: stdout_lines.map((line, i) => (line.split("").map((ch, j)=> "hide"))),
      stdout_classes_lines: stdout_lines.map((line, i) => "hide"),
      stdout_lines: stdout_lines,
      active: props.disactive ? false: true,
    }
    if (!props.stdin_line && !props.disactive && stdout_lines.length > 0) {
      state.stdout_classes_characters[0][0] = "typing-char"
    }

    this.state = state
  }


  display_stdin(elem: any) {
    elem.target.className = "cursor"
    elem.target.nextSibling.className = `line_${this.state.stdin_line.length}_inline`
  }

  stdin_completed(elem: any) {
    elem.target.className = "stdin-done"
    this.start_displaying_stdout()
    // setTimeout( this.display_stdout_nextline.bind(this), 100) 
  }

  start_displaying_stdout() {

    let { stdout_classes_lines } = this.state;


    stdout_classes_lines[0] = "stdout-done"

    this.setState({stdout_classes_lines})
  }  

  is_stdout_displayed() {

    let { stdout_classes_lines } = this.state;
    if (stdout_classes_lines[0] != "stdout-done") {
      return false
    }
    return true
  }

  display_next_char(row: number, col: number) {
    
    let {stdout_classes_characters, stdout_classes_lines, stdout_lines} = this.state;
    if (stdout_lines[row][col] === " ") {
      stdout_classes_characters[row][col] = "space-done"
    } else {
      stdout_classes_characters[row][col] = "char-done"
    }
    let [next_row, next_col] = [row, col]
    if (col === stdout_classes_characters[row].length-1) {
      if (row < stdout_classes_characters.length-1) {
        next_row = row+1
        next_col = 0
        stdout_classes_lines[next_row] = "stdout-done"
      }
    } else {
      next_col = col+1
    }
    if (next_row != row || next_col != col) {
      if (stdout_lines[next_row][next_col] === " ") {
        stdout_classes_characters[next_row][next_col] = "typing-space"
      } else{
        stdout_classes_characters[next_row][next_col] = "typing-char"
      }
    }
    this.setState({stdout_classes_characters, stdout_classes_lines})
  }


  render() {

    if (!this.is_stdout_displayed()) {
      this.start_displaying_stdout()
    }
    const stdout = this.state.stdout_lines.map((line, i)=>
              <div key={i}
                className={this.state.stdout_classes_lines[i]} 
              >
               {line.split("").map((c:string, j)=>(
                 <span key={j}
                   custom-attribute={`${i}-${j}`}
                   className={this.state.stdout_classes_characters[i][j]}
                   onAnimationEnd={(e:any) => {
                     const cr = e.target.getAttribute("custom-attribute");
                     const [row, col] = cr.split("-").map((x:string) => Number(x));
                     this.display_next_char(row, col);
                   }}
                 >{c}</span>
                ))}
              </div>
          )

    return (
      <div className="wrapper">
        
        {this.state.stdin_line 
         ? <div className="fit" >
              <p 
                className="cursor-init" 
                onAnimationEnd={(e:any) => {this.display_stdin(e)}}
              >
               {this.PROMPT}
              </p>

              <p 
                className="hide" 
                onAnimationEnd={(e:any) => {
                  e.target.className="cursor-waiting";
                  setTimeout( this.stdin_completed.bind(this, e), 1000) 
                }}
              >
               {this.state.stdin_line}
              </p>
            </div>
          : <div/>
        }

        {stdout}

      </div>
    );
  }
}

export default Terminal;
