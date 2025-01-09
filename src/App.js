import { Route, Routes } from "react-router-dom";
import Articles from "./pages/Articles/Articles";
import Door from "./pages/Articles/Door";
import Stickers from "./pages/Stickers/Stickers";
import Tips from "./pages/Tips/Tips";


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Articles />} />
        <Route path="/door" element={<Door />} />
        <Route path="/stickers" element={<Stickers />} />
        <Route path="/tips" element={<Tips />} />
      </Routes>
    </div>
  );
}

export default App;
