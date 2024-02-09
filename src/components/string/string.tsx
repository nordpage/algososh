import React, {useEffect, useRef, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import {Circle} from "../ui/circle/circle";
import styles from "./string.module.css"
import {SHORT_DELAY_IN_MS} from "../../constants/delays";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {ElementStates} from "../../types/element-states";
import {Animator} from "../common/animator";
import {StringAnimator} from "./animators/StringAnimator";


export const StringComponent: React.FC = () => {
    const [value, setValue] = useState<string>("");
    const [newValue, setNewValue] = useState<string[]>([]);
    const [submitted, setSubmitted] = useState<boolean>(false)
    const animator = useRef<Animator<string[], string>>();

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

    function onReverse() {
        const arr = value.split("");
        animator.current = new StringAnimator(arr);
        setNewValue(arr);
        setSubmitted(true);
    }


  return (
    <SolutionLayout title="Строка">
        <div className={styles.VContainer}>
            <div className={styles.HContainer}>
                <Input maxLength={11} onChange={(e) => setValue(e.currentTarget.value)} extraClass={styles.input}/>
                <Button text="Развернуть" disabled={value === ""} onClick={onReverse} extraClass={styles.btn}/>
            </div>
            <div className={styles.HContainer}>
                {
                    newValue !== [] && newValue.map((value1, i) => {

                        const targetState = submitted ? animator.current?.getStatus(i, value) : ElementStates.Modified;

                        return <Circle key={i} letter={value1} state={targetState}/>
                    })
                }
            </div>
        </div>
    </SolutionLayout>
  );
};
