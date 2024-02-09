import {AnimationResult} from "../../common/animator";
import {ElementStates} from "../../../types/element-states";

export class FibonacciAnimator {
    private list: number[] = [];
    private index: number = 0;

    constructor(private readonly length : number) {
    }

    animateStep(): AnimationResult<number[]> {
        if (this.index === this.length) {
            return {
                completed: true,
                result: this.list
            }
        }
        if (this.index < 2) {
            this.list.push(1);
        } else {
            this.list.push(this.list[this.index - 1] + this.list[this.index - 2]);
        }
        ++this.index;
        return {
            completed: false,
            result: this.list
        }
    }

    getStatus(index: number, item: number): ElementStates {
        throw new Error("Not supported");
    }
}