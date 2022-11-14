import { isNil, move } from "rambda";
import { useState, useRef, useEffect } from "react";

type MovementTypes =
  | "enter__right"
  | "exit__right"
  | "enter__left"
  | "exit__left"
  | "enter__top"
  | "exit__top";

const movementType: MovementTypes[] = [
  "enter__right",
  "exit__right",
  "enter__left",
  "exit__left",
  "enter__top",
  "exit__top",
];

type UseCascadingAnimationProps = {
    cascadeOffset: number;
};

const useCascadingAnimation = ({cascadeOffset = 25}: UseCascadingAnimationProps) => {
  const root = useRef<HTMLDivElement>(null);
  const _cursor = useRef(0);

  const _root = () => {
    if (!root.current) {
      throw new Error("Please pass the rootRef into HTML element");
    } else {
      return root.current;
    }
  };

  useEffect(() => {
    ([..._root().children] as HTMLDivElement[]).forEach((el) => {
      el.style.display = "none";
      el.classList.add("transition");
      el.style.setProperty("--cascadeOffset", `-${cascadeOffset}px`)
    });
  }, []);

  const setCursor = (value?: ((n: number) => number) | number) => {
    if (typeof value === "undefined") {
      return _cursor.current;
    }

    const cursor = typeof value === "function" ? value(_cursor.current) : value;
    _cursor.current = cursor;

    ([..._root().children] as HTMLDivElement[]).forEach((el, i) => {
      if (i === cursor - 1) {
        el.style.display = "";
      } else {
        el.style.display = "none";
      }
    });

    return cursor;
  };

  const moveSlides = (
    movement?: MovementTypes,
    cursorValue?: ((n: number) => number) | number
  ) => {
    const cursor = setCursor(cursorValue);

    const activeSlide = _root().children.item(cursor - 1);
    if (activeSlide && movement) {
      // remove any previous movement types
      activeSlide.classList.forEach((cx, _, list) =>
        movementType.includes(cx as any) ? list.remove(cx) : null
      );

      activeSlide.classList.add(movement);
    }
  };

  const open = () => {
    moveSlides("enter__top", 1);
  };

  const close = () => {
    moveSlides("exit__top");
    setTimeout(() => {
      setCursor(0);
    }, 400);
  };

  const go_right = () => {
    moveSlides("exit__left");
    setTimeout(() => {
      moveSlides("enter__right", (x) => ++x);
    }, 400);
  };

  const go_left = () => {
    moveSlides("exit__right");
    setTimeout(() => {
      moveSlides("enter__left", (x) => --x);
    }, 400);
  };

  return { open, close, go_right, go_left, root };
};
export default useCascadingAnimation;
