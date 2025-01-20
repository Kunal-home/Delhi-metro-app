import Style from "../css/home.module.css"
import Image from "./image";
import { useState } from "react";
import { Link } from "react-router-dom";
import Findmetro from "./findmetro";
function Home(){
  const[showmetro,setshowmetro]=useState(false);
 const show=()=>{
  setshowmetro(true);
 }
return<>
<div className={`${Style.heading}`}>
<h1 >Find Metro Station Near To You</h1>
<Link className={`${Style.button} btn btn-light`} onClick={show} to="/show">Find</Link>
<Image/>

</div>
</>

}
export default Home;