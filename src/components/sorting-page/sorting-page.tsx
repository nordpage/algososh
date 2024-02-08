import React, {useEffect, useRef, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import styles from "./sorting.module.css"
import {RadioInput} from "../ui/radio-input/radio-input";
import {Button} from "../ui/button/button";
import {Direction} from "../../types/direction";
import {Column} from "../ui/column/column";
import {ElementStates} from "../../types/element-states";
import {SHORT_DELAY_IN_MS} from "../../constants/delays";
import {Animator} from "../common/animator";
import {SelectionSortAnimator} from "./animators/SelectionSortAnimator";
import {BubbleSortAnimator} from "./animators/BubbleSortAnimator";


type SortType = "Bubble" | "Selection";

export const SortingPage: React.FC = () => {

  const [initial, setInitial] = useState<number[]>([])
  const [direction, _setDirection] = useState<Direction | undefined>(undefined)
  const [columns, setColumns] = useState<number[]>([]);
  const [sortType, setSortType] = useState<SortType>("Selection");
  const arr = useRef<number[]>([])
  const [animating, setAnimating] = useState<boolean>(false);
  const animator = useRef<Animator<number[], number>>();


  function randomArr() {
    let arr: number[] = []
    const minLen: number = 3
    const maxLen: number = 17
    const minHeight: number = 0
    const maxHeight: number = 100
    const steps = Math.floor(Math.random() * (maxLen - minLen + 1) + minLen);

    while (arr.length < steps) {
      const r = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight)
      if (arr.indexOf(r) === -1) arr.push(r)
    }
    return arr;

  }

  useEffect(() => {
    if (!animating) return;
    let handle: number | undefined;
    const animate = () => {
      const result = animator.current!.animateStep();
      setColumns([...result.result])
      if (!result.completed) handle =  window.setTimeout(animate, SHORT_DELAY_IN_MS); else {
        setAnimating(false);
        _setDirection(undefined)
      }
    }
    handle = window.setTimeout(animate, SHORT_DELAY_IN_MS);
    return () => window.clearTimeout(handle);
  }, [animating]);

  const isLoader = (directionType: Direction) => {
    return direction  === directionType;
  }

  const isDisabled = (directionType: Direction) => {
    return direction === directionType;
  }

  const setDirection = (direction: Direction | undefined) => {
    arr.current = columns;
    _setDirection(direction);
    if (direction === undefined) return;
    if (sortType === "Bubble") {
      animator.current = new BubbleSortAnimator(arr.current, direction);
    } else {
      animator.current = new SelectionSortAnimator(arr.current, direction);
    }
    setAnimating(true);
  }

  function chooseSortingType(type: SortType) {
    setColumns([...initial])
    setSortType(type)
    setDirection(undefined)
  }

  function newArray(arr: number[]) {
    setInitial([...arr]);
    setColumns(arr);
  }

  const computeState = (index: number) => {
    if (direction === undefined || !animator.current)
      return ElementStates.Default;
    return animator.current!.getStatus(index, 0);
  }

  return (
    <SolutionLayout title="Сортировка массива">
      <div className={styles.VContainer}>
        <div className={styles.HContainerBig}>
          <div className={styles.HContainer}>
            <RadioInput label="Выбор" checked={sortType === "Selection"} onChange={() => chooseSortingType("Selection")} disabled={direction !== undefined}/>
            <RadioInput label="Пузырек" checked={sortType === "Bubble"} onChange={() => chooseSortingType("Bubble")} disabled={direction !== undefined}/>
          </div>
          <div className={styles.HContainer}>
            <Button text="По возрастанию" sorting={Direction.Ascending} onClick={() => setDirection(Direction.Ascending)} isLoader={isLoader(Direction.Ascending)} disabled={isDisabled(Direction.Descending)} extraClass={styles.btn}/>
            <Button text="По убыванию" sorting={Direction.Descending} onClick={() => setDirection(Direction.Descending)} isLoader={isLoader(Direction.Descending)} disabled={isDisabled(Direction.Ascending)} extraClass={styles.btn}/>
          </div>
          <div className={styles.HContainer}>
            <Button text="Новый массив" onClick={() => newArray(randomArr())} disabled={direction !== undefined} extraClass={styles.btnSubmit}/>
          </div>
        </div>
        <div className={styles.Result}>
          {
              columns.map((value, index) => {
                return <Column index={value} key={index} state={computeState(index)}/>
              })
          }
        </div>
      </div>
    </SolutionLayout>
  );
};
