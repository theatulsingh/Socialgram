import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const Following = (prop)=>{
    const [list,setlist]=useState([])
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
        <>
        <div className='followings' style={{flex:"4",margin:"30px auto",maxWidth:"700px"}}>
                <ul className="collection">
                <h5 style={{ margin:"10px 30px",padding:"5px",borderBottom:"1px solid rgb(228, 228, 228)"}}>You Follow</h5>
    {
        list.map(user=>{
            return (
              <>
                <Link to={'/profile/'+user._id} key={user._id}><li className="collection-item avatar" style={{margin:"10px"}} >
                <img src={user.pic?user.pic:"https://res.cloudinary.com/theatulsinghk/image/upload/v1638706287/download_kyzd9t.png"} alt="" className="circle"/>
                <span className="title">{user.name?user.name:"loading..."}</span>
                </li></Link> 
              </>
            )
        })
    }
        </ul>
      </div>
        </>
    )
}
export default Following;