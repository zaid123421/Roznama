import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import axios from "axios";
import BASE_URL from "../../config";
import Cookies from "universal-cookie";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import successImage from '../../assets/success.gif';
import failureImage from '../../assets/failure.png'
import Model from "../../components/Models/Model";
import Loading from "../../components/Models/Loading";
import Pagination from "../../components/Models/Pagination";

export default function Tips() {
  // useState
  const [confirm, setConfirm] = useState(false);
  const [adviceId, setAdviceId] = useState(null);
  const [refreshPage, setRefreshPage] = useState(1);
  const [advices, setAdvices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(null);
  const [boxMessage, setBoxMessage] = useState("");
  const [boxImage, setBoxImage] = useState("");
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState(false);
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
  const showAdvices = advices.map((advice, index) =>
    <tr onClick={() => nav(`/tip?tip_id=${advice.id}`)} key={index} className="border-2 border-[#AEAEAE] cursor-pointer">
      <td className="text-center px-[5px]">
      <i onClick={(e) => {setAdviceId(advice.id); setConfirm(true); e.stopPropagation()}} className="fa-solid
          fa-trash
          w-[30px]
          h-[30px]
          md:w-[40px]
          md:h-[40px]
          inline-flex
          justify-center
          items-center
          bg-[#dbdbdb]
          mr-[10px]
          rounded-md
          cursor-pointer
          text-[#BF305E]
          duration-300
          hover:bg-slate-200"
        />
      </td>
      <td className="text-center p-[10px] text-[12px] md:text-[16px]">
        {(advice.created_at).slice(0, 10)}
      </td>
      <td className="text-[14px] md:text-[18px] text-end  p-[10px] py-[20px] md:pl-[50px] font-bold">
        <p dir="rtl" className="text-right">
          {advice.content.length < 50 ? advice.content : "..." + advice.content.slice(0, 50)}
        </p>
      </td>
    </tr>
  )

  // useEffect
  useEffect(() => {
    axios.get(`${BASE_URL}/advice?page=${currentPage}&perPage=10`,{
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((data) => {
      setAdvices(data.data.data);
      setLastPage(data.data.meta.last_page);
    })
    .catch((err) => {
      setBoxMessage("عذرا حدث خطأ ما");
      setBoxImage(failureImage);
      setConfirm(false);
      setIsBoxOpen(true);
      if(err.response && err.response.status === 401) {
        setUnauthrized(true);
      }
    })
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
  async function handleDeleteTip(id) {
    setIsLoading(true);
    try{
      await axios.delete(`${BASE_URL}/advice/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setBoxMessage("تم حذف النصيحة بنجاح");
      setBoxImage(successImage);
      setConfirm(false);
      setRefreshPage(refreshPage + 1);
    } catch (err) {
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
      {/* صندوق مدخل إلى النصائح */}
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
            <li className="p-2 border-b-2 rounded-md bg-gray-300">النصائح</li>
            <li onClick={() => nav(`/reminders`)} className="p-2 rounded-md hover:bg-gray-300 duration-300">التذكيرات</li>
          </ul>
          }
        </button>
        <div className="ml-[20px] md:ml-[30px]">
          <span className="font-semibold mr-[10px] font-extrabold">النصائح</span>
        </div>
      </div>
      {/* صندوق محتوى الصفحة والجدول */}
      <div className="mt-[15px] container m-auto px-[10px] md:px-[25px] overflow-x-auto">
        <table className="w-full mb-[20px]">
          <thead>
            <tr className="text-[#535763]">
              <th className="w-1/8 pb-[15px]">حذف</th>
              <th className="w-1/8 pb-[15px]">التاريخ</th>
              <th className="w-3/4 pb-[15px] text-end">النصيحة</th>
            </tr>
          </thead>
          <tbody>
            {showAdvices}
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
          <div
            style={{ boxShadow: "0px 15px 20px 5px rgba(0, 0, 0, 0.25)" }}
            className="bg-white text-base w-full flex flex-col p-[20px] md:w-[800px] md:text-xl rounded"
          >
            <p className="text-right">هل تريد بالتأكيد حذف النصيحة ؟</p>
            <div className="flex justify-between mt-[50px]">
              <Button className="bg-green-600
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
                label="حذف"
                onClick={() => handleDeleteTip(adviceId)}
                />
              <Button onClick={() => setConfirm(false)}
                className="hover:bg-gray-300
              rounded-[10px]
              duration-300
              px-[30px]
              py-[3px]"
              label= "رجوع"
              />
            </div>
          </div>
      </div>
      }
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        lastPage={lastPage}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
      />
      {/* Models */}
      {isBoxOpen && <Model message={boxMessage} imageSrc={boxImage}/>}
      {isLoading && <Loading />}
    </div>
  );
}