import React, {useEffect, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import {Circle} from "../ui/circle/circle";
import styles from "./string.module.css"
import {DELAY_IN_MS} from "../../constants/delays";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {ElementStates} from "../../types/element-states";


export const StringComponent: React.FC = () => {
    const [value, setValue] = useState<string>("");
    const [newValue, setNewValue] = useState<string[]>([]);
    const [index, setIndex] = useState<number>(0)
    const [submitted, setSubmitted] = useState<boolean>(false)

    useEffect(() => {
        if (submitted) {
            setTimeout(() => {
                let n = newValue.length;
                let ch = newValue;
                let temp;


                const middle = Math.floor(n / 2)

                if (index < middle) {
                    const lastIndex = n - index - 1;
                    temp = ch[index];
                    ch[index] = ch[lastIndex];
                    ch[lastIndex] = temp;
                    setNewValue(ch);
                    setIndex(index + 1)
                } else {
                    setSubmitted(false)
                }

            }, DELAY_IN_MS)
        }
    }, [index, value, submitted]);

    function onReverse() {
        setSubmitted(true)
        setNewValue(value.split(""))
        setIndex(0); //reverseStr(value)
    }


  return (
    <SolutionLayout title="Строка">
        <div className={styles.VContainer}>
            <div className={styles.HContainer}>
                <Input maxLength={11} onChange={(e) => setValue(e.currentTarget.value)}/>
                <Button text="Развернуть" disabled={value === ""} onClick={onReverse}/>
            </div>
            <div className={styles.HContainer}>
                {
                    newValue !== [] && newValue.map((value1, i) => {
                        const computeState = () => {
                            if (!submitted || i < index || i > newValue.length - index - 1) {
                                return ElementStates.Modified;
                            }

                            return (index === i || i === newValue.length - index - 1 ? ElementStates.Changing : ElementStates.Default)

                        }
                        const targetState = computeState()

                        return <Circle key={i} letter={value1} state={targetState}/>
                    })
                }
            </div>
        </div>
    </SolutionLayout>
  );
};
