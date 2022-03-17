import React,{useContext,useState} from "react";
import { Link,useNavigate } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../../App";
const Login = ()=>{
   const {state,dispatch}=useContext(UserContext)
   const Navigate = useNavigate()
   const [email,setemail]= useState("");
   const [password,setpassword]=useState("");
   const postData=()=>{
        fetch("/signin",{
           method:"post",
           headers:{"Content-Type":"application/json"},
           body:JSON.stringify({
              email,
              password
           })
        }).then(res=>res.json()).then((data)=>{
           localStorage.setItem("jwt",data.token);
           localStorage.setItem("user",JSON.stringify(data.user));
         if(data.error){ M.toast({html : data.error,classes:"#d32f2f red darken-2"})
         }else{ M.toast({html: data.message,classes:"#2e7d32 green darken-3"})
         dispatch({type:"USER",payload:data.user})
         Navigate('/')
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
     <input  type="password" placeholder="Password"
        value={password}
        onChange={(e)=>setpassword(e.target.value)}
     />
     <button className="waves-effect waves-light btn #2196f3 blue darken-1
"     onClick={()=>postData()}
      >Login</button>
<br/><br/>
      <Link to="/signup">Don't have an account?</Link>
      <br/><br/>
      <Link to="/reset">Forget Password?</Link>
    </div>
    </>

   ) 
}
export default Login;