import React,{useEffect,createContext,useReducer,useContext} from 'react';
import { BrowserRouter,Routes,Route,useNavigate,useLocation} from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Signup from './components/screens/Signup';
import Home from './components/screens/Home';
import Profile from './components/screens/Profile';
import Login from './components/screens/Login';
import Createpost from './components/screens/Createpost';
import { initialstate,reducer } from './reducers/userreducer';
import Userprofile from './components/screens/Userprofile';
import Myposts from './components/screens/Myposts';
import Messages from './components/screens/Messages';
import Conversation from './components/screens/Conversation';
import Follower from './components/screens/Follower';
import Reset from './components/screens/Reset';
import Createpassword from './components/screens/Createpassword';
import Following from './components/screens/Following';

export const UserContext = createContext()
const Routing=()=>{
    const Navigate = useNavigate()
    const user=JSON.parse(localStorage.getItem("user")) 
    const {state,dispatch}=useContext(UserContext)
    const location = useLocation();
  useEffect(()=>{
    if(user){
      dispatch({type:"USER",payload:user})
    }else{
      if(!location.pathname.startsWith('/reset')) 
      Navigate('/login')
    }
  },[])
  return( <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/messages" element={<Conversation />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/profile/:userid" element={<Userprofile />} />
          <Route path="/createpost" element={<Createpost />}/>
          <Route path="/myposts" element={<Myposts />}/>
          <Route exact path="/messages/:recieverid" element={<Messages />}/>
          <Route path='/getfollowing' element={<Following />}/>
          <Route path='/getfollower' element={<Follower />}/>
          <Route exact path='/reset' element={<Reset />}/>
          <Route path='/reset/:token' element={<Createpassword />}/>
    </Routes>
  )
}
function App() {
  const [state,dispatch]=useReducer(reducer,initialstate)
  return (
    <div className="App">
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
        <Navbar />
        <Routing />
        </BrowserRouter>
    </UserContext.Provider>
    </div>
  );
}
export default App;
