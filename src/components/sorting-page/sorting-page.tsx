import React, {useEffect, useRef, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import styles from "./sorting.module.css"
import {RadioInput} from "../ui/radio-input/radio-input";
import {Button} from "../ui/button/button";
import {Direction} from "../../types/direction";
import {Column} from "../ui/column/column";


export const SortingPage: React.FC = () => {

  const [selection, setSelection] = useState<boolean>(true)
  const [initial, setInitial] = useState<number[]>([])
  const [direction, setDirection] = useState<Direction | undefined>(undefined)
  const [columns, setColumns] = useState<number[]>([])
  const [index, setIndex] = useState<number>(0)
  const [lastIndex, setLastIndex] = useState<number>(0)

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

  function selectionSort(arr: number[], direction: Direction): number[] {
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let index = i;

      for (let j = i + 1; j < n; j++) {
        switch (direction) {
          case Direction.Ascending:
            if (arr[j] < arr[index]) {
              index = j;
            }
            break;
          case Direction.Descending:
            if (arr[j] > arr[index]) {
              index = j;
            }
            break;

        }
      }

      const temp = arr[index];
      arr[index] = arr[i];
      arr[i] = temp;
    }
    return arr;
  }

  function bubbleSort(arr: number[], direction: Direction): number[] {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - 1; j++) {
        switch (direction) {
          case Direction.Ascending:
            if (arr[j] > arr[j + 1]) {
              let temp = arr[j];
              arr[j] = arr[j + 1];
              arr[j + 1] = temp;
            }
            break;
          case Direction.Descending:
            if (arr[j] < arr[j + 1]) {
              let temp = arr[j];
              arr[j] = arr[j + 1];
              arr[j + 1] = temp;
            }
            break;
        }
      }
    }
    return arr
  }

  useEffect(() => {
    if (direction !== undefined) {
        sorting(columns, selection, direction);
        setDirection(undefined)
    }
  }, [direction, selection, columns]);

  function sorting(arr: number[], type: boolean, direction: Direction){
    let array = []

    switch (type) {
      case true:
        array = selectionSort(arr, direction);
        break;
      case false:
        array = bubbleSort(arr, direction);
        break;
    }

    return array;
  }

  function chooseSortingType(type: boolean) {
    setColumns([...initial])
    setSelection(type)
    setDirection(undefined)
  }

  function newArray(arr: number[]) {
    setInitial([...arr]);
    setColumns(arr);
  }

  return (
    <SolutionLayout title="Сортировка массива">
      <div className={styles.VContainer}>
        <div className={styles.HContainerBig}>
          <div className={styles.HContainer}>
            <RadioInput label="Выбор" checked={selection} onChange={() => chooseSortingType(true)}/>
            <RadioInput label="Пузырек" checked={!selection} onChange={() => chooseSortingType(false)}/>
          </div>
          <div className={styles.HContainer}>
            <Button text="По возрастанию" sorting={Direction.Ascending} onClick={() => setDirection(Direction.Ascending)}/>
            <Button text="По убыванию" sorting={Direction.Descending} onClick={() => setDirection(Direction.Descending)}/>
          </div>
          <div className={styles.HContainer}>
            <Button text="Новый массив" onClick={() => newArray(randomArr())}/>
          </div>
        </div>
        <div className={styles.HContainer}>
          {
              columns.map((value, index) => {
                return <Column index={value} key={index}/>
              })
          }
        </div>
      </div>
    </SolutionLayout>
  );
};
