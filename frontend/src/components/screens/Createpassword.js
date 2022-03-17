import React,{useState} from "react";
import { Link,useNavigate, useParams } from "react-router-dom";
import M from "materialize-css";
const Createpassword = ()=>{
    const{token} = useParams()
   const Navigate = useNavigate()
   const [password,setpassword]=useState("");
   const postData=()=>{
        fetch('/new-password',{
           method:"post",
           headers:{"Content-Type":"application/json"},
           body:JSON.stringify({
              password,
              token
           })
        }).then(res=>res.json())
        .then((data)=>{
         if(data.error){ M.toast({html : data.error,classes:"#d32f2f red darken-2"})
         }else{ M.toast({html: data.message,classes:"#2e7d32 green darken-3"})
         Navigate('/login')
         }
      })
   }
   return(
    <>
    <div className="card input-field">
     <h2 className="brand-logo">Socialgram</h2>  
     <input  type="password" placeholder="Enter New Password"
        value={password}
        onChange={(e)=>setpassword(e.target.value)}
     />
     <button className="waves-effect waves-light btn #2196f3 blue darken-1
"     onClick={()=>postData()}
      >Set Password</button>
<br/><br/>
    </div>
    </>

   ) 
}
export default Createpassword;