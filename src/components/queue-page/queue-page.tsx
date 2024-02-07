import React, {useEffect, useState} from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from "./queue-page.module.css";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {ElementStates} from "../../types/element-states";
import {Circle} from "../ui/circle/circle";
import Queue from "../../classes/Queue";
import {SHORT_DELAY_IN_MS} from "../../constants/delays";

export const QueuePage: React.FC = () => {
  const [data, setData] = useState<string>("");
  const [queue] = useState(new Queue<string>(7));
  const [submitted, setSubmitted] = useState<boolean>(false);


  useEffect(() => {
    if (submitted) {
      setData("")
      setTimeout(() => {
        setSubmitted(false)
      }, SHORT_DELAY_IN_MS)
    }
  }, [submitted]);

  function addValue() {
    queue.enqueue(data);
    setSubmitted(true);
  }

  function deleteValue() {
    queue.dequeue();
    setSubmitted(true)
  }

  function clear() {
    setData("")
    setSubmitted(true)
    queue.peek()
  }

  return (
      <SolutionLayout title="Очередь">
        <div className={styles.VContainer}>
          <div className={styles.HContainerBig}>
            <div className={styles.HContainer}>
              <Input maxLength={4} max={4} value={data} onChange={(e) => setData(e.currentTarget.value)} extraClass={styles.input}/>
              <Button text="Добавить" disabled={data === ""} onClick={addValue} extraClass={styles.btn}/>
              <Button text="Удалить" disabled={queue.isEmpty()} onClick={deleteValue} extraClass={styles.btn}/>
            </div>
            <div className={styles.HContainer}>
              <Button text="Очистить" disabled={queue.isEmpty()} onClick={clear} extraClass={styles.btn}/>
            </div>
          </div>
          <div className={styles.HContainer}>
            {
                queue.items.map((value, index) => {
                  const head = queue.isHead(value) ? "head" : ""
                  const tail = queue.isTail(value) ? "tail" : ""
                  const computeState = () => {
                    if (index === queue.getFilledList().length - 1) {
                      return submitted ? ElementStates.Changing : ElementStates.Default
                    } else {
                      return ElementStates.Default
                    }
                  }
                  const targetState = computeState();
                  const data = value !== undefined ? value.item!! : ""
                  return <Circle key={index} letter={data} head={head} tail={tail} index={index} state={targetState}/>
                })
            }
          </div>
        </div>
      </SolutionLayout>
  );
};
