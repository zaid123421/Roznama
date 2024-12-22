import { BrowserRouter, Route, Routes } from "react-router-dom";
import Articles from "./pages/Articles/Articles";
import Tips from "./pages/Tips/Tips";
import Reminders from "./pages/Reminders/Reminders";

function App() {
  return (
    <div clasName="">
      <Routes>
        <Route path = "/Roznama/" element = {<Articles />}/>
        <Route path = "/Roznama/reminders" element = {<Reminders />}/>
        <Route path = "/Roznama/tips" element = {<Tips />}/>
      </Routes>
    </div>
  );
}

export default App;
