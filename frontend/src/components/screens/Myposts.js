import React,{useState, useEffect,useContext} from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
import M from 'materialize-css'
const Myposts = ()=>{
  const [data,setData] = useState([])
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    fetch('/myposts',{
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(Data=>{
      setData(Data.myposts);
    })
  },[data])
  const likepost = (postid)=>{
    fetch("/like",{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        postid
      })
    }).then(res=>res.json())
    .then(result=>{
          }).catch(err=>{
              console.log(err)
          })
  }
  const unlikepost = (postid)=>{
    fetch("/unlike",{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        postid
      })
    }).then(res=>res.json()) 
    .then(result=>{
          }).catch(err=>{
              console.log(err)
          })
  }
  const makecomment = (text,postid)=>{
    fetch("/comment",{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        text,
        postid
      })
    }).then(res=>res.json())
    .then(result=>{
          }).catch(err=>{
              console.log(err)
          })
  }

  const deletecomment = (postid, comment)=>{
    fetch('/deletecomment',{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        postid,
        comment
      })
    }).then(res=>res.json())
    .then(result=>{
      }).catch(err=>{
              console.log(err)
        })
  }
  const deletepost = (postid)=>{
    fetch('/deletepost/'+postid,{
      method:"delete",
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res=>res.json()).then(result=>{
      console.log(result)
      M.toast({html:"Post Deleted !",classes:"#d32f2f red darken-2"})
    })
  }
  return(
    <div className="Home">
    {
      data.map(item=>{
        return (
          <div className="card homecard" key={item._id}>
          <h5 style={{padding:"10px"}}>
             {item.postedby.name}
            {item.postedby._id == state._id   && <i className="material-icons" style={{
                        float:"right"
                    }} 
                    onClick={()=>deletepost(item._id)}
                  >delete</i>
                }</h5>
            <div className="card-image"><img className="item" src={item.photo}/>
            </div>
            <div className="card-content">
            {
              (item.likes.includes(state._id))?(
                <i className="material-icons" onClick={()=>{unlikepost(item._id)}}>
                thumb_down</i>
              ):(
                <i className="material-icons"  onClick={()=>{likepost(item._id)}}>
                thumb_up</i>
              )
              
            }  
            <h6>{item.likes.length} likes {item.comments.length} Comments</h6>
            <h5>{item.caption}</h5>
            {
              item.comments.map(ress=>{
                return(
                <h6 key={ress._id}><span style={{color:"#2196f3"}}>{ress.postedby.name}</span> {ress.text} <i className="material-icons" style={{
                        float:"right"
                    }} 
                    onClick={()=>deletecomment(item._id, ress)}
                  >delete</i></h6>

                )
              })
            }
            <form onSubmit={(e)=>{
              e.preventDefault()
              makecomment(e.target[0].value,item._id)
            }} >
            <input type="text" placeholder="add a coment"/>
            </form>
            </div>
          </div> 
        )
      })
    }

    </div>
  )  
}
export default Myposts;