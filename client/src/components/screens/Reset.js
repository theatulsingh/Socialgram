import React,{useState} from "react";
import { Link,useNavigate } from "react-router-dom";
import M from "materialize-css";
const Reset = ()=>{
   const Navigate = useNavigate()
   const [email,setemail]= useState("");
   const postData=()=>{
        fetch("/reset-password",{
           method:"post",
           headers:{"Content-Type":"application/json"},
           body:JSON.stringify({
              email
           })
        }).then(res=>res.json()).then((data)=>{
            setemail("")
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
     <input type="text"  placeholder="Email"
        value={email}
         onChange={(e)=>setemail(e.target.value)}
     />
     <button className="waves-effect waves-light btn #2196f3 blue darken-1
"     onClick={()=>postData()}
      >Use Email</button>
<br/><br/>
    </div>
    </>

   ) 
}
export default Reset;