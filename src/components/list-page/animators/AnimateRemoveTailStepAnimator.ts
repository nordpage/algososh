import LinkedList, {LinkedNode} from "../../../classes/LinkedList";
import {IData} from "../list-page";
import {AnimationResult} from "../../common/animator";
import {ElementStates} from "../../../types/element-states";
import {clearList} from "./AnimateInsertStepAnimator";

export class AnimateRemoveTailStepAnimator {
    private current: LinkedNode<IData>
    private animation: LinkedNode<IData> | null
    constructor(private readonly linkedList: LinkedList<IData>) {
        this.current = linkedList.getNodeByPosition(linkedList.length - 2)!;
        this.animation = this.current?.next ?? linkedList.getNodeByPosition(linkedList.length - 1)!;
    }

    animateStep(): AnimationResult<LinkedList<IData>> {
        if (this.animation !== null) {
            if (this.animation.value.future === undefined) {
                this.animation.value.future = this.animation.value.value
                this.animation.value.value = undefined;
                return {
                    completed: false,
                    result: this.linkedList
                }
            }
            if (this.current !== null) {
                this.linkedList.deleteNext(this.current);
            } else {
                this.linkedList.deleteHead();
            }
            this.animation = null;
            return {
                completed: false,
                result: this.linkedList
            }
        }
        clearList(this.linkedList);
        return {
            completed: true,
            result: this.linkedList
        }
    }

    getStatus(index: number, item: IData): ElementStates {
        if (item.status === "Changing") return ElementStates.Changing
        if (item.status === "Updated") return ElementStates.Modified
        return ElementStates.Default
    }
}