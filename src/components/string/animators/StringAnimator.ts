import {ElementStates} from "../../../types/element-states";
import {AnimationResult} from "../../common/animator";



export class StringAnimator {

    private index: number = 0;
    constructor(private readonly list: string[]) {

    }

    animateStep(): AnimationResult<string[]> {
        let n = this.list.length;
        let ch = this.list;
        let temp;


        const middle = Math.floor(n / 2)

        if (this.index < middle) {
            const lastIndex = n - this.index - 1;
            temp = ch[this.index];
            ch[this.index] = ch[lastIndex];
            ch[lastIndex] = temp;

            this.index = this.index + 1
            return {
                completed: false,
                result: ch
            }
        } else {
            return {
                completed: true,
                result: ch
            }
        }
    }

    getStatus(index: number, item: string): ElementStates {
        if (index < this.index || index > this.list.length - this.index - 1) {
            return ElementStates.Modified;
        }

        return (index === this.index || this.index === this.list.length - index - 1 ? ElementStates.Changing : ElementStates.Default)
    }
}