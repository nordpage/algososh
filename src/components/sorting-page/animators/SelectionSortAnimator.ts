import {Direction} from "../../../types/direction";
import {AnimationResult} from "../../common/animator";
import {ElementStates} from "../../../types/element-states";

export type Animation = {
    i: number;
    j: number;
}
export class SelectionSortAnimator {
    private animation : Animation
    private chooseArrIndex: number = 0

    constructor(private readonly list: number[], private readonly direction: Direction) {
        this.animation = {
            i: 0,
            j: 1
        }
    }
    animateStep(): AnimationResult<number[]> {
        let i = this.animation.i;
        let j = this.animation.j;
        if (j < this.list.length) {
            switch (this.direction) {
                case Direction.Ascending:
                    if (this.list[j] < this.list[this.chooseArrIndex]) {
                        this.chooseArrIndex = j;
                    }
                    break;
                case Direction.Descending:
                    if (this.list[j] > this.list[this.chooseArrIndex]) {
                        this.chooseArrIndex = j;
                    }
                    break;
            }
            ++j;
        } else if (i < this.list.length - 1) {
            const temp = this.list[i];
            this.list[i] = this.list[this.chooseArrIndex];
            this.list[this.chooseArrIndex] = temp;
            ++i;
            j = i + 1;
            this.chooseArrIndex = i;
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
        if (index < this.animation.i || this.animation.i === this.list.length - 1) {
            return ElementStates.Modified;
        }
        if (index === this.animation.i || index === this.animation.j) {
            return ElementStates.Changing;
        }
        return ElementStates.Default;
    }
}