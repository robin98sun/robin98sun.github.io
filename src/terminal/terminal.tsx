import React from 'react';
import './terminal.css';


interface TerminalProps {
  stdin_line?: string,
  stdout_lines?: Array<string>,
  prompt?: string,
  disactive?: boolean,
  animationEnded?():void,
}

enum AnimationState {
  init = "init",
  justCompletedAnimation = "just completed animation",
  static = "static",
}

interface TerminalState {
  stdin_line: string,
  stdin_classes_characters: Array<string>,
  stdin_state: AnimationState,
  stdout_classes_characters: Array<Array<string>>,
  stdout_classes_lines: Array<string>,
  stdout_lines: Array<string>,
  stdout_state: AnimationState,
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

    const stdin_line = props.stdin_line ? props.stdin_line : ""

    const active = props.disactive ? false: true

    const state = {
      stdin_line: stdin_line,
      stdin_classes_characters: active ? stdin_line.split("").map((ch, i)=> "hide") : stdin_line.split("").map((ch, i)=> ch === " " ? "space-done": "char-done"),
      stdin_state: active? AnimationState.init: AnimationState.static,
      stdout_classes_characters: active ? stdout_lines.map((line, i) => (line.split("").map((ch, j)=> "hide"))) : stdout_lines.map((line, i) => (line.split("").map((ch, j)=> ch === " "?"space-done":"char-done"))),
      stdout_classes_lines: stdout_lines.map((line, i) => active ? "hide" : "stdout-show"),
      stdout_lines: stdout_lines,
      stdout_state: active ? AnimationState.init: AnimationState.static,
      active: active,
    }
    if (!props.stdin_line && !props.disactive && stdout_lines.length > 0) {
      state.stdout_classes_characters[0][0] = "typing-char"
    }

    this.state = state

    if (active && !props.stdin_line) {
      this.show_stdout()
    }
  }


  display_next_char_of_stdin(col: number) {
    let {stdin_classes_characters, stdin_line, stdin_state} = this.state;
    if (stdin_line[col] === " ") {
      stdin_classes_characters[col] = "space-done";
    } else {
      stdin_classes_characters[col] = "char-done";
    }
    if (col < stdin_line.length-1) {
      const next_col = col+1;
      if (stdin_line[next_col] === " ") {
        stdin_classes_characters[next_col] = "typing-space";
      } else {
        stdin_classes_characters[next_col] = "typing-char";
      }
    } else {
      stdin_state = AnimationState.justCompletedAnimation
    }
    this.setState({stdin_classes_characters, stdin_state})

  }

  show_stdout() {
     let {stdout_classes_lines, stdout_classes_characters, stdin_state} = this.state;
     if (stdout_classes_lines.length > 0 && stdout_classes_characters.length > 0) {
       stdout_classes_lines[0] = "stdout-show"
       if (stdout_classes_characters[0].length > 0) {
         stdout_classes_characters[0][0] = "typing-char"
       }
       stdin_state = AnimationState.static
       this.setState({stdout_classes_lines, stdout_classes_characters, stdin_state})
     } else {
       this.animationEnded()
     }
  }

  display_next_char_of_stdout(row: number, col: number) {
    
    let {stdout_classes_characters, stdout_classes_lines, stdout_lines, stdout_state} = this.state;
    if (stdout_lines[row][col] === " ") {
      stdout_classes_characters[row][col] = "space-done";
    } else {
      stdout_classes_characters[row][col] = "char-done";
    }
    let [next_row, next_col] = [row, col]
    if (col === stdout_classes_characters[row].length-1) {
      if (row < stdout_classes_characters.length-1) {
        next_row = row+1
        next_col = 0
        stdout_classes_lines[next_row] = "stdout-show";
      }
    } else {
      next_col = col+1
    }
    if (next_row !== row || next_col !== col) {
      if (stdout_lines[next_row][next_col] === " ") {
        stdout_classes_characters[next_row][next_col] = "typing-space";
      } else{
        stdout_classes_characters[next_row][next_col] = "typing-char";
      }
    } else {
      this.animationEnded()
    }
    this.setState({stdout_classes_characters, stdout_classes_lines, stdout_state})
  }

  animationEnded() {
    if (this.props.animationEnded) {
      this.props.animationEnded();
    }
  }


  render() {

    const stdin = this.state.stdin_line.split("").map((ch, i) => 
              <span key={i}
                custom-attribute={`${i}`}
                className={this.state.stdin_classes_characters[i]}
                onAnimationEnd={(e:any)=>{
                  const cr = e.target.getAttribute("custom-attribute");
                  const col = Number(cr)
                  this.display_next_char_of_stdin(col);
                }}
              >
                {ch}
              </span>
          )

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
                     this.display_next_char_of_stdout(row, col);
                   }}
                 >{c}</span>
                ))
               }
              </div>
          )


    return (
      <div className="wrapper">
        
        {this.state.stdin_line 
         ? <div className="stdin-show" >
              <span 
                className={this.state.active ? "cursor-init" : "cursor" }
                onAnimationEnd={(e:any) => {
                  e.target.className = "cursor"
                  this.display_next_char_of_stdin(0);
                }}
              >
               {this.PROMPT}
              </span>

              {stdin}

              {
               this.state.stdin_state === AnimationState.justCompletedAnimation
               ? <span
                   className="cursor-wait"
                   onAnimationEnd={(e:any) => {
                    e.target.className = "hide";
                    this.show_stdout();
                  }}
                 />
               : <span/>
              }
            </div>
          : <div/>
        }

        {stdout}

      </div>
    );
  }
}

export default Terminal;
