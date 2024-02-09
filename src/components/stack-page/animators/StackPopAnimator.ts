import Stack from "../../../classes/Stack";
import {AnimationResult} from "../../common/animator";
import {ElementStates} from "../../../types/element-states";

export class StackPopAnimator<T> {
    private valueRemoved: boolean = false;
    constructor(private readonly stack: Stack<T>) {

    }

    animateStep(): AnimationResult<Stack<T>> {
        if (!this.valueRemoved) {
            this.stack.dequeue();
            this.valueRemoved = true;
            return {
                completed: false,
                result: this.stack
            }
        }
        return {
            completed: true,
            result: this.stack
        }
    }

    getStatus(index: number, item: T): ElementStates {
        if (index === this.stack.size() - 1 && !this.valueRemoved) {
            return ElementStates.Changing;
        }
        return ElementStates.Default;
    }
}