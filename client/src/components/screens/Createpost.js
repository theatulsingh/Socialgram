import React from "react";
import { useState } from "react";
import M from "materialize-css";
import { useNavigate } from "react-router";
import { useEffect } from "react";
const Createpost =()=>{
  const [caption,setcaption] = useState("");
  const [photo,setphoto] = useState("");
  const [url,seturl] = useState("");
  const Navigate = useNavigate();
  useEffect(()=>{
    if(url){
      fetch("/createpost",{
           method:"post",
           headers:{
             "Content-Type":"application/json",
             "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
           body:JSON.stringify({
              caption,
              photo:url
           }),
           user:localStorage.getItem("user")
        }).then(res=>res.json()).then((data)=>{
         if(data.error){ M.toast({html : data.error,classes:"#d32f2f red darken-2"})
         }else{ M.toast({html: data.message,classes:"#2e7d32 green darken-3"})
         Navigate('/myposts')
         }
      })
    .catch(err=>console.log(err))
    }
  },[url])
  const postdata = ()=>{
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
    return (
        <div className="card input-field">
        <input className="input-field"
          type="text" 
          placeholder="caption"
          value={caption}
          onChange={(e)=>setcaption(e.target.value)}
         />
    <div className="file-field ">
      <div className="waves-effect waves-light btn #2196f3 blue 
 ">
        <span>Upload Image</span>
        <input type="file" onChange={(e)=>setphoto(e.target.files[0])}/>
      </div>
      <div className="file-path-wrapper">
        <input className="file-path validate " type="text"/>
      </div>
    </div>
    <button className="waves-effect waves-light btn #2196f3 blue darken-1
" type="submit" name="action" onClick={()=>postdata()}>Post
    <i class="material-icons right">send</i>
  </button>
    </div>

    
    );
}
export default Createpost;