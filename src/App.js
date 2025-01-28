import { Route, Routes } from "react-router-dom";
import Stickers from "./pages/Stickers/Stickers";
import Tips from "./pages/Tips/Tips";
import Sections from "./pages/Sections/Sections";
import Section from "./pages/Sections/Section";
import AddBlog from "./pages/Sections/AddBlog";

import "../src/pages/Sections/Editor.css"
import ListInfo from "./pages/Stickers/ListInfo";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Sections />} />
        <Route path="/section" element={<Section />} />
        <Route path="/AddBlog" element={<AddBlog />} />
        <Route path="/stickers" element={<Stickers />} />
        <Route path="/listinfo" element={<ListInfo />} />
        <Route path="/tips" element={<Tips />} />
      </Routes>
    </div>
  );
}

export default App;
