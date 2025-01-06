import { Route, Routes } from "react-router-dom";
import Articles from "./pages/Articles/Articles";
import Tips from "./pages/Tips/Stickers";
import Reminders from "./pages/Reminders/Reminders";
import Door from "./pages/Articles/Door";
import WelcomeMail from "./pages/Reminders/Reminders";
import Stickers from "./pages/Tips/Stickers";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Articles />} />
        <Route path="/door" element={<Door />} />
        <Route path="/stickers" element={<Stickers />} />
        <Route path="/welcoemail" element={<WelcomeMail />} />
      </Routes>
    </div>
  );
}

export default App;
