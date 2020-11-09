import { all_digits, Digit, false_array } from "./helpers";

export interface GameProps {
    game: Game;
    submitGuess?: (guess: Digit[]) => void;
}
interface GameSettings {
    boxes: number;
}
function defaultSettings(): GameSettings {
    return { boxes: 4 };
}
interface KakuroFill {
    digits: boolean[];
}

function fillFromDigits(digits: Digit[]): KakuroFill {
    let fill: boolean[] = false_array(10);
    for (let i = 1; i < 9; i++) {
        fill[i] = digits.includes(all_digits[i]);
    }
    return { digits: fill };
}

function getSolutions(target_sum: number, boxes: number): KakuroFill[] {
    const solutions = [];
    console.log("Generating Solutions");
    for (var i = 1; i < 512; i++) {
        const bits = i.toString(2).split('');
        const partition_size = bits.reduce((a, b) => a + parseInt(b, 10), 0)
        const sum = sumPartition(i);
        if (partition_size === boxes && sum === target_sum) {
            const solution = bits.map((a: string): boolean => a === '1');
            solutions.push(solution);
        }
        console.log(i);
    }
    return [];
}

function sumPartition(partition: number) {
    const bits = partition.toString(2);
    var sum = 0;
    for (var i = 0; i < 9; i++) {
        bits[i] === '1' && (sum += Math.pow(2, i));
    }
    return sum;
}

interface SolutionCheckResult {
    // An information packet for the React components to use.
    solution_number: number;
    valid_solution: boolean; // This is identical to indexOf==-1
    new_solution: boolean;
}

class SolutionList {
    solutions: KakuroFill[];
    solutions_found: boolean[];
    constructor(sum: number, boxes: number) {
        console.log("Constructing SolutionList");
        this.solutions = getSolutions(sum, boxes);
        const num_solutions = this.solutions.length;
        this.solutions_found = false_array(num_solutions);
    }

    total_solutions(): number {
        return this.solutions.length;
    }

    remaining_solutions(): number {
        const count_true_values = (accumulator: number, x: boolean): number => x ? 1 : 0 + accumulator;
        const total_found: number = this.solutions_found.reduce(count_true_values, 0);
        return this.total_solutions() - total_found;
    }

    processUserGuess(candidate: KakuroFill): SolutionCheckResult {
        const solution_number = this.solutions.indexOf(candidate);
        const valid_solution = solution_number !== -1;
        const new_solution = valid_solution && this.solutions_found[solution_number];

        if (new_solution) {
            this.solutions_found[solution_number] = true;
        }

        return { solution_number, valid_solution, new_solution };
    }
}

interface PlayOutcome {
    result: SolutionList;
    guess_history: KakuroFill[];
    guess_result_history: SolutionCheckResult[];
}

interface Scorecard {
    plays: PlayOutcome[];
}

export interface GameUpdate {
    solutions?: SolutionList;
    scorecard?: Scorecard;
    settings?: GameSettings;
    current_round?: number;
    rounds?: number[];
}

export class Game {
    solutions: SolutionList;
    scorecard: Scorecard;
    settings: GameSettings;
    current_round: number;
    rounds: number[];
    constructor() {
        console.log("Constructing Game");
        this.scorecard = { plays: [] };
        this.settings = defaultSettings();
        this.solutions = new SolutionList(18, this.settings.boxes);
        this.current_round = 18;
        this.rounds = [];
    }
    num_boxes() {
        return this.settings.boxes;
    }
    target_sum() {
        return this.current_round;
    }
    processGuess(guess: Digit[]): GameUpdate {
        const fill = fillFromDigits(guess);
        const result = this.solutions.processUserGuess(fillFromDigits(guess));

        if (result.new_solution) {
            return { solutions: this.solutions };
        }
        return {};
    }
}


