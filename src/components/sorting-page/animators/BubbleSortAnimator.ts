import {Direction} from "../../../types/direction";
import {AnimationResult} from "../../common/animator";
import {ElementStates} from "../../../types/element-states";
import {Animation} from "./SelectionSortAnimator";

export class BubbleSortAnimator {
    private animation : Animation
    private chooseArrIndex: number = 0
    constructor(private readonly list: number[], private readonly direction: Direction) {
        this.animation = {
            i: list.length,
            j: 0
        }
    }
    animateStep(): AnimationResult<number[]> {
        let i = this.animation.i;
        let j = this.animation.j;
        if (j < i - 1) {
            switch (this.direction) {
                case Direction.Ascending:
                    if (this.list[j] > this.list[j + 1]) {
                        let temp = this.list[j];
                        this.list[j] = this.list[j + 1];
                        this.list[j + 1] = temp;
                    }
                    break;
                case Direction.Descending:
                    if (this.list[j] < this.list[j + 1]) {
                        let temp = this.list[j];
                        this.list[j] = this.list[j + 1];
                        this.list[j + 1] = temp;
                    }
                    break;
            }
            ++j;
        } else if (i >= 0) {
            --i;
            j = 0;
        } else {
            return {
                result: this.list,
                completed: true
            }
        }
        this.animation = {i,j}
        return {
            result: this.list,
            completed: false
        }
    }

    getStatus(index: number, item: number): ElementStates {
        if (index >= this.animation.i) {
            return ElementStates.Modified;
        }
        if (index === this.animation.j || index === this.animation.j + 1) {
            return ElementStates.Changing;
        }
        return ElementStates.Default;
    }
}