import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import axios from "axios";
import BASE_URL from "../../config";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import Model from "../../components/Models/Model";
import successImage from '../../assets/success.gif';
import failureImage from '../../assets/failure.png'
import Loading from "../../components/Models/Loading";
import Pagination from "../../components/Models/Pagination";
import "../../styles/index.css";

export default function Reminders() {

  // useState
  const [confirm, setConfirm] = useState(false);
  const [refreshPage, setRefreshPage] = useState(1);
  const [reminders, setReminders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(null);
  const [boxMessage, setBoxMessage] = useState("");
  const [boxImage, setBoxImage] = useState("");
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState(false);
  const [remindertitle, setReminderTitle] = useState("");
  const [reminderContent, setReminderContent] = useState("");
  const [unautherized, setUnauthrized] = useState(false);

  // useNavigate
  const nav = useNavigate();

  // Cookies
  const cookie = new Cookies();
  const token = cookie.get("userAccessToken");

  // Functions
  const handleNextPage = () => {
    if (currentPage < lastPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Mapping
  const showReminders = reminders.map((reminder, index) =>
    <tr onClick={() => nav(`/tip?tip_id=${reminder.id}`)} key={index} className="border-2 border-[#AEAEAE] cursor-pointer">
      <td className="text-center p-[10px] text-[12px] md:text-[16px]">
        {(reminder.created_at).slice(0, 10)}
      </td>
      <td dir="rtl" className="text-[14px] md:text-[18px] text-end p-[10px] py-[20px] md:pl-[50px] font-bold">
        <p className="text-right">{reminder.content}</p>
      </td>
      <td className="text-[14px] md:text-[18px] text-end p-[10px] py-[20px] md:pl-[50px] font-bold">
        {reminder.title}
      </td>
    </tr>
  )

  // useEffect
  useEffect(() => {
    axios.get(`${BASE_URL}/notifications?page=${currentPage}&perPage=10`,{
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((data) => {
      setLastPage(data.data.meta.last_page);
      setReminders(data.data.data);
      setReminderTitle("");
      setReminderContent("");
    })
    .catch((err) => {
      console.log(err);
      setBoxMessage("عذرا حدث خطأ ما");
      setBoxImage(failureImage);
      setConfirm(false);
      setIsBoxOpen(true);
      if(err.response && err.response.status === 401) {
        setUnauthrized(true);
      }
    });
  }, [currentPage, refreshPage])

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

  // Communicating With Backend
  async function addReminder() {
    setIsLoading(true);
    try{
      await axios.post(`${BASE_URL}/notifications`,
      {
        title: remindertitle,
        content: reminderContent,
      },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
      setBoxMessage("تم إرسال الإشعار بنجاح");
      setBoxImage(successImage);
      setConfirm(false);
      setRefreshPage(refreshPage + 1);
    } catch(err) {
      setBoxMessage("عذرا حدث خطأ ما");
      setBoxImage(failureImage);
      setConfirm(false);
      if(err.response && err.response.status === 401) {
        setUnauthrized(true);
      }
    } finally {
      setIsLoading(false);
      setIsBoxOpen(true);
    }
  }

  return (
    <div className="text-base md:text-xl">
      <Header disabled="true" />
      {/* صندوق مدخل إلى التذكيرات */}
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
        <button className={`hover:bg-gray-300
        rounded-md
        duration-300
        px-[10px]
        py-[3px]
        relative ${
          list
            ? "bg-gray-300"
            : ""
        }`}
        onClick={() => setList(!list)}
        >
          ...فرز حسب
          <i className="fa-solid fa-chevron-down ml-[10px] text-sm text-[#7F7F7F]"/>
          {list &&
          <ul className="bg-white absolute left-0 w-full top-[34px]">
            <li onClick={() => nav(`/tips`)} className="p-2 border-b-2 rounded-md hover:bg-gray-300 duration-300">النصائح</li>
            <li className="p-2 rounded-md bg-gray-300">التذكيرات</li>
          </ul>
          }
        </button>
        <div className="ml-[20px] md:ml-[30px]">
          <span className="font-semibold mr-[10px] font-extrabold">التذكيرات</span>
        </div>
      </div>
      {/* صندوق محتوى الصفحة والجدول */}
      <div 
      className="mt-[15px] container m-auto px-[10px] md:px-[25px] overflow-x-auto">
        <table className="w-full mb-[20px]">
          <thead>
            <tr className="text-[#535763]">
              {/* <th className="w-1/8 pb-[15px]">حذف</th> */}
              <th className="w-1/3 pb-[15px]">التاريخ</th>
              <th className="w-1/3 pb-[15px] text-end">التذكير</th>
              <th className="w-1/3 pb-[15px] text-end">العنوان</th>
            </tr>
          </thead>
          <tbody>
            {showReminders}
          </tbody>
        </table>
      </div>
      {confirm &&
      <div
        className="insert-box
        px-[15px]
        inset-0
        bg-black
        bg-opacity-25
        flex
        items-center
        justify-center
        fixed
        z-50
        px-[25px]"
        >
      </div>
      }
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        lastPage={lastPage}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
      />
      {/* Add Reminder Box */}
      <div dir="rtl" style={{boxShadow: "0 4px 10px 0px grey"}}
      className="container m-auto my-[25px] relative rounded-2xl">
        <input
        placeholder="عنوان التذكير"
        className="w-full rounded-t-2xl border-b-[3px] outline-none p-[10px] pr-[25px] text-right"
        value={remindertitle}
        onChange={(e) => setReminderTitle(e.target.value)}
        />
        <textarea
        className="w-full
        bg-white
        rounded-b-2xl
        text-right
        p-[25px]
        outline-none
        resize-none
        pl-[70px]
        scrollbar
        scrollbar-thin
        scrollbar-thumb-red-400
        scrollbar-track-red-200"
        placeholder="موضوع التذكير"
        value={reminderContent}
        onChange={(e) => setReminderContent(e.target.value)}
        />
        <i
        onClick={addReminder}
        className="ri-send-plane-2-fill
          inline-block rotate-180
          bg-green-700
          px-[12px]
          py-[8px]
          rounded-xl
          text-white
          text-[14px]
          absolute
          left-[30px]
          bottom-[20px]
          cursor-pointer
          " />
      </div>
      {/* Models */}
      {isBoxOpen && <Model message={boxMessage} imageSrc={boxImage}/>}
      {isLoading && <Loading />}
    </div>
  );
}