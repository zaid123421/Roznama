import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import axios from "axios";
import BASE_URL from "../../config";
import Cookies from "universal-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";

export default function Tip(){
  const [advice, setAdvice] = useState([]);

  const nav = useNavigate();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tipId = params.get('tip_id');

  const cookie = new Cookies();
  const token = cookie.get("userAccessToken");

  useEffect(() => {
    axios.get(`${BASE_URL}/advice/${tipId}`,{
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((data) => setAdvice(data.data.data))
    .catch((err) => console.log(err));
  }, [])

  console.log(advice);

  return(
    <div>
      <Header />
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
        <div className="ml-[10px] md:ml-[50px]">
          <span className="font-semibold mr-[10px]">النصيحة</span>
          <i className="fa-solid fa-envelope"/>
          <button onClick={() => nav('/tips')}
          className="ml-[5px]
          md:ml-[25px]
          hover:bg-gray-300
          rounded-[10px]
          duration-300
          px-[10px]
          py-[5px]">
          رجوع
          <i className="fa-solid fa-chevron-right text-[10px] md:text-[15px] ml-[5px] md:ml-[10px]"></i>
          </button>
        </div>
      </div>
      <div className="advice-box container m-auto my-[15px] px-[25px]">
        <p className="font-extrabold text-center md:text-right text-[#535763]">زيد الشمعه</p>
        <div className="flex flex-col-reverse text-center md:flex-row md:justify-between">
          <span className="text-[#535763]">{advice.length !== 0 ? (advice.created_at).slice(0, 10) : ""}</span>
          <span className="text-[#535763]">{advice.length !== 0 ? advice.contact_info.email : ""}</span>
        </div>
        <div className="bg-[#dddddd] border-2 border-[#AEAEAE] mt-[15px] rounded-lg text-right py-[10px] px-[25px]">
          {advice.length !== 0 ? advice.content : ""}
        </div>
      </div>
    </div>
  );
}