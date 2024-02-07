import React, {useEffect, useRef, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import styles from "./list-page.module.css"
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import LinkedList, {LinkedNode} from "../../classes/LinkedList";
import {Circle} from "../ui/circle/circle";
import {ArrowIcon} from "../ui/icons/arrow-icon";
import {ElementStates} from "../../types/element-states";
import {DELAY_IN_MS} from "../../constants/delays";

type Action = "None" | "AddToHead" | "AddToTail" | "RemoveFromHead" | "RemoveFromTail" | "AddByIndex" | "RemoveByIndex"

type ElementStatus = "Default" | "Changing" | "Updated" | "Prepare"


interface IData {
  value: string | undefined,
  future: string | undefined,
  status: ElementStatus
}

export const ListPage: React.FC = () => {

  const linkedList = useRef<LinkedList<IData>>(new LinkedList<IData>());
  const [displayList, setDisplayList] = useState<IData[]>(linkedList.current.toArray());
  const [listAction, setListAction] = useState<Action>("None");
  const [inputData, setInputData] = useState<string>("")
  const [inputIndex, setInputIndex] = useState<string>("")
  const [head, setHead] = useState<LinkedNode<IData> | null>(null);
  const [tail, setTail] = useState<LinkedNode<IData> | null>(null);
  const [current, setCurrent] = useState<LinkedNode<IData> | null>(null);
  const [animation, setAnimation] = useState<LinkedNode<IData> | null>(null);
  const [animationPush, setAnimationPush] = useState<number>(0);
  const currentIndex = useRef<number>(0);

  const clearList = () => {
    for (const linkedListElement of linkedList.current.toArray()) {
      linkedListElement.future = undefined;
      linkedListElement.status = "Default";
    }
  }
  const clear = () => {
    setListAction("None");
    clearList();
    setInputIndex("");
    setInputData("");
  }

  const animateInsertStep = () => {
    if (current === animation) {
      clear();
    } else if (animation?.next === current && current!.value.future !== undefined && animation.value.status === "Prepare") {
      current!.value.value = current?.value.future;
      current!.value.future = undefined;
      current!.value.status = "Updated";
      setAnimation(current);
    } else if (animation?.next === current && animation.value.status === "Changing") {

      const nodeValue : IData = {value: inputData,
        future: undefined,
        status: "Updated"};

      const newNode = currentIndex.current > 0 ? linkedList.current.insertAfter(animation, nodeValue) : linkedList.current.addToTheHead(nodeValue);

      current!.value.future = undefined;

      setAnimation(newNode);
      setCurrent(newNode);
    } else {
      if (animation?.value.status === "Default") {
        animation.next!.value.future = animation.value.future
        animation.value.future = undefined
        animation.value.status = "Changing"
        setAnimationPush(Math.random())
      } else {
        setAnimation(animation!.next)
      }
    }
  }

  const animateAddToTailStep = () => {
    if (animation !== linkedList.current.tail) {
      linkedList.current.tail!.value.value = linkedList.current.tail!.value.future;
      linkedList.current.tail!.value.future = undefined;
      linkedList.current.tail!.value.status = "Updated";
      setAnimation(current);

    } else if (linkedList.current.tail?.value.future !== undefined) {
      linkedList.current.tail.value.future = undefined;
      linkedList.current.insertAfter(linkedList.current.tail, {
        value: inputData,
        status: "Updated",
        future: undefined
      });
      setAnimation(linkedList.current.tail);
    } else {
      clear();
    }
    setAnimationPush(Math.random());
  }

  const animateRemoveStep = () => {
    if (current === animation) {
      clear();
    } else if (animation?.next === current && animation.value.status === "Changing" && current?.value.future !== undefined) {
      if (currentIndex.current > 0) {
        linkedList.current.deleteNext(animation);
      } else {
        linkedList.current.deleteHead();
      }
      setCurrent(animation)
    } else if (animation?.next === current && animation.value.status === "Changing" && current?.value.future === undefined) {
      current!.value.future = current?.value.value;
      current!.value.value = undefined;
      setAnimationPush(Math.random())
    } else {
      if (animation?.value.status === "Default") {
        animation.next!.value.future = animation.value.future
        animation.value.future = undefined
        animation.value.status = "Changing"
        setAnimationPush(Math.random())
      } else {
        setAnimation(animation!.next)
      }
    }
  }

  const animateRemoveTailStep = () => {
    if (animation !== null) {
      if (animation.value.future === undefined) {
        animation.value.future = animation.value.value
        animation.value.value = undefined;
      } else {
        if (current !== null) {
          linkedList.current.deleteNext(current);
        } else {
          linkedList.current.deleteHead();
        }
        setAnimation(null);
      }
      setAnimationPush(Math.random());
    } else {
      clear();
    }
  }

  useEffect(() => {
    if (listAction === "None") return;
    setTimeout(() => {
      switch (listAction) {
        case "AddByIndex":
        case "AddToHead":
          animateInsertStep();
          break;
        case "AddToTail":
          animateAddToTailStep();
          break;
        case "RemoveByIndex":
        case "RemoveFromHead":
          animateRemoveStep();
          break;
        case "RemoveFromTail":
          animateRemoveTailStep();
          break;
      }

      setDisplayList([...linkedList.current.toArray()])
    }, DELAY_IN_MS)

  }, [head, tail, current, animation, listAction, animationPush]);

  const isLoader = (action: string) => {
    return listAction === action;
  }

  const isDisabled = (action: string) => {
    return listAction === action || listAction !== "None";
  }

  const addToTheHead = () => {
    setListAction("AddToHead");
    currentIndex.current = 0;
    insert(0);
  }



  const addToTheTail = () => {
    setListAction("AddToTail");
    if (linkedList.current.length === 0) {
      insertFirstNode();
    } else {
      linkedList.current.tail!.value.future = inputData;
      setAnimation(linkedList.current.tail)
    }
    setDisplayList(linkedList.current.toArray());
  }

  const removeElementFromHead = () => {
    setListAction("RemoveFromHead");
    currentIndex.current = 0;
    setCurrent(linkedList.current.head);
    const fakeNode = new LinkedNode<IData>({
      value: "fake",
      status: "Default",
      future: undefined
    });
    fakeNode.next = linkedList.current.head;

    setAnimation(fakeNode);

  }

  const removeElementFromTail = () => {
    currentIndex.current = linkedList.current.length - 1;
    const current = linkedList.current.getNodeByPosition(currentIndex.current - 1);
    const animation = current?.next ?? linkedList.current.getNodeByPosition(currentIndex.current);
    setCurrent(current);
    setAnimation(animation);
    setListAction("RemoveFromTail");
  }

  const insert = (currentIndex:number) => {
    clearList();
    if (linkedList.current.length === 0) {
      insertFirstNode();
    } else {
      const createHead = () => {
        if (currentIndex > 0) return linkedList.current.head;
        const fakeHead = new LinkedNode<IData>({value: "fake", status: "Default", future: undefined});
        fakeHead.next = linkedList.current.head;
        return fakeHead;
      }
      const head = createHead();

      setHead(head)
      setCurrent(linkedList.current.getNodeByPosition(currentIndex))
      setAnimation(head)
      head!.value.future =  inputData;
    }

    setDisplayList(linkedList.current.toArray())
  }

  const insertFirstNode = () => {
    const node = linkedList.current.addToTheHead({
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
    setHead(node);
    setCurrent(node);
    setAnimation(fakeNode);
  }

  const insertInPosition = () => {
   currentIndex.current = Number(inputIndex)
    if (currentIndex.current < 0 || currentIndex.current >= linkedList.current.length) {
      alert("Недопустимый index");
      return;
    }


    setListAction("AddByIndex");
    insert(currentIndex.current);
  }

  const removeFromPosition = () => {
    currentIndex.current = Number(inputIndex)
    if (currentIndex.current < 0 || currentIndex.current >= linkedList.current.length) {
      alert("Недопустимый index");
      return;
    }
    setCurrent(linkedList.current.getNodeByPosition(currentIndex.current))
    if (currentIndex.current > 0)
    setAnimation(linkedList.current.head);
    else {
      const fakeNode = new LinkedNode<IData>({
        value: "fake",
        status: "Default",
        future: undefined
      });
      fakeNode.next = linkedList.current.head;
      setAnimation(fakeNode);
    }
    setListAction("RemoveByIndex");
  }

  const getDisplayState = (data: IData) => {
    if (listAction === "None") return ElementStates.Default
    if (data.status === "Changing") return ElementStates.Changing
    if (data.status === "Updated") return ElementStates.Modified
    return ElementStates.Default
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
