import React, {useEffect, useState} from "react";
import { Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import M from "materialize-css";
const Signup = ()=>{

   const Navigate = useNavigate()
   const [name,setname] = useState("");
   const [email,setemail] = useState("")
   const [password,setpassword] = useState("")
   const [photo,setphoto] = useState("");
   const [url,seturl] = useState(undefined);
   useEffect(()=>{
      if(url) postfields()
   },[url])
   const postpic = ()=>{
      const data = new FormData()
      data.append("file",photo)
      data.append("upload_preset","socialgram")
      data.append("cloud_name","theatulsinghk")
      fetch("https://api.cloudinary.com/v1_1/theatulsinghk/image/upload",{
        method:"post",
        body:data
      }).then(res=>res.json())
      .then(data=>{ seturl(data.url)})
      .catch(err=>console.log(err))
    }
    const postfields = ()=>{
      if(!name || !email || !password){ M.toast({html:"Please enter all the fields",classes:"#d32f2f red darken-2"}); return ;}
     if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
         fetch("/signup",{
         method:"post",
         headers:{
            "Content-Type":"application/json"
         },
         body:JSON.stringify({
            name,
            email,
            password,
            pic:url
         })
      }).then(res=>res.json()).then((data)=>{
         if(data.error) M.toast({html : data.error,classes:"#d32f2f red darken-2"})
         else{ M.toast({html: data.message,classes:"#2e7d32 green darken-3"})
         Navigate('/login')
         }
      })
     }else{
      M.toast({html: "Invalid Email!",classes:"#d32f2f red darken-2"})
     }

    }
   const postData= ()=>{
      if(photo) postpic()
      else postfields()
   
   }
   return(
      <>
      <div className="card input-field">
      <h2 className="brand-logo">Socialgram</h2>  
      <input type="text"  placeholder="Name"
      value={name}
      onChange={(e)=>setname(e.target.value)}
      />
      <input type="text"  placeholder="Email"
         value={email}
         onChange={(e)=>setemail(e.target.value)}
      />
      <input  type="password"  placeholder="Password"
         value={password}
         onChange={(e)=>setpassword(e.target.value)}
      />
       <div className="file-field ">
      <div className="waves-effect waves-light btn #2196f3 blue 
 ">
        <span>Upload Profile Pic</span>
        <input type="file" onChange={(e)=>setphoto(e.target.files[0])}/>
      </div>
      <div className="file-path-wrapper">
        <input className="file-path validate " type="text" placeholder="Optional"/>
      </div>
    </div>
      <button className="waves-effect waves-light btn #2196f3 blue darken-1
 " onClick={()=>postData()}>SignUp</button><br/><br/>
      <Link to="/login">Already have an account?</Link>
     </div>
     </>
   ) 
}
export default Signup;