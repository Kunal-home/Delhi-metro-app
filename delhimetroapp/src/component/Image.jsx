import logo from "../assets/img/train.gif"
import Style from "../css/image.module.css"

function Image(){

  return<>
  <img  className={`${Style.imageshow}`} src={logo} alt="loading..."/>
  </>
}

export default Image;