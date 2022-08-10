import spinner from "../assets/spinner.gif"
import Image from "next/image"

function Spinner() {
  return (
    <div className="spinner__container">
        <Image src={spinner}/>
    </div>
  )
}

export default Spinner
