import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import axios from "axios";
import BASE_URL from "../../config";
import Cookies from "universal-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import failureImage from '../../assets/failure.png'
import Model from "../../components/Models/Model";

export default function Tip(){
  // useState
  const [advice, setAdvice] = useState([]);
  const [boxMessage, setBoxMessage] = useState("");
  const [boxImage, setBoxImage] = useState("");
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [unautherized, setUnauthrized] = useState(false);

  // useNavigate
  const nav = useNavigate();

  // useLocation
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tipId = params.get('tip_id');

  // Cookies
  const cookie = new Cookies();
  const token = cookie.get("userAccessToken");

  // useEffect
  useEffect(() => {
    axios.get(`${BASE_URL}/advice/${tipId}`,{
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((data) => setAdvice(data.data.data))
    .catch((err) => {
      console.log(err)
      setBoxMessage("عذرا حدث خطأ ما");
      setBoxImage(failureImage);
      setConfirm(false);
      setIsBoxOpen(true);
      if(err.response && err.response.status === 401) {
        setUnauthrized(true);
      }
    })
  }, []);

  useEffect(() => {
    if (isBoxOpen) {
      const timer = setTimeout(() => {
        setIsBoxOpen(false);
        if(unautherized) {
          nav('/');
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isBoxOpen]);

  return(
    <div>
      <Header disabled="true" />
      <div className="introduction-box
        text-base
        md:text-2xl
        flex
        items-center
        justify-end
        container
        px-[25px]
        m-auto
        mt-[25px]
        border-b-2
        border-b-solid
        border-b-black
        pb-[15px]"
      >
        <div className="flex items-center">
          <span className="font-semibold mr-[10px]">النصيحة</span>
          <i className="fa-solid fa-envelope"/>
          <button onClick={() => nav('/tips')}
          className="
          ml-[10px]
          md:ml-[25px]
          hover:bg-gray-300
          rounded-[10px]
          duration-300
          px-[10px]
          py-[5px]">
          رجوع
          <i className="fa-solid fa-chevron-right hidden md:inline md:text-[15px] ml-[5px] md:ml-[10px]"></i>
          </button>
        </div>
      </div>
      <div className="advice-box container m-auto my-[15px] px-[25px]">
        <p className="font-extrabold text-center md:text-right text-[#535763]">
          {advice.length !== 0 ? advice.adviser_name : ""}
        </p>
        <div className="flex flex-col-reverse text-center md:flex-row md:justify-between">
          <span className="text-[#535763]">{advice.length !== 0 ? (advice.created_at).slice(0, 10) : ""}</span>
          <span className="text-[#535763]">{advice.length !== 0 ? advice.adviser_email : ""}</span>
        </div>
        <div dir="rtl" className="bg-[#dddddd] border-2 border-[#AEAEAE] mt-[15px] rounded-lg text-right py-[10px] px-[25px]">
          {advice.length !== 0 ? advice.content : ""}
        </div>
      </div>
      {isBoxOpen && <Model message={boxMessage} imageSrc={boxImage}/>}
    </div>
  );
}