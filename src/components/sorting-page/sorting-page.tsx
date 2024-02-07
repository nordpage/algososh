import React, {useEffect, useRef, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import styles from "./sorting.module.css"
import {RadioInput} from "../ui/radio-input/radio-input";
import {Button} from "../ui/button/button";
import {Direction} from "../../types/direction";
import {Column} from "../ui/column/column";
import {ElementStates} from "../../types/element-states";
import {SHORT_DELAY_IN_MS} from "../../constants/delays";


type SortType = "Bubble" | "Selection";

type Animation = {
  i: number;
  j: number;
}

export const SortingPage: React.FC = () => {

  const [initial, setInitial] = useState<number[]>([])
  const [direction, _setDirection] = useState<Direction | undefined>(undefined)
  const [columns, setColumns] = useState<number[]>([]);
  const [animation, setAnimation] = useState<Animation>({i: 0, j: 0});
  const chooseArrIndex = useRef<number>(0);
  const [sortType, setSortType] = useState<SortType>("Selection");
  const arr = useRef<number[]>([])

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
    if (direction === undefined)
      return;
    if (sortType === "Bubble") {
      setTimeout(() => {
        animateBubbleSortStep();
      }, SHORT_DELAY_IN_MS)
    } else {
      setTimeout(() => {
        animateSelectionSortStep();
      }, SHORT_DELAY_IN_MS)
    }
  }, [direction, animation]);

  const animateBubbleSortStep = () => {
    let i = animation.i;
    let j = animation.j;
    if (j < i - 1) {
      switch (direction) {
        case Direction.Ascending:
          if (arr.current[j] > arr.current[j + 1]) {
            let temp = arr.current[j];
            arr.current[j] = arr.current[j + 1];
            arr.current[j + 1] = temp;
          }
          break;
        case Direction.Descending:
          if (arr.current[j] < arr.current[j + 1]) {
            let temp = arr.current[j];
            arr.current[j] = arr.current[j + 1];
            arr.current[j + 1] = temp;
          }
          break;
      }
      ++j;
    } else if (i >= 0) {
      --i;
      j = 0;
    } else {
      _setDirection(undefined);
    }
    setAnimation({i, j})
    setColumns(arr.current)
  }

  const animateSelectionSortStep = () => {
    let i = animation.i;
    let j = animation.j;
    if (j < columns.length) {
      switch (direction) {
        case Direction.Ascending:
          if (arr.current[j] < arr.current[chooseArrIndex.current]) {
            chooseArrIndex.current = j;
          }
          break;
        case Direction.Descending:
          if (arr.current[j] > arr.current[chooseArrIndex.current]) {
            chooseArrIndex.current = j;
          }
          break;
      }
      ++j;
    } else if (i < columns.length - 1) {
      const temp = arr.current[i];
      arr.current[i] = arr.current[chooseArrIndex.current];
      arr.current[chooseArrIndex.current] = temp;
      ++i;
      j = i + 1;
      chooseArrIndex.current = i;
    } else {
      _setDirection(undefined);
    }
    setAnimation({i, j})
    setColumns(arr.current)
  }

  const isLoader = (directionType: Direction) => {
    return direction  === directionType;
  }

  const isDisabled = (directionType: Direction) => {
    return direction === directionType;
  }

  const setDirection = (direction: Direction | undefined) => {
    arr.current = columns;
    _setDirection(direction);
    if (sortType === "Bubble") {
      setAnimation({
        i: arr.current.length,
        j: 0
      })
    } else {
      setAnimation({
        i: 0,
        j: 1
      });
      chooseArrIndex.current = 0;
    }
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
    if (direction === undefined)
      return ElementStates.Default;

    if (sortType === "Bubble") {
      if (index >= animation.i) {
        return ElementStates.Modified;
      }
      if (index === animation.j || index === animation.j + 1) {
        return ElementStates.Changing;
      }
      return ElementStates.Default;
    } else {
      if (index < animation.i || animation.i === arr.current.length - 1) {
        return ElementStates.Modified;
      }
      if (index === animation.i || index === animation.j) {
        return ElementStates.Changing;
      }
      return ElementStates.Default;
    }
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
