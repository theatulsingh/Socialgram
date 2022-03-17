import React,{useEffect,useState,useContext} from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router";
const Userprofile = ()=>{
    const {state,dispatch} = useContext(UserContext);
    const [userdata,setuserdata]= useState(null);
    const {userid} = useParams();
    const [showfollow,setShowFollow] = useState('')
    useEffect(()=>{
        if(state) setShowFollow(!state.following.includes(userid))
    },[state])
    useEffect(()=>{
        fetch(`/profile/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setuserdata(result)
        })
        .catch(err=>console.log(err))
    },[userdata])
    const followuser=()=>{     
        fetch("/follow",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followid:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setShowFollow(false)
        })
        fetch(`/conversation/${userid}`,{
            method:"post",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
    }
    const unfollowuser=()=>{     
        fetch("/unfollow",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followid:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setShowFollow(true)
        })
        fetch(`/deleteconversation/${userid}`,{
            method:"post",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
    }
    return (   
<>
{
    (userdata)
    ?(
    <div>
    <div
            style={{
            display:"flex",
            justifyContent:"space-around",
            margin:"20px auto",
            maxWidth:"600px",
            borderBottom:"1px solid grey"
        }}
    >
        <div>
            <img style={{width:"150px", height:"150px", borderRadius:"80px"}} src={userdata.pic?userdata.pic:"https://res.cloudinary.com/theatulsinghk/image/upload/v1638706287/download_kyzd9t.png"}/>
        </div>
        <div>
          <h4>{userdata.user.name!==undefined?userdata.user.name:"loading.."}</h4>
          <div
          style={{
            display:"flex",
            justifyContent:"space-between",
            width:"118%"
        }}>
             <h5>{userdata.posts!==undefined?userdata.posts.length:"loading.."} posts</h5>
              <h5> {userdata.user.followers!==undefined?userdata.user.followers.length:"loading.."} Followers</h5>
              <h5> {userdata.user.following!==undefined?userdata.user.following.length:"loading.."} Following</h5>
              {showfollow? <button className="waves-effect waves-light btn #2196f3 blue darken-1
 " onClick={()=>followuser()}>follow</button> :
 <button className="waves-effect waves-light btn #2196f3 blue darken-1
 " onClick={()=>unfollowuser()}>unfollow</button>
 }
              

          </div>  
        </div>

    </div>
    <div className="gallery">
    {userdata.posts.map(post=>{
           return( <img className="item" key={post._id} src={post.photo}/>)
        })}
    </div>
    </div>
    ):( <h2>Loading...</h2>)
}
</>
    )
}
export default Userprofile;