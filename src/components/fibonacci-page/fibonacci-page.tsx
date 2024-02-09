import React, {useEffect, useRef, useState} from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from "./fibonacci.module.css"
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {Circle} from "../ui/circle/circle";
import {SHORT_DELAY_IN_MS} from "../../constants/delays";
import {Animator} from "../common/animator";
import {FibonacciAnimator} from "./animators/FibonacciAnimator";

export const FibonacciPage: React.FC = () => {

  const [value, setValue] = useState<number>(0);
  const [newValue, setNewValue] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const animator = useRef<Animator<number[], number>>();

    const ref = useRef<number[]>([1,1])
    useEffect(() => {
        if (!submitted) return;
        let handle: number | undefined;
        const animate = () => {
            const result = animator.current!.animateStep();

            setNewValue([...result.result]);
            if (!result.completed) handle =  window.setTimeout(animate, SHORT_DELAY_IN_MS); else {
                setSubmitted(false);
            }
        }
        handle = window.setTimeout(animate, SHORT_DELAY_IN_MS);
        return () => window.clearTimeout(handle);
    }, [submitted]);


  function onFibonacci() {
      animator.current = new FibonacciAnimator(value+1);
      setSubmitted(true)
  }


  return (
      <SolutionLayout title="Последовательность Фибоначчи">
        <div className={styles.VContainer}>
          <div className={styles.HContainer}>
            <Input max={19} onChange={(e) => setValue(Number(e.currentTarget.value))} extraClass={styles.input}/>
            <Button text="Рассчитать" disabled={value === 0} onClick={onFibonacci} extraClass={styles.btn} isLoader={submitted}/>
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
