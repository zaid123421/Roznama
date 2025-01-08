import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../hooks/Context";

export default function BlogModel({ state }) {
  const [doorModelState, setDoorModelState] = useState(false);
  const [direction, setDirection] = useState("rtl");
  const { isOpen, setIsOpen } = useContext(AppContext);

  const [form, setForm] = useState({
    title: "",
    content: ""
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleTextDirection = (event) => {
    const value = event.target.value;
    if (/[\u0600-\u06FF]/.test(value)) {
      setDirection("rtl");
    } else {
      setDirection("ltr");
    }
  };

  const handleBlur = () => {
    setDirection("rtl");
  };

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value});
  }

  async function insertBlog(e){
    e.preventDefault();
    const data = new FormData();
    data.append("title", form.title);
    data.append("content", form.content);
    try {
      const res = await axios.post(`http://199.192.19.220:8080/api/v1/blogs`, data, {
          headers: {
            'Accept': "application/json",
            'Authorization': `Bearer 2|vOWY0mFvqfJTDVtaD6FiKIzRvfsTbdyyDCfnSikF51ae4875`
          }
        }
      );
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  }

  return(
    <div className="insert-box
        px-[15px]
        inset-0
        bg-black
        bg-opacity-25
        flex
        items-center
        justify-center
        absolute
        z-50
        px-[25px]">
        <div style={{boxShadow: '0px 15px 20px 5px rgba(0, 0, 0, 0.25)'}} className="bg-white text-base w-full flex flex-col p-[20px] md:w-[800px] md:text-xl">
          <p className="flex justify-end pb-[10px] font-bold">إضافة باب</p>
          <div className="flex flex-col ">
            <span className="flex justify-end mb-[5px]">اسم الباب</span>
            <input autoFocus className={`border-2 border-[#AEAEAE] rounded-lg p-[10px] ${
              direction === "rtl" ? "text-right" : "text-left"
              }`}
              style={{ direction }}
              name="title"
              value = {form.title}
              onChange = {(e) => {handleChange(e); handleTextDirection(e)}}
              onBlur={handleBlur}
            />
          </div>
          <div className="flex flex-col mt-[15px]">
            <span className="flex justify-end mb-[5px]">شرح عن الباب</span>
            <textarea className={`resize-none border-2 border-[#AEAEAE] rounded-lg p-[10px] min-h-[175px] ${
              direction === "rtl" ? "text-right" : "text-left"
              }`}
              name="content"
              style={{ direction }}
              value = {form.content} onChange = {(e) => {handleChange(e); handleTextDirection(e)}}
              onBlur={handleBlur}
            />
          </div>
          <div className="flex justify-between mt-[15px]">
            <button onClick={insertBlog}
              className="bg-green-600
              text-white
              w-[100px]
              h-[40px]
              md:w-[282px]
              md:h-[65px]
              rounded-[10px]
              hover:text-black
              hover:bg-transparent
              hover:border-green-600
              duration-300
              border-2
              border-green-600"
            >
              إضافة
            </button>
            <button onClick={() => setIsOpen(false)} className="hover:bg-gray-300
              rounded-[10px]
              duration-300
              px-[30px]
              py-[3px]">
              رجوع
            </button>
          </div>
        </div>
    </div>
  );
}