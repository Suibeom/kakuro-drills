import React from 'react';
import './App.css';
import { array, Digit } from './helpers';
import { Game, GameProps } from './GameProps';

class App extends React.Component {
  state: Game;
  constructor(props: {}) {
    super(props);
    this.state = new Game();
  }
  render() {
    return (
      <div className="container">


        <ScorecardDisplay game={this.state} />
        <Gamefield game={this.state} submitGuess={(guess_digits) => this.processGuess(guess_digits)} />


      </div>
    );
  }
  processGuess = (guess_digits: Digit[]) =>
    (this.setState((state: Game) => { return { state: state.processGuess(guess_digits) } }));
}




interface Score {
  hits: boolean[];
  misses: number;
}

function RoundScore(props: Score) {
  return <div className="score">
    <div className="solutions"> {props.hits.map((hit: boolean) => <div className={"solution ui-foreground found-" + hit} />)}</div>
    <div className="misses">{array(props.misses).fill(undefined).map(() => <div className="miss ui-foreground" />)}</div>
  </div>
}




export class ScorecardDisplay extends React.Component {
  props: GameProps;
  constructor(props: GameProps) {
    super(props);
    this.props = props;
  }
  render() {
    return <div className="ui-main scorecard">

      <p>Lorem ipsum dolor sit amet.</p>
      <RoundScore hits={[true, true, false]} misses={2} />
    </div>

  }

}

// There's no way this is better than just a regex test.
function parseDigit(str: string): Digit | false {
  if (isNaN(parseInt(str))) {
    return false
  }

  const proposed_digit = parseInt(str);
  if (proposed_digit > 0 && proposed_digit <= 9) {
    return str as Digit
  } else {
    return false
  }
}

interface PartialGuess {
  guess_digits: Digit[];
  size: number;
}

function appendGuess(guess: PartialGuess, digit: Digit): PartialGuess {
  if (guess.guess_digits.includes(digit)) {
    return guess;
  } else {
    return { guess_digits: guess.guess_digits.concat(digit), size: guess.size };
  }
}

function deleteGuess(guess: PartialGuess): PartialGuess {
  if (guess.guess_digits.length > 0) {
    return { guess_digits: guess.guess_digits.slice(0, -1), size: guess.size };
  }
  else { return guess; }
}

interface GameState {
  current_guess: PartialGuess;
}

class Gamefield extends React.Component {
  props: GameProps;
  state: GameState;
  constructor(props: GameProps) {
    super(props);
    this.props = props;
    this.state = { current_guess: { guess_digits: ['1', '2'], size: this.props.game.num_boxes() } }
  }
  render() {
    const boxes = this.props.game.num_boxes();
    const target = this.props.game.target_sum();
    const guess_size = this.state.current_guess.size;
    const guess_digits = this.state.current_guess.guess_digits;
    return <div className="ui-main gamefield">
      <div className="digit"></div>
      <div className="entry" tabIndex={-1}
        onKeyDown={(e: React.KeyboardEvent) => this.handleKeypress(e)}>
        {array(guess_size).map((_, idx) => <div className='guess-digit'>{(idx in guess_digits) ? guess_digits[idx] : ''} </div>)}
      </div>
    </div>
  }
  guessUpdateHandler(digit: Digit) {
    const next_guess = appendGuess(this.state.current_guess, digit);
    if (next_guess.size === next_guess.guess_digits.length) {
      console.log("Should try and update the whole thing now!");
      this.props.submitGuess?.(next_guess.guess_digits);
    }
    this.setState((state: GameState) => { return { current_guess: appendGuess(state.current_guess, digit) } });
  }
  handleKeypress(e: React.KeyboardEvent) {
    if (e.key === 'Backspace') {
      e.preventDefault();
      this.setState((state: GameState) => { return { current_guess: deleteGuess(state.current_guess) } });
      return;
    }
    if (e.key === 'Enter') {
      if (this.state.current_guess.guess_digits.length === this.state.current_guess.size) {

      }
    }
    const digit = parseDigit(e.key);
    if (digit === false) {
      return;
    }
    this.guessUpdateHandler(digit);
    // this.setState((state: GameState) => { return { current_guess: appendGuess(state.current_guess, digit) } });
  }
}








const numbers = [
  '',
  <path className="su-number" d="M125.369 131.815H110.138V54H98.9231C89.7846 60.5077 84.3846 63.5538 74 68.4V81.5538L89.6462 77.6769V131.815H74V147.323H125.369V131.815Z"></path>,
  <path className="su-number" d="M134.815 128.985H95.7692C100.338 125.523 107.815 120.123 112.108 116.246C122.492 107.246 133.569 97.2769 133.569 80.8C133.569 60.5846 117.785 52 100.062 52C84.5539 52 71.2615 60.5846 66 78.3077L83.7231 83.9846C86.3538 73.6 92.1692 69.1692 99.6462 69.1692C108.092 69.1692 111.969 74.5692 111.969 81.7692C111.969 90.4923 107.262 98.9385 97.5692 107.246C93 111.262 88.4308 115.554 83.7231 119.431C78.8769 123.308 71.8154 128.708 66 134.523V146.292H134.815V128.985Z"></path>,
  <path className="su-number" d="M136.554 120.262C136.554 110.569 132.4 100.877 116.892 96.5846C129.631 93.1231 134.2 83.5692 134.2 75.6769C134.2 60.4462 119.523 52 101.8 52C85.8771 52 73.4155 60.5846 67.7386 73.4615L83.6617 80.5231C87.8155 71.2462 93.7694 67.7846 100.831 67.7846C109.139 67.7846 113.431 73.4615 113.431 78.5846C113.431 83.9846 110.523 91.1846 98.6155 91.1846H88.3694V106.415H99.5848C111.631 106.415 115.231 113.2 115.231 119.154C115.231 126.077 109.969 132.308 100 132.308C91.554 132.308 84.9078 128.569 80.2001 119.015L64.0001 126.354C71.754 142.138 83.9386 148.092 100 148.092C119.385 148.092 136.554 137.846 136.554 120.262Z"></path>,
  <path className="su-number" d="M137.323 110.354H122.508V54H103.262L62 111.6V126H102.846V147.185H122.508V126H137.323V110.354ZM79.8615 110.354L103.538 77.1231V110.354H79.8615Z"></path>,
  <path className="su-number" d="M134.2 115.781C134.2 97.7808 121.185 86.5654 103.046 86.5654C96.6769 86.5654 90.0308 88.6424 85.8769 90.7193L88.2308 71.3347H126.862L128.662 53.75H73L68.0154 99.8577L81.3077 108.719C86.5692 104.289 91.6923 102.627 97.6462 102.627C107.338 102.627 112.877 108.581 112.877 116.75C112.877 126.027 107.754 132.812 98.0615 132.812C89.4769 132.812 83.9385 128.104 80.0615 119.796L64 127.273C69.9538 139.458 80.4769 148.596 98.3385 148.596C119.246 148.596 134.2 134.612 134.2 115.781Z"></path>,
  <path className="su-number" d="M134.2 115.5C134.2 95.977 120.354 86.8385 105.539 86.8385C96.5386 86.8385 90.7232 90.7154 85.0463 93.9001C86.5694 73.2693 94.1847 68.1462 103.323 68.1462C109.692 68.1462 114.539 71.7462 117.169 78.2539L133.369 70.777C128.523 59.0077 118.969 52.5 104.708 52.5C76.6001 52.5 64.0001 76.177 64.0001 104.423C64.0001 131.7 79.6463 148.592 100.277 148.592C118.692 148.592 134.2 135.023 134.2 115.5ZM113.154 117.162C113.154 127.131 109.139 134.331 99.7232 134.331C90.3078 134.331 85.0463 125.331 85.0463 108.023C88.0924 105.808 93.9078 102.346 100 102.346C107.2 102.346 113.154 106.777 113.154 117.162Z"></path>,
  <path className="su-number" d="M135.231 55.0001H67.5231L66 72.8616H116.123C101.723 93.354 85.8 120.769 82.2 148.046H105.738C106.431 127.692 114.046 103.739 135.231 68.4309V55.0001Z"></path>,
  <path className="su-number" d="M134.892 121.677C134.892 110.6 128.8 102.569 117.169 97.5847C125.615 93.5693 131.569 86.0924 131.569 77.3693C131.569 63.1078 119.8 53.0001 99.5846 53.0001C79.6462 53.0001 66.9077 64.7693 66.9077 80.0001C66.9077 89.277 72.0308 96.7539 80.8923 101.323C70.0923 105.754 64 114.754 64 123.615C64 138.985 76.7385 149.369 99.1692 149.369C121.185 149.369 134.892 137.462 134.892 121.677ZM113.154 78.8924C113.154 84.9847 111.077 89.5539 104.292 92.4616C91.8308 88.1693 86.7077 84.2924 86.7077 77.6462C86.7077 71.6924 91.5539 67.2616 99.5846 67.2616C107.754 67.2616 113.154 72.6616 113.154 78.8924ZM114.4 123.892C114.4 130.677 108.862 135.385 99.1692 135.385C88.6462 135.385 82.9692 130.123 82.9692 122.092C82.9692 115.723 86.4308 110.877 93.7692 107.831C108.585 112.262 114.4 116.692 114.4 123.892Z"></path>,
  <path className="su-number" d="M134.455 97.1693C134.455 69.8924 119.502 53.0001 98.4554 53.0001C80.04 53.0001 64.2554 66.5693 64.2554 86.0924C64.2554 105.615 78.1015 114.754 92.9169 114.754C101.917 114.754 107.732 110.877 113.409 107.692C111.886 128.323 103.994 133.446 94.8554 133.446C88.4861 133.446 83.2246 128.877 81.0092 123.339L64.8092 130.815C69.6554 142.723 79.6246 149.092 93.8861 149.092C120.609 149.092 134.455 125.415 134.455 97.1693ZM113.409 93.5693C110.363 95.7847 104.548 99.2463 98.4554 99.2463C91.2554 99.2463 85.3015 94.8155 85.3015 84.4309C85.3015 74.4616 89.3169 67.2616 98.7323 67.2616C108.148 67.2616 113.409 76.2616 113.409 93.5693Z"></path>,
];



export default App;