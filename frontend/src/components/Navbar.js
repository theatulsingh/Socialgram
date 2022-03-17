import React ,{useContext,useState,useRef,useEffect}from "react";
import { Link,useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css"
const Navbar = ()=>{
    const {state,dispatch}=useContext(UserContext);
    const  searchModal = useRef(null)
    const [search,setSearch] = useState('')
    const [userDetails,setUserDetails] = useState([])
    const Navigate=useNavigate()
    useEffect(()=>{
        M.Modal.init(searchModal.current)
    },[])
    const renderList= ()=>{
        if(state){
        return(
            [
            <li key="1"><i  data-target="modal1" className="large material-icons modal-trigger" style={{color:"black"}}>search</i></li>,
            <li key="2"><Link to="/profile">Profile</Link></li>,
            <li key="3"><Link to="/createpost">Create Post</Link></li>,
            <li key="4"><Link to="/myposts">My Posts</Link></li>,
            <li key="5"><Link to="/messages">Message</Link></li>,
            <li key="6">
            <button className="waves-effect waves-light btn #c62828 red darken-3
"    style={{margin:"0px"}} onClick={()=>{
            localStorage.clear()
            dispatch({type:"CLEAR"})
            Navigate('/login');
}}
      >Logout</button>
            </li>
            ]
        )

    }else{
        return(
            [
            <li><Link to="/login">Login</Link></li>,
            <li><Link to="/signup">Signup</Link></li>   
            ]
        )
    }
    }
    const fetchUsers = (query)=>{
        setSearch(query)
        fetch('/search-users',{
          method:"post",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            query
          })
        }).then(res=>res.json())
        .then(results=>{
          setUserDetails(results.user)
        })
     }

    return (
    <nav>
        <div className="nav-wrapper white" style={{padding:"5px"}}>
        <Link to={state?"/":"/login"} className="brand-logo left">Socialgram</Link>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
            {renderList()}
        </ul>
        </div>
        <div id="modal1" class="modal" ref={searchModal} style={{color:"black"}}>
          <div className="modal-content">
          <input
            type="text"
            placeholder="search users"
            value={search}
            onChange={(e)=>fetchUsers(e.target.value)}
            />
             <ul className="collection">
               {userDetails.map(item=>{
                 return <Link to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{
                   M.Modal.getInstance(searchModal.current).close()
                   setSearch('')
                 }}><li className="collection-item">{item.email}</li></Link> 
               })}
               
              </ul>
          </div>
          <div className="modal-footer">
            <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>close</button>
          </div>
        </div>
    </nav>
    )
}
export default Navbar;