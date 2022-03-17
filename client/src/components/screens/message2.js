import React,{useState, useEffect,useContext, useRef} from "react";
import { UserContext } from "../../App";
import { BrowserRouter as Router, Link }from "react-router-dom";
import { useParams } from "react-router-dom";
import M from 'materialize-css';
import moment from 'moment';
import {io} from 'socket.io-client';
const Messages = ()=>{
  const {state} = useContext(UserContext)
  const {recieverid} = useParams()
  const [recieverinfo,setrid] = useState()
  const [list,setlist] = useState([])
  const [conversation, setconversation]= useState("")
  const [text,setmsg] = useState("")
  const [conversationid,setconid]= useState("")
  const [convolist,setconlist]=useState([])
  const scrollref = useRef()
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket=useRef(io("ws://localhost:4000"))
  useEffect(() => {
    socket.current = io("ws://localhost:4000");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  },[]);
  useEffect(() => {
      setconversation((prev) => [...prev, [arrivalMessage]]);
  }, [arrivalMessage,recieverid]);
  useEffect(()=>{
    if(state) socket.current.emit("addUser",state._id);
  },[state,recieverid])
  useEffect(()=>{
    setconlist(null)
    setconversation("")
  fetch('/getconversation/'+recieverid,{
      headers:{
      "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
  }).then(res=>res.json())
  .then(result=>{
    setconlist(result)
    setconid(result[0]._id.toString())
    result.map(convomen=>{
      fetch('/getmessage/'+convomen._id.toString(),{
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(result=>{
      !conversation.includes(result)?
      setconversation([...conversation, result])
      :setconversation((prev)=>[...prev])
    })
    .catch(err=>console.log(err))
    })
    
  }).catch(err=>console.log(err))
  },[recieverid])
  useEffect(() => {
    scrollref.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation,recieverid]);
  useEffect(()=>{
      fetch(`/profile/${recieverid}`,{
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        }
      }).then(res=>res.json())
      .then(result=>{
          setrid(result.user)
      }).catch(err=>console.log(err))
  },[recieverid])

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

 const sendmsg = ()=>{
  socket.current.emit("sendMessage", {
    senderId:state._id,
    receiverId:recieverid,
    text,
  });
   fetch('/message',{
     method:"post",
     headers:{
      "Authorization":"Bearer "+localStorage.getItem("jwt"),
      "Content-Type":"application/json"
     },
     body:JSON.stringify({
       text,
       sender:JSON.parse(localStorage.getItem("user"))._id.toString(),
       conversationid
     })
   }).then(res=>res.json()).then(result=>{
    setconversation([...conversation, [result]])
    }
   )
 }
return(
  <div className="messages">
      <div className='followings' style={{flex:"4"}}>
        <ul className="collection">
    {
        list.map(user=>{
            return (
              <>
                <li className="collection-item avatar" style={{margin:"10px"}} >
                <img src={user.pic?user.pic:"https://res.cloudinary.com/theatulsinghk/image/upload/v1638706287/download_kyzd9t.png"} alt="" className="circle"/>
                <span className="title">{user.name?user.name:"loading..."}</span>
                <a href={'/messages/'+user._id} className="secondary-content"><i className="material-icons">chat</i></a> 
                </li>
              </>
            )
        })
    }
        </ul>
      </div>
{ 
  (recieverinfo)? 
        <div className="chatsec">
        <div className="nav-wrapper white nameg">
        <Link to={'/profile/'+recieverinfo._id} className="">{recieverinfo.name}</Link>
        </div>
        <div className="chatbox" style={{margin:"20px", padding:"10px" ,flex:"8"}}>  
      { (conversation)?
      <div className="cardContent">
      {conversation.map(messss=>{
     return messss.map(real=>{
                return(
                <div ref={scrollref}>
                    {
                    (real.sender==JSON.parse(localStorage.getItem("user"))._id)?
                    <>
                    <div className="mymessage">{real.text}</div>
                    <span className="mymessagebtm">{moment(real.createdAt).fromNow()}</span></>
                    :
                    <>
                    <div className="message">{real.text}</div>
                    <span className="messagebtm">{moment(real.createdAt).fromNow()}</span></>
                    } 
          </div>
          )
          })
          })
      }</div>:"loading..."
      }
      </div><div className="cardaction">
        <textarea className="messagetext" placeholder="write something..."
        value={text} onChange={(e)=>{setmsg(e.target.value)}}
        ></textarea>
        <button className="waves-effect waves-light btn-small #2196f3 blue bla
        " style={{margin:"15px"}}><i className="material-icons" onClick={()=>sendmsg()}>send</i></button>
        </div></div>:<div>loading...</div>
  }
      <div style={{flex:"2"}}></div>
  </div>
)}
export default Messages;