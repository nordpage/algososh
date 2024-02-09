import React, {useEffect, useRef, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import styles from "./queue-page.module.css";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {ElementStates} from "../../types/element-states";
import {Circle} from "../ui/circle/circle";
import Queue from "../../classes/Queue";
import {SHORT_DELAY_IN_MS} from "../../constants/delays";
import {QueuePushAnimator} from "./animators/QueuePushAnimator";
import {Animator} from "../common/animator";
import {QueuePopAnimator} from "./animators/QueuePopAnimator";

export const QueuePage: React.FC = () => {
  const [data, setData] = useState<string>("");
  const queue = useRef<Queue<string>>(new Queue<string>(7));
  const [submitted, setSubmitted] = useState<boolean>(false);
  const animator = useRef<Animator<Queue<string>, string>>();
  const [display, setDisplay] = useState<(string | null)[]>(queue.current.items);


  useEffect(() => {
    if (!submitted) return;
    let handle: number | undefined;
    const animate = () => {
      const result = animator.current!.animateStep();

      setDisplay([...result.result.items]);
      if (!result.completed) handle =  window.setTimeout(animate, SHORT_DELAY_IN_MS); else {
        setSubmitted(false);
        setData("");
      }
    }
    handle = window.setTimeout(animate, SHORT_DELAY_IN_MS);
    return () => window.clearTimeout(handle);
  }, [submitted]);

  function addValue() {
    animator.current = new QueuePushAnimator<string>(queue.current, data);
    setSubmitted(true);
  }

  function deleteValue() {
    animator.current = new QueuePopAnimator<string>(queue.current);
    setSubmitted(true)
  }

  function clear() {
    setData("")
    setSubmitted(true)
    queue.current.peek();
    setDisplay(queue.current.items);
  }

  return (
      <SolutionLayout title="Очередь">
        <div className={styles.VContainer}>
          <div className={styles.HContainerBig}>
            <div className={styles.HContainer}>
              <Input maxLength={4} max={4} value={data} onChange={(e) => setData(e.currentTarget.value)} extraClass={styles.input}/>
              <Button text="Добавить" disabled={data === ""} onClick={addValue} extraClass={styles.btn}/>
              <Button text="Удалить" disabled={queue.current.isEmpty()} onClick={deleteValue} extraClass={styles.btn}/>
            </div>
            <div className={styles.HContainer}>
              <Button text="Очистить" disabled={queue.current.isEmpty()} onClick={clear} extraClass={styles.btn}/>
            </div>
          </div>
          <div className={styles.HContainer}>
            {
                display.map((value, index) => {
                  const head = queue.current.isHead(index) ? "head" : ""
                  const tail = queue.current.isTail(index) ? "tail" : ""

                  const targetState = submitted ? animator.current?.getStatus(index, value!) : ElementStates.Default;
                  const data = value !== null ? value : ""
                  return <Circle key={index} letter={data} head={head} tail={tail} index={index} state={targetState}/>
                })
            }
          </div>
        </div>
      </SolutionLayout>
  );
};
