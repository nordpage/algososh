import Queue from "../../../classes/Queue";
import {AnimationResult} from "../../common/animator";
import {ElementStates} from "../../../types/element-states";

export class QueuePushAnimator<T> {
    private valueAdded: boolean = false;

    constructor(private readonly queue: Queue<T>, private readonly value: T) {
    }

    animateStep(): AnimationResult<Queue<T>> {
        if (!this.valueAdded) {
            this.queue.enqueue(this.value);
            this.valueAdded = true;
            return {
                completed: false,
                result: this.queue
            }
        }
        return {
            completed: true,
            result: this.queue
        }
    }

    getStatus(index: number, item: T): ElementStates {
        if ((!this.valueAdded && this.queue.isTail(index - 1)) || (this.queue.isEmpty() && index === 0)) return ElementStates.Changing;
        return ElementStates.Default;
    }
}