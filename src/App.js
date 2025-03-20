import { Route, Routes } from "react-router-dom";
import Stickers from "./pages/Stickers/Stickers";
import Tips from "./pages/Tips/Tips";
import Sections from "./pages/Sections/Sections";
import Section from "./pages/Sections/Section";
import AddBlog from "./pages/Sections/AddBlog";
import "../src/pages/Sections/Editor.css"
import ListInfo from "./pages/Stickers/ListInfo";
import Login from "./pages/Authntication/Login";
import RequireAuth from "./pages/Authntication/RequireAuth";
import Article from "./pages/Sections/Article";
import EditBlog from "./pages/Sections/EditBlog";
import Tip from "./pages/Tips/Tip";
import Reminders from "./pages/Reminders/Reminders";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login/>} />
          <Route element={<RequireAuth />}>
          <Route path="/sections" element={<Sections />}>
          </Route>
            <Route path="/section" element={<Section />} />
            <Route path="/article" element={<Article />} />
              <Route path="/AddBlog" element={<AddBlog />} />
              <Route path="/EditBlog" element={<EditBlog />} />
            <Route path="/stickers" element={<Stickers />} />
            <Route path="/listinfo" element={<ListInfo />} />
            <Route path="/tips" element={<Tips />} >
              <Route path="/tips/tip" element={<Tip />} />
              <Route path="/tips/reminders" element={<Reminders />} />
            </Route>
          </Route>
      </Routes>
    </div>
  );
}

export default App;
