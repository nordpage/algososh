import Stack from "../../../classes/Stack";
import {ElementStates} from "../../../types/element-states";
import {AnimationResult} from "../../common/animator";

export class StackPushAnimator<T> {
    private valueAdded: boolean = false;
    constructor(private readonly stack: Stack<T>, private readonly value: T) {

    }

    animateStep(): AnimationResult<Stack<T>> {
        if (!this.valueAdded) {
            this.stack.enqueue(this.value)
            this.valueAdded = true;
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
        if (index === this.stack.size() - 1 && this.valueAdded) {
            return ElementStates.Changing
        } else {
            return ElementStates.Default
        }
    }
}