import { useState, useRef } from "react"

type MovementTypes = "enter__right" | "exit__right" | "enter__left" | "exit__left" | "enter__top" | "exit__top";

type UseCascadingAnimationProps = {
    slides?: number;
}

const useCascadingAnimation = ({slides = 1}: UseCascadingAnimationProps) => {
    const root = useRef<HTMLDivElement>(null);
    const _queue = useRef<MovementTypes[]>([]);
    const _cursor = useRef(0);

    const pushToQueue = (movement: MovementTypes) => {
        if (_queue.current.length === 0) {
            _root().classList.add(movement)
        } else {
            if (_queue.current.length > 5) {
                _queue.current.shift()
            }
            const last = _queue.current.at(-1)!
            _root().classList.replace(last, movement)

        }
    }

    const _root = () => {
        if (!root.current) {
            throw new Error("Please pass the rootRef into HTML element");
        } else {
            return root.current
        }
    }

    const expand = () => {
        pushToQueue("enter__top")
    }

    const page_right = () => {
        pushToQueue("exit__left")
        if (_cursor.current >= slides) return
        setTimeout(() => {
            pushToQueue("enter__right")
        }, 400);
    }

    return {root, page_right, expand}
}
export default useCascadingAnimation
