import {ElementStates} from "../../types/element-states";

export type AnimationResult<T> = {
    result: T;
    completed: boolean;
}

export type Animator<T, TValue> = {
    animateStep: () => AnimationResult<T>;
    getStatus: (index: number, item: TValue) => ElementStates;
}