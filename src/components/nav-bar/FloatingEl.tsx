import {useFloating, offset} from "@floating-ui/react-dom"

const FloatingEl = () => {
    const {x, y, reference, floating, strategy} = useFloating({
        placement: "right",
        middleware: [offset(10)]
    });

  return (
    <>
        <button ref={reference}>Button</button>
        <div
            ref={floating}
            style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content'
            }}
        >
            Tooltip
        </div>
    </>
  )
}
export default FloatingEl
