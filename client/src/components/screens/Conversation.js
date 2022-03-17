import React,{useState, useEffect,useContext} from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
import M from 'materialize-css';
const Conversation = ()=>{
  const [list,setlist] = useState([])
  useEffect(()=>{
    fetch("/getfollowing",{            
    headers:{
      "Authorization":"Bearer "+localStorage.getItem("jwt")
  }
}).then(res=>res.json())
.then(result=>{
  setlist(result)
})
.catch(err=>console.log(err))
  },[])


return(
  <div className="messages">
      <div className='followings' style={{flex:"4"}}>
        <ul className="collection">
    {
        list.map(user=>{
            return(
              <>
                <li className="collection-item avatar"  key={user._id}>
                <img src={user.pic?user.pic:"https://res.cloudinary.com/theatulsinghk/image/upload/v1638706287/download_kyzd9t.png"} alt="" className="circle"/>
                <span className="title">{user.name?user.name:"loading..."}</span>
                <Link to={'/messages/'+user._id} className="secondary-content"><i className="material-icons">chat</i></Link> 
                </li>
              </>
            )
        })
    }
        </ul>
      </div>
      <div style={{flex:"2"}}></div>
    </div>
)}
export default Conversation;