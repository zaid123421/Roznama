import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { User } from "../../hooks/Context";
import Cookies from "universal-cookie";
import BASE_URL from "../../config";
import mosque from "../../assets/mosque.png"
import green_logo from "../../assets/green-logo.png"
import Button from "../../components/Button/Button";

export default function Login() {
  // useState
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [accept, setAccept] = useState(false);
  const [error, setError] = useState(false);

  // useContext
  const userInfo = useContext(User);

  // useNavigate
  const nav = useNavigate();

  async function Submit(e) {
    e.preventDefault();
    setAccept(true);
    try {
      let res = await axios.post(`${BASE_URL}/auth/login`, {
        username: username,
        password: password,
      });
      const userAccessToken = res.data.data.token;
      const userName = res.data.data.user.username;
      userInfo.setAuth({
        userAccessToken,
        userName,
      });
      const cookie = new Cookies();
      cookie.set("userName", userName, { path: "/" });
      cookie.set("userAccessToken", userAccessToken, { path: "/" });
      nav("/sections")
    } catch (err) {
      console.log(err);
      if (err.response.status === 422 || err.response.status === 500) {
        setError(true);
      }
    }
  }

  return (
    <div className="w-full h-[100vh] relative md:bg-gradient-to-t from-white via-[rgba(231, 255, 224, 1)] to-[rgba(78,144,60,1)] overflow-hidden">
      <img src = {mosque} alt="mosque" className="hidden md:block w-full absolute bottom-[-75px]" />
      <img src = {green_logo} alt="mosque" className="hidden md:block w-[200px] lg:w-[300px] absolute right-[10px] top-[-10px]"/>
      <div className="w-full md:h-fit md:w-[400px] absolute translate-x-[-50%] translate-y-[-50%] left-[50%] top-[50%] p-[20px] md:rounded-md flex flex-col md:bg-white/40 filter backdrop-blur-md md:border-2 md:border-gray-300">
        <h1 className="mb-[70px] mt-[20px] text-center text-[24px] text-green-800 font-bold">تسجيل الدخول</h1>
        <div className="flex flex-col mb-[25px]">
          <label className="text-right mb-[10px]" htmlFor="login-username-input">
            اسم المستخدم
          </label>
          <input
            autoFocus
            className="outline-none p-[7px] rounded-md border-[2px] border-gray-400"
            id="login-username-input"
            type="Email"
            value={username}
            onChange={(e) => {setUsername(e.target.value); setError(false)}}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-right mb-[10px]" htmlFor="login-password-input">
            كلمة المرور
          </label>
          <input
            className="outline-none p-[7px] rounded-md border-[2px] border-gray-400"
            id="login-password-input"
            type="Password"
            value={password}
            onChange={(e) => {setPassword(e.target.value); setError(false)}}
          />
        </div>
        {error && <p className="absolute text-[#ff0000] text-[14px] font-extrabold right-[20px] bottom-[110px]">خطأ في اسم المستخدم أو كلمة المرور</p>}
        <Button
          className="mt-[80px] mb-[20px] bg-green-600 text-white rounded-xl py-[7px]"
          label="تسجيل الدخول"
          onClick={Submit}
        />
      </div>
    </div>
  );
}
