import React, {useEffect, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import styles from "./stack-page.module.css"
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {Circle} from "../ui/circle/circle";
import {ElementStates} from "../../types/element-states";
import {SHORT_DELAY_IN_MS} from "../../constants/delays";
import Stack from "../../classes/Stack";

export const StackPage: React.FC = () => {
  const [data, setData] = useState<string>("");
  const [stack, setStack] = useState(new Stack<string>())
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
    stack.enqueue(data)
    setSubmitted(true)
  }

  function deleteValue() {
    stack.dequeue()
    setSubmitted(true)
  }

  function clear() {
    stack.peek()
    setSubmitted(true)
  }

  return (
    <SolutionLayout title="Стек">
      <div className={styles.VContainer}>
        <div className={styles.HContainerBig}>
          <div className={styles.HContainer}>
            <Input maxLength={4} max={4} value={data} onChange={(e) => setData(e.currentTarget.value)} extraClass={styles.input}/>
            <Button text="Добавить" disabled={data === ""} onClick={addValue} extraClass={styles.btn}/>
            <Button text="Удалить" disabled={stack.isEmpty()} onClick={deleteValue} extraClass={styles.btn}/>
          </div>
          <div className={styles.HContainer}>
            <Button text="Очистить" disabled={stack.isEmpty()} onClick={clear} extraClass={styles.btn}/>
          </div>
        </div>
        <div className={styles.HContainer}>
          {
            !stack.isEmpty() && stack.items.map((value, index) => {
                const head = stack.isHead(value) ? "Top" : ""
                const computeState = () => {
                  if (index === stack.size() - 1) {
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
