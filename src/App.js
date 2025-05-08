import NoteList from "./component/NotesList";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import AddNotes from "./component/AddNotes";
import EditNotes from "./component/EditNotes";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NoteList/>}/>
        <Route path="/add" element={<AddNotes/>}/>
        <Route path="/edit/:id" element={<EditNotes/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
