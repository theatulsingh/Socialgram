import React,{useEffect,useState,useContext} from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
const Profile = ()=>{
    const {state,dispatch} = useContext(UserContext);
    const [data,setdata]= useState([])
    const [photo,setphoto]=useState("")
    useEffect(()=>{
        fetch('/myposts',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setdata(result.myposts);
        })
    },[])
    useEffect(()=>{
        if(photo){
            const data = new FormData()
            data.append("file",photo)
            data.append("upload_preset","socialgram")
            data.append("cloud_name","theatulsinghk")
            fetch("https://api.cloudinary.com/v1_1/theatulsinghk/image/upload",{
              method:"post",
              body:data
            }).then(res=>res.json())
            .then(data=>{
                fetch('/updatepic',{
                    method:"put",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":"Bearer "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })
                }).then(res=>res.json())
                .then(result=>{
                    localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                    dispatch({type:"UPDATEPIC",payload:result.pic})
                })
            })
            .catch(err=>console.log(err))
        }
    },[photo])
    return (
<>
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
            <img style={{width:"150px", height:"150px", borderRadius:"80px"}} src={state?state.pic:"https://res.cloudinary.com/theatulsinghk/image/upload/v1638706287/download_kyzd9t.png"}/>
            <div className="file-field ">
      <div className="waves-effect waves-light btn-small #2196f3 blue 
 " style={{margin:"10px"}}>
        <span >Update Pic</span>
        <input type="file" onChange={(e)=>setphoto(e.target.files[0])}/>
      </div>
      <div className="file-path-wrapper">
      </div>
    </div>
        </div>
        <div>
        <h4>{state?state.name:"loading.."}</h4>
          <h6> {state?state.email:"loading.."} </h6>
          <div
          style={{
            display:"flex",
            justifyContent:"space-between",
            width:"118%"
        }}>
             <Link to="/myposts"><h5>{data.length} Posts</h5></Link> 
             <Link to="/getfollower"><h5>{state?state.followers.length:"0"} Followers</h5></Link> 
             <Link to="/getfollowing"><h5>{state?state.following.length:"0"} Following</h5></Link> 
          </div>  
        </div>

    </div>
    <div className="gallery">
        {data.map(mypost=>{
           return( <img className="item" key={mypost._id} src={mypost.photo}/>)
        })}
    </div>
</>
    )
}
export default Profile;