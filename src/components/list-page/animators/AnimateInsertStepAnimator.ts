import LinkedList, {LinkedNode} from "../../../classes/LinkedList";
import {IData} from "../list-page";
import {AnimationResult} from "../../common/animator";
import {ElementStates} from "../../../types/element-states";
type Action =  "AddToHead" | "AddByIndex"
export class AnimateInsertStepAnimator {
    private current: LinkedNode<IData>
    private animation: LinkedNode<IData>
    private constructor(private readonly linkedList: LinkedList<IData>, private readonly currentIndex: number,
                        private readonly inputData: string) {
        clearList(linkedList);
        if (linkedList.length === 0) {
            const {current, animation} = insertFirstNode(linkedList, inputData);
            this.current = current;
            this.animation = animation;
        } else {

            const head = createHead(linkedList, currentIndex);
            this.current = linkedList.getNodeByPosition(currentIndex)!;
            this.animation = head!;
            head!.value.future =  inputData;
        }
    }

    static create(linkedList: LinkedList<IData>, currentIndex: number, inputData: string, action: Action) {
        if ((currentIndex < 0 || currentIndex >= linkedList.length) && action === "AddByIndex") {
            return undefined;
        }
        return new AnimateInsertStepAnimator(linkedList, currentIndex, inputData);
    }

    animateStep(): AnimationResult<LinkedList<IData>> {
        if (this.current === this.animation) {
            clearList(this.linkedList);
            return {
                completed: true,
                result: this.linkedList
            }
        }
        if (this.animation?.next === this.current && this.current!.value.future !== undefined && this.animation.value.status === "Prepare") {
            this.current!.value.value = this.current?.value.future;
            this.current!.value.future = undefined;
            this.current!.value.status = "Updated";
            this.animation = this.current;
            return {
                completed: false,
                result: this.linkedList
            }
        }
        if (this.animation?.next === this.current && this.animation.value.status === "Changing") {

            const nodeValue : IData = {value: this.inputData,
                future: undefined,
                status: "Updated"};

            const newNode = this.currentIndex > 0 ? this.linkedList.insertAfter(this.animation, nodeValue) : this.linkedList.addToTheHead(nodeValue);

            this.current!.value.future = undefined;

            this.animation = newNode;
            this.current = newNode;
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
                this.animation = this.animation.next!;
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
const createHead = (linkedList: LinkedList<IData>, currentIndex: number) => {
    if (currentIndex > 0) return linkedList.head;
    const fakeHead = new LinkedNode<IData>({value: "fake", status: "Default", future: undefined});
    fakeHead.next = linkedList.head;
    return fakeHead;
}
const insertFirstNode = (linkedList: LinkedList<IData>, inputData: string) => {
    const node = linkedList.addToTheHead({
        value: undefined,
        status: "Default",
        future: inputData
    });
    const fakeNode = new LinkedNode<IData>({
        value: "fake",
        status: "Prepare",
        future: undefined
    });
    fakeNode.next = node;
    return {
        current: node,
        animation: fakeNode
    }
}

export const clearList = (linkedList: LinkedList<IData>) => {
    for (const linkedListElement of linkedList.toArray()) {
        linkedListElement.future = undefined;
        linkedListElement.status = "Default";
    }
}