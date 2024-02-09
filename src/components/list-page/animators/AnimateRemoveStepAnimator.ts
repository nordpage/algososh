import LinkedList, {LinkedNode} from "../../../classes/LinkedList";
import {IData} from "../list-page";
import {AnimationResult} from "../../common/animator";
import {ElementStates} from "../../../types/element-states";
import {clearList} from "./AnimateInsertStepAnimator";

type Action =  "RemoveFromHead"  | "RemoveByIndex"

export class AnimateRemoveStepAnimator {
    private current: LinkedNode<IData>
    private animation: LinkedNode<IData>
    private constructor(private readonly linkedList: LinkedList<IData>, private readonly currentIndex: number) {
        clearList(linkedList);
        this.current = linkedList.getNodeByPosition(currentIndex)!;
        if (currentIndex > 0) {
            this.animation = linkedList.head!;
        } else {
            const fakeNode = new LinkedNode<IData>({
                value: "fake",
                status: "Default",
                future: undefined
            });
            fakeNode.next = linkedList.head;
            this.animation = fakeNode;
        }
    }

    static create(linkedList: LinkedList<IData>, currentIndex: number, action: Action) {
        if ((currentIndex < 0 || currentIndex >= linkedList.length) && action === "RemoveByIndex") {
            return undefined;
        }
        return new AnimateRemoveStepAnimator(linkedList, currentIndex);
    }

    animateStep(): AnimationResult<LinkedList<IData>> {
        if (this.current === this.animation) {
            clearList(this.linkedList);
            return {
                completed: true,
                result: this.linkedList
            }
        }
        if (this.animation?.next === this.current && this.animation.value.status === "Changing" && this.current?.value.future !== undefined) {
            if (this.currentIndex > 0) {
                this.linkedList.deleteNext(this.animation);
            } else {
                this.linkedList.deleteHead();
            }
            this.current = this.animation;
            return {
                completed: false,
                result: this.linkedList
            }
        }
        if (this.animation?.next === this.current && this.animation.value.status === "Changing" && this.current?.value.future === undefined) {
            this.current!.value.future = this.current?.value.value;
            this.current!.value.value = undefined;
            return {
                completed: false,
                result: this.linkedList
            }
        }
        if (this.animation?.value.status === "Default") {
            this.animation.next!.value.future = this.animation.value.future
            this.animation.value.future = undefined
            this.animation.value.status = "Changing"
        } else {
            this.animation = this.animation.next!
        }
        return {
            completed: false,
            result: this.linkedList
        }
    }

    getStatus(index: number, item: IData): ElementStates {
        if (item.status === "Changing") return ElementStates.Changing
        if (item.status === "Updated") return ElementStates.Modified
        return ElementStates.Default
    }
}