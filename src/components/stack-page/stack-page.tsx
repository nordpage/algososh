import React, {useEffect, useRef, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import styles from "./stack-page.module.css"
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {Circle} from "../ui/circle/circle";
import {ElementStates} from "../../types/element-states";
import {SHORT_DELAY_IN_MS} from "../../constants/delays";
import Stack from "../../classes/Stack";
import {Animator} from "../common/animator";
import {StackPushAnimator} from "./animators/StackPushAnimator";
import {StackPopAnimator} from "./animators/StackPopAnimator";

export const StackPage: React.FC = () => {
  const [data, setData] = useState<string>("");
  const stack = useRef(new Stack<string>())
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [display, setDisplay] = useState<string[]>([])
  const animator = useRef<Animator<Stack<string>, string>>();


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
    animator.current = new StackPushAnimator<string>(stack.current,data);
    setSubmitted(true)
  }

  function deleteValue() {
    animator.current = new StackPopAnimator<string>(stack.current);
    setSubmitted(true)
  }

  function clear() {
    stack.current.peek()
    setSubmitted(true)
    setDisplay([])
  }

  return (
    <SolutionLayout title="Стек">
      <div className={styles.VContainer}>
        <div className={styles.HContainerBig}>
          <div className={styles.HContainer}>
            <Input maxLength={4} max={4} value={data} onChange={(e) => setData(e.currentTarget.value)} extraClass={styles.input}/>
            <Button text="Добавить" disabled={data === ""} onClick={addValue} extraClass={styles.btn}/>
            <Button text="Удалить" disabled={display.length === 0} onClick={deleteValue} extraClass={styles.btn}/>
          </div>
          <div className={styles.HContainer}>
            <Button text="Очистить" disabled={display.length === 0} onClick={clear} extraClass={styles.btn}/>
          </div>
        </div>
        <div className={styles.HContainer}>
          {
            display.map((value, index) => {

                const targetState = submitted ? animator.current?.getStatus(index, value) : ElementStates.Default;

                return <Circle key={index} letter={value} head={index === 0 ? "Top" : ""} index={index} state={targetState}/>
              })
          }
        </div>
      </div>
    </SolutionLayout>
  );
};
