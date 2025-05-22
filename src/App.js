import {BrowserRouter, Routes, Route} from "react-router-dom";
import AddNotes from "./component/AddNotes";
import EditNotes from "./component/EditNotes";
import Login from "./component/Login";
import DashBoard from "./component/DashBoard";
import Register from "./component/Register";


function App() {

// Set default config untuk semua axios requests
// axios.defaults.withCredentials = true;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={<DashBoard/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/add-notes" element={<AddNotes />} />
        <Route path="/edit/:id" element={<EditNotes/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
