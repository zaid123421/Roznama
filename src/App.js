import { BrowserRouter, Route, Routes } from "react-router-dom";
import Articles from "./pages/Articles/Articles";
import Tips from "./pages/Tips/Tips";
import Reminders from "./pages/Reminders/Reminders";

function App() {
  return (
    <div clasName="">
      <Routes>
        <Route path="/" element={<Articles />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/tips" element={<Tips />} />
      </Routes>
    </div>
  );
}

export default App;
