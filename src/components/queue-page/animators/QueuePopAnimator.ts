import Queue from "../../../classes/Queue";
import {AnimationResult} from "../../common/animator";
import {ElementStates} from "../../../types/element-states";

export class QueuePopAnimator<T> {
    private valueRemoved: boolean = false;
    constructor(private readonly queue: Queue<T>) {
    }

    animateStep(): AnimationResult<Queue<T>> {
        if (!this.valueRemoved) {
            this.queue.dequeue();
            this.valueRemoved = true;
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
        if (this.queue.isHead(index) && !this.valueRemoved) {
            return ElementStates.Changing;
        }
        return ElementStates.Default;
    }

}