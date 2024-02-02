import React, {useEffect, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import styles from "./stack-page.module.css"
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {Circle} from "../ui/circle/circle";
import {ElementStates} from "../../types/element-states";
import {SHORT_DELAY_IN_MS} from "../../constants/delays";

export const StackPage: React.FC = () => {
  const [data, setData] = useState<string>("");
  const [stack, setStack] = useState<string[]>([])
  const [submitted, setSubmitted] = useState<boolean>(false)


  useEffect(() => {
    if (submitted) {
      setTimeout(() => {
        setData("")
        setSubmitted(false)
      }, SHORT_DELAY_IN_MS)
    }
  }, [submitted]);

  function addValue() {
    stack.push(data)
    setSubmitted(true)
  }

  function deleteValue() {
    stack.pop()
    setSubmitted(true)
  }

  function clear() {
    setData("")
    setSubmitted(false)
    setStack([])
  }

  return (
    <SolutionLayout title="Стек">
      <div className={styles.VContainer}>
        <div className={styles.HContainerBig}>
          <div className={styles.HContainer}>
            <Input maxLength={4} max={4} value={data} onChange={(e) => setData(e.currentTarget.value)}/>
            <Button text="Добавить" disabled={data === ""} onClick={addValue}/>
            <Button text="Удалить" disabled={stack.length === 0} onClick={deleteValue}/>
          </div>
          <div className={styles.HContainer}>
            <Button text="Очистить" disabled={stack.length === 0} onClick={clear}/>
          </div>
        </div>
        <div className={styles.HContainer}>
          {
            stack !== [] && stack.map((value, index) => {
                const head = index === stack.length - 1 ? "Top" : ""
                const computeState = () => {
                  if (index === stack.length - 1) {
                    return submitted ? ElementStates.Changing : ElementStates.Default
                  } else {
                    return ElementStates.Default
                  }
                }
                const targetState = computeState();

                return <Circle key={index} letter={value} head={head} index={index} state={targetState}/>
              })
          }
        </div>
      </div>
    </SolutionLayout>
  );
};
