import { MutableRefObject, useEffect, useRef } from "react";

type SynchronizeStateFunction = (updatedElementsList: HTMLElement[]) => void;

type DragElementState = {
  parent: HTMLElement;
  domRectList: Map<HTMLElement, DOMRect>;
  activeElement: HTMLElement | null;
  overlapping: {
    status: "left" | "right" | null;
    element: HTMLElement | null;
  };
  placeholder: HTMLElement | null;
  synchronizeState: SynchronizeStateFunction;
};

const useDragAndDrop = (synchronizeState: SynchronizeStateFunction, state?: any) => {
  const dragElementState = useRef<DragElementState>({} as DragElementState);
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (parentRef) {
      initDragState(
        dragElementState,
        parentRef.current as HTMLElement,
        synchronizeState
      );
      setupDragElement(dragElementState.current);
    }
  }, []);

  useEffect(() => {
    if (parentRef.current) {
        dragElementState.current.domRectList = captureStaticState(parentRef.current);
    }
  }, [state])

  return parentRef;
};
export default useDragAndDrop;

function initDragState(
  refObj: MutableRefObject<DragElementState>,
  parent: HTMLElement,
  synchronizeState: SynchronizeStateFunction
) {
  refObj.current = {
    parent,
    domRectList: captureStaticState(parent),
    activeElement: null,
    overlapping: {
      status: null,
      element: null,
    },
    placeholder: null,
    synchronizeState,
  };
  document.onscroll = () => {
    refObj.current.domRectList = captureStaticState(parent);
  };
}

/**
 * Captures the state of the drap element before it is touched. Call it everytime the
 * element becomes static again.
 * @param parent - the parent element of all the elements that have drag capabilities.
 * @returns a map where each key is an element, and the value is it's DOMRect.
 */
function captureStaticState(parent: HTMLElement) {
  return new Map(
    Array.from(parent.children).map((el, index) => [
      el as HTMLElement,
      el.getBoundingClientRect(),
    ])
  );
}

function activateDragElement(
  activeElement: HTMLElement,
  dragElementState: DragElementState
) {
  const parent = dragElementState.parent;

  const updateActiveElementCoordinates = (
    x: number | ((x: number, y: number) => [number, number]),
    y?: number
  ) => {
    if (typeof x === "function") {
      const coordinates = x(activeElement.offsetLeft, activeElement.offsetTop);
      x = coordinates[0];
      y = coordinates[1];
    }
    activeElement.style.left = x + "px";
    activeElement.style.top = y + "px";
  };

  const updateDOMRectList = (dirtyElement: HTMLElement) => {
    dragElementState.domRectList.set(
      dirtyElement,
      dirtyElement.getBoundingClientRect()
    );
  };

  const calculateOverlap = buildOverlapCalculator(activeElement);

  /**
   * This function should run everytime the mouse moves. It loops through
   * the domRectList and if it finds that the active element meets the threshold
   * for overlapping another element, it sets the overlapping element and the
   * status, which will be either `left` or `right`.
   *
   * As long as the status isn't null, it will check for a change in the status.
   * If it changes to something that is not `null`, it will move the placeholder,
   * and reset the status.
   */
  const checkForOverlap = () => {
    if (dragElementState.overlapping.status === null) {
      dragElementState.domRectList.forEach((domRect, element) => {
        const result = calculateOverlap(domRect);
        if (result !== NONE) {
          dragElementState.overlapping = {
            status: result,
            element,
          };
        }
      });
    } else {
      const result = calculateOverlap(
        (
          dragElementState.overlapping.element as HTMLElement
        ).getBoundingClientRect()
      );

      // Only run the following switch case statement if the status has changed.
      if (result !== dragElementState.overlapping.status) {
        const placeholder = dragElementState.placeholder as HTMLElement;
        const overlappingElement = dragElementState.overlapping
          .element as HTMLElement;

        switch (result) {
          case "left":
            parent.insertBefore(placeholder, overlappingElement);
            break;
          case "right":
            parent.insertBefore(
              placeholder,
              overlappingElement?.nextElementSibling
            );
            break;
          default:
            break;
        }

        updateDOMRectList(overlappingElement as HTMLElement);

        dragElementState.overlapping = {
          status: null,
          element: null,
        };
      }
    }
  }; //fn checkForOverlap

  const placeholder = document.createElement("div");
  placeholder.className = "placeholder";
  parent.insertBefore(placeholder, activeElement.nextElementSibling);
  dragElementState.placeholder = placeholder;

  const { x, y } = dragElementState.domRectList.get(activeElement) as DOMRect;
  dragElementState.domRectList.delete(activeElement);
  updateActiveElementCoordinates(x, y);
  activeElement.classList.add("drag");

  const dropElement = () => {
    parent.replaceChild(
      activeElement,
      dragElementState.placeholder as HTMLElement
    );
    dragElementState.placeholder = null;

    updateActiveElementCoordinates(0, 0);
    activeElement.classList.remove("drag");

    dragElementState.domRectList = captureStaticState(parent);
    dragElementState.synchronizeState(
      Array.from(dragElementState.domRectList.keys())
    );
    dragElementState.overlapping = {
      status: null,
      element: null,
    };
  };

  return { updateActiveElementCoordinates, dropElement, checkForOverlap };
} //fn activeDragElement

function setupDragElement(dragElementState: DragElementState) {
  // Variables hold a snapshot of the mouse position before the next onmousemove.
  let xSnapshot: number, ySnapshot: number;
  dragElementState.parent.onmousedown = mouseDown;

  function mouseDown(event: globalThis.MouseEvent) {
    const target = event.target as HTMLElement;
    console.dir(target);
    if (
      target.classList.contains("image-uploader__add-image-box") ||
      target.classList.contains("image-uploader__grid") ||
      target.tagName === "svg" ||
      target.tagName === "line"
    )
      return;

    event.preventDefault();
    let activeElement;

    if (target.classList.contains("image-uploader__preview")) {
      activeElement = target;
    } else {
      activeElement = target.closest(".image-uploader__preview");
    }

    if (true) {
      // check type of element
      const { updateActiveElementCoordinates, dropElement, checkForOverlap } =
        activateDragElement(activeElement as HTMLElement, dragElementState);
      xSnapshot = event.clientX;
      ySnapshot = event.clientY;

      document.onmouseup = (e: globalThis.MouseEvent) => {
        e.preventDefault();
        dropElement();
        document.onmouseup = null;
        document.onmousemove = null;
      };

      /*
        On every mouse move, this function updates the coordinates of the active
        element, checks for change in overlap status, and creates a new snapshot of
        the x and y coordinates of the mouse.
      */
      document.onmousemove = (e: globalThis.MouseEvent) => {
        e.preventDefault();
        updateActiveElementCoordinates((x: number, y: number) => {
          const pos1 = xSnapshot - e.clientX;
          const pos2 = ySnapshot - e.clientY;
          return [x - pos1, y - pos2];
        });
        checkForOverlap();
        xSnapshot = e.clientX;
        ySnapshot = e.clientY;
      };
    }
  }
} //fn setupDragElement

const ALLOWANCE = 0.25;
const NONE = null;
const LEFT = "left";
const RIGHT = "right";

function buildOverlapCalculator(activeElement: HTMLElement) {
  return (staticElement: DOMRect) => {
    const { top, bottom, left, right, width, height } =
      activeElement.getBoundingClientRect();

    const yThreshold = height * ALLOWANCE;
    const yOverlap =
      staticElement.bottom - top > yThreshold &&
      bottom - staticElement.top > yThreshold;

    if (!yOverlap) {
      return NONE;
    }

    const inactiveMiddle = staticElement.left + staticElement.width / 2; // The x position of the middle of the div we're comparing against
    const activeMiddle = left + width / 2;
    const proximity = activeMiddle - inactiveMiddle; // If both middles are aligned, proximity will be 0. If active is to the left, proximity will be a negative value, and vica versa.

    if (proximity > width && proximity < width * -1) {
      return NONE;
    }

    if (proximity > width / -2 && proximity <= 0) {
      return LEFT;
    }

    if (proximity < width / 2 && proximity > 0) {
      return RIGHT;
    }

    return NONE;
  };
}
