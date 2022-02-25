import { 
  BottomNavigation, 
  BottomNavigationAction } from "@mui/material";
import {  
  Route, 
  Routes,
  useNavigate
} from "react-router-dom";
import {
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  House as HouseIcon
} from '@mui/icons-material'
import MainPage from "./pages/MainPage/MainPage";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import { useState } from "react";
import axios from "axios";

function App() {
  const navigate = useNavigate() 

  const [value, setValue] = useState(0);
  const [favoriteCurr, setFavoriteCurr] = useState([])

  const navigateHandler = (event, newValue) => {
    if (newValue === 0) {
      navigate('/')
      setValue(newValue);
    } else if (newValue === 1) {
      navigate('/settings')
      setValue(newValue);
    } else {
      axios.get('https://www.nbrb.by/api/exrates/currencies')
      .then(res => console.log(res))
    }
  } 

  const onAddCurr = (curr) => {
    setFavoriteCurr(currencies => currencies.concat(curr))
  }

  return (
    <div className='app-wrapper'>
      <Routes>
        <Route path="/" element={<MainPage favoriteCurr={favoriteCurr}/>}></Route>
        <Route path="/settings" element={<SettingsPage onAddCurr={onAddCurr}/>}></Route>
      </Routes>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => navigateHandler(event, newValue)}
      >
        <BottomNavigationAction label="Home" icon={<HouseIcon />} to={'/'}/>
        <BottomNavigationAction label="Settings" icon={<SettingsIcon />} to={'/settings'}/>
        <BottomNavigationAction label="Refresh" icon={<RefreshIcon />} />
      </BottomNavigation>
    </div>
  );
}

export default App;
