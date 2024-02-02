import React, {useEffect, useRef, useState} from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from "./fibonacci.module.css"
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {Circle} from "../ui/circle/circle";
import {SHORT_DELAY_IN_MS} from "../../constants/delays";

export const FibonacciPage: React.FC = () => {

  const [value, setValue] = useState<number>(0);
  const [newValue, setNewValue] = useState<number[]>([]);
  const [index, setIndex] = useState<number>(0)
  const [submitted, setSubmitted] = useState<boolean>(false)
    const ref = useRef<number[]>([1,1])
    useEffect(() => {
        if (submitted) {
            setTimeout(() => {
                const result = ref.current;
                if (index <= value) {
                    result[index] = result[index - 1] + result[index - 2];
                    setNewValue(result)
                    ref.current = result;
                    setIndex(index + 1);
                } else {
                    setSubmitted(false)
                }

            }, SHORT_DELAY_IN_MS)
        }
    }, [value, submitted, index]);


  function onFibonacci() {
      setSubmitted(true)
      setIndex(2)
  }


  return (
      <SolutionLayout title="Последовательность Фибоначчи">
        <div className={styles.VContainer}>
          <div className={styles.HContainer}>
            <Input max={19} onChange={(e) => setValue(Number(e.currentTarget.value))}/>
            <Button text="Рассчитать" disabled={value === 0} onClick={onFibonacci}/>
          </div>
          <div className={styles.Grid}>
              {
                  newValue !== [] && newValue.map((value1, index) => {
                      return <Circle key={index} letter={value1.toString()} index={index} />
                  })
              }
          </div>
        </div>
      </SolutionLayout>
  );
};
