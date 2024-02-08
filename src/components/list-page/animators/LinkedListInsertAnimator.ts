import {ElementStatus, IData} from "../list-page";
import {ElementStates} from "../../../types/element-states";
import {AnimationResult} from "../../common/animator";
import LinkedList from "../../../classes/LinkedList";

export class LinkedListInsertAnimator {


    constructor(private readonly linkedList: LinkedList<IData>) {
    }
    animateStep(): AnimationResult<LinkedList<IData>> {
        throw new Error()
    }

    getStatus(index: number) : ElementStates {
        throw new Error()
    }


}