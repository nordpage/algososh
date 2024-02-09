import LinkedList, {LinkedNode} from "../../../classes/LinkedList";
import {IData} from "../list-page";
import {AnimationResult} from "../../common/animator";
import {ElementStates} from "../../../types/element-states";
import {clearList} from "./AnimateInsertStepAnimator";

export class AnimateAddToTailStepAnimator {
    private animation: LinkedNode<IData> | null
    constructor(private readonly linkedList: LinkedList<IData>, private readonly inputData: string) {
        this.animation = linkedList.tail!;
        linkedList.tail!.value.future = inputData;
    }

    animateStep(): AnimationResult<LinkedList<IData>> {
        if (this.animation !== this.linkedList.tail) {
            this.linkedList.tail!.value.value = this.linkedList.tail!.value.future;
            this.linkedList.tail!.value.future = undefined;
            this.linkedList.tail!.value.status = "Updated";
            this.animation = this.linkedList.tail;
            return {
                completed: false,
                result: this.linkedList
            }

        }
        if (this.linkedList.tail?.value.future !== undefined) {
            this.linkedList.tail.value.future = undefined;
            this.linkedList.insertAfter(this.linkedList.tail, {
                value: this.inputData,
                status: "Updated",
                future: undefined
            });
            this.animation = this.linkedList.tail!;

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