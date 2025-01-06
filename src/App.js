import { Route, Routes } from "react-router-dom";
import Articles from "./pages/Articles/Articles";
import Tips from "./pages/Tips/Tips";
import Reminders from "./pages/Reminders/Reminders";
import Door from "./pages/Articles/Door";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Articles />} />
        <Route path="/door" element={<Door />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/tips" element={<Tips />} />
      </Routes>
    </div>
  );
}

export default App;
