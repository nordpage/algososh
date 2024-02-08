import React, {useEffect, useRef, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import styles from "./list-page.module.css"
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import LinkedList from "../../classes/LinkedList";
import {Circle} from "../ui/circle/circle";
import {ArrowIcon} from "../ui/icons/arrow-icon";
import {ElementStates} from "../../types/element-states";
import { SHORT_DELAY_IN_MS} from "../../constants/delays";
import {Animator} from "../common/animator";
import {AnimateInsertStepAnimator} from "./animators/AnimateInsertStepAnimator";
import {AnimateRemoveStepAnimator} from "./animators/AnimateRemoveStepAnimator";
import {AnimateAddToTailStepAnimator} from "./animators/AnimateAddToTailStepAnimator";
import {AnimateRemoveTailStepAnimator} from "./animators/AnimateRemoveTailStepAnimator";

type Action = "None" | "AddToHead" | "AddToTail" | "RemoveFromHead" | "RemoveFromTail" | "AddByIndex" | "RemoveByIndex"

export type ElementStatus = "Default" | "Changing" | "Updated" | "Prepare"


export interface IData {
  value: string | undefined,
  future: string | undefined,
  status: ElementStatus
}

export const ListPage: React.FC = () => {

  const linkedList = useRef<LinkedList<IData>>(new LinkedList<IData>());
  const animator = useRef<Animator<LinkedList<IData>, IData>>();
  const [displayList, setDisplayList] = useState<IData[]>(linkedList.current.toArray());
  const [listAction, setListAction] = useState<Action>("None");
  const [inputData, setInputData] = useState<string>("")
  const [inputIndex, setInputIndex] = useState<string>("")
  const [animating, setAnimating] = useState<boolean>(false);


  useEffect(() => {
    if (!animating) return;
    let handle: number | undefined;
    const animate = () => {
      const result = animator.current!.animateStep();
      const array: IData[] = [];
      for (const item of result.result.toArray()) {
        array.push({...item});
      }
      setDisplayList(array);
      if (!result.completed) handle =  window.setTimeout(animate, SHORT_DELAY_IN_MS); else {
        setAnimating(false);
        setListAction("None")
      }
    }
     handle = window.setTimeout(animate, SHORT_DELAY_IN_MS);
    return () => window.clearTimeout(handle);
  }, [animating]);

  const isLoader = (action: string) => {
    return listAction === action;
  }

  const isDisabled = (action: string) => {
    return listAction === action || listAction !== "None";
  }

  const addToTheHead = () => {
    setListAction("AddToHead");
    animator.current = AnimateInsertStepAnimator.create(linkedList.current,  0, inputData, "AddToHead");
    setAnimating(true);
  }

  const addToTheTail = () => {
    setListAction("AddToTail");
    if (linkedList.current.length === 0) {
      animator.current = AnimateInsertStepAnimator.create(linkedList.current,  0, inputData, "AddToHead");
    } else {
      animator.current = new AnimateAddToTailStepAnimator(linkedList.current, inputData);
    }
    setAnimating(true);
  }

  const removeElementFromHead = () => {
    setListAction("RemoveFromHead");
    animator.current = AnimateRemoveStepAnimator.create(linkedList.current, Number(inputIndex), "RemoveFromHead");
    setAnimating(true);
    if (animator.current) {
      setAnimating(true);
    }
  }

  const removeElementFromTail = () => {
    if (linkedList.current.length === 0) {
      alert("Список уже пуст!");
      return;
    }
    animator.current = new AnimateRemoveTailStepAnimator(linkedList.current);
    setAnimating(true);
    setListAction("RemoveFromTail");
  }

  const insertInPosition = () => {
    animator.current = AnimateInsertStepAnimator.create(linkedList.current,  Number(inputIndex), inputData, "AddByIndex");
    if (animator.current) {
      setAnimating(true);
      setListAction("AddByIndex");
    } else {
      alert("Недопустимый index")
    }
  }

  const removeFromPosition = () => {
    animator.current = AnimateRemoveStepAnimator.create(linkedList.current, Number(inputIndex), "RemoveByIndex");
    if (animator.current) {
      setAnimating(true);
      setListAction("RemoveByIndex");
    } else {
      alert("Недопустимый index")
    }
  }

  const getDisplayState = (data: IData) => {
    if (listAction === "None" || !animator.current) return ElementStates.Default

    return animator.current.getStatus(0, data);
  }

  return (
    <SolutionLayout title="Связный список">
      <div className={styles.VContainer}>
        <div className={styles.HContainer}>
          <Input maxLength={4} placeholder="Введите значение" extraClass={styles.input} value={inputData} disabled={listAction !== "None"} onChange={(e) => setInputData(e.currentTarget.value)}/>
          <Button text="Добавить в head" extraClass={styles.btn} disabled={isDisabled("AddToHead")} onClick={addToTheHead} isLoader={isLoader("AddToHead")}/>
          <Button text="Добавить в tail" extraClass={styles.btn} disabled={isDisabled("AddToTail")} onClick={addToTheTail} isLoader={isLoader("AddToTail")}/>
          <Button text="Удалить из head" extraClass={styles.btn} onClick={removeElementFromHead} disabled={isDisabled("RemoveFromHead")} isLoader={isLoader("RemoveFromHead")}/>
          <Button text="Удалить из tail" extraClass={styles.btn} onClick={removeElementFromTail} disabled={isDisabled("RemoveFromTail")} isLoader={isLoader("RemoveFromTail")}/>
        </div>
        <div className={styles.HContainer}>
          <Input placeholder="Введите индекс" extraClass={styles.input} value={inputIndex} disabled={listAction !== "None"} onChange={(e) => setInputIndex(e.currentTarget.value)}/>
          <Button text="Добавить по индексу" extraClass={styles.wide} disabled={isDisabled("AddByIndex")} onClick={insertInPosition} isLoader={isLoader("AddByIndex")}/>
          <Button text="Удалить по индексу" extraClass={styles.wide} disabled={isDisabled("RemoveByIndex")} onClick={removeFromPosition} isLoader={isLoader("RemoveByIndex")}/>
        </div>
        <div className={`${styles.HContainer} ${styles.marginTop}`}>
          {
            displayList.map((value, index) => {
              const targetState = getDisplayState(value);

              const head = value.future && (listAction === "AddToHead" || listAction === "AddByIndex" || listAction === "AddToTail") ?
                  <Circle key="up" letter={value.future} isSmall={true} state={ElementStates.Changing}/> : (index === 0 ? "head" : null)

              const tail = value.future && (listAction === "RemoveFromTail" || listAction === "RemoveFromHead" || listAction === "RemoveByIndex") ?
                  <Circle key="down" letter={value.future} isSmall={true} state={ElementStates.Changing}/> : (index === displayList.length - 1 ? "tail" : null)

              return <>
                <Circle
                    key={index}
                    letter={value.value}
                    index={index}
                    state={targetState}
                    head={head}
                    tail={tail}/>
                {(index !== displayList.length - 1) && <ArrowIcon/>}
              </>
            })
          }
        </div>
      </div>
    </SolutionLayout>
  );
};
