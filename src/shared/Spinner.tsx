import spinner from "../assets/spinner.gif"
import Image from "next/image"
import { CSSProperties } from "react"

type Props = {
    style?: CSSProperties
}

function Spinner({style}: Props) {
  return (
    <div style={style} className="spinner__container">
        <Image src={spinner}/>
    </div>
  )
}

export default Spinner
