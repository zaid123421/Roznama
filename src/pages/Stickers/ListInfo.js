import { useEffect, useRef, useState } from "react";
import Button from "../../components/Button/Button";
import Header from "../../components/Header/Header";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../config";
import Cookies from "universal-cookie";
import successImage from '../../assets/success.gif';
import failureImage from '../../assets/failure.png'
import Model from "../../components/Models/Model";
import Loading from "../../components/Models/Loading";

export default function ListInfo() {
  // useState
  const [listImages, setListImages] = useState([]);
  const [refreshPage, setRefreshPage] = useState(0);
  const [addStickerModel, setAddStickerModel] = useState(false);
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(null);
  const [boxMessage, setBoxMessage] = useState("");
  const [boxImage, setBoxImage] = useState("");
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unautherized, setUnauthrized] = useState(false);


  // useNavigate
  const nav = useNavigate();

  // useRef
  const inputImageRef = useRef(null);

  // Cookies
  const cookie = new Cookies();
  const token = cookie.get("userAccessToken");

  // useLocation
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const listId = params.get('listinfo_id');
  const listName = params.get('listName');
  
  // Functions
  function handleStickerModel(name) {
    setAddStickerModel(!addStickerModel);
    setImages([]);
  }

  const handleImageClick = () => {
    if (inputImageRef.current) {
      inputImageRef.current.click();
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setImages([...images, ...e.dataTransfer.files]); // تحديث الملفات
      e.dataTransfer.clearData();
    }
  };

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
  const imagesShow = images.map((img, key) => (
    <img
      key={key}
      className="w-[75px] h-[75px] sm:w-[150px] sm:h-[150px]"
      src={URL.createObjectURL(img)}
      alt="Test"
    />
  ));

  // useEffect
  useEffect(() => {
    if (addStickerModel) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [addStickerModel]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/stickers/?page=${currentPage}&perPage=10`, {
        headers: {
          Accept: "application/json",
        },
      })
      .then((data) => {
        setListImages(data.data.data);
        setLastPage(data.data.meta.last_page);
      })
      .catch((err) => console.log(err));
  }, [currentPage, refreshPage]);

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
  async function addSticker() {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("category_id", listId)
    images.forEach((img) => {
      formData.append("stickers[]", img);
    });
    try {
      await axios.post(`${BASE_URL}/stickers`, formData,{
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      }});
      setBoxMessage("تم إضافة الملصق بنجاح");
      setBoxImage(successImage);
      handleStickerModel();
      setRefreshPage((prev) => prev + 1);
    } catch (err){
      setBoxMessage("عذرا حدث خطأ ما");
      setBoxImage(failureImage);
      handleStickerModel();
      if(err.response && err.response.status === 401) {
        setUnauthrized(true);
      }
    } finally {
      setIsLoading(false);
      setIsBoxOpen(true);
    }
  }

  return(
    <div className="text-base md:text-xl">
      <Header disabled="true"/>
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
        <Button
          onClick={handleStickerModel}
          className="
          flex
          items-center
            hover:bg-gray-300
            rounded-md
            duration-300
            px-[10px]
            py-[3px]"
          label="إضافة ملصق"
          icon="true"
        />
        <div className="ml-[20px] flex items-center">
          <span className="font-semibold mr-[10px]">{listName}</span>
          <i className="fa-solid fa-note-sticky"></i>
        </div>
        <button
        onClick={() => nav('/stickers')}
          className="ml-[25px]
          hover:bg-gray-300
          rounded-[10px]
          duration-300
          px-[10px]
          py-[5px]">
          رجوع
          <i className="fa-solid fa-chevron-right hidden md:inline md:text-[15px] ml-[5px] md:ml-[10px]"></i>
        </button>
      </div>
      <div className="stickers-container container">
      {
        listImages ? (
          listImages.map((sticker, index) => (
            <div key={index}>
              <img className="w-full h-full" src={sticker.url} alt={`sticker-${index}`} />
            </div>
          ))
        ) : null
      }
      </div>
      {addStickerModel && (
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
            style={{ boxShadow: "0px 15px 20px 5px rgba(0, 0, 0, 0)" }}
            className="bg-white text-base w-full flex flex-col p-[20px] md:w-[500px] md:text-xl rounded"
          >
            <p className="flex justify-end pb-[10px] font-bold border-b-[1px] border-black mb-[15px]">
              <span>{listName}</span>
              <span className="ml-[5px]">أضف ملصق لقائمة</span>
            </p>
            {/* <div className="flex flex-col items-end grow my-[15px] grow">
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onClick={handleImageClick}
                onDrop={handleDrop}
                className="grow relative flex items-center justify-center my-[10px] bg-transparent w-full md:w-[375px] h-[175px] md:h-[225px] border-2 border-dashed border-[#AEAEAE] rounded-[15px] self-center cursor-pointer"
              >
                <input
                  ref={inputImageRef}
                  hidden
                  type="file"
                  onChange={(e) => setImages([...e.target.files])}
                  multiple
                />
                <div className="flex flex-col items-center">
                  <i className="fa-solid fa-image text-[#7F7F7F] text-[30px] md:text-[60px] mb-[10px]"></i>
                  <p className="text-[12px] md:text-[14px]">
                    <span className="hidden md:inline-block">
                      أو اسحبها هنا
                    </span>{" "}
                    اختر الصورة{" "}
                  </p>
                </div>
                {imagesShow}
              </div>
            </div> */}
            <div className="flex flex-col items-end grow my-[15px] grow">
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onClick={handleImageClick}
                onDrop={handleDrop}
                className="grow relative flex items-center justify-center my-[10px] bg-transparent w-full md:w-[375px] h-[175px] md:h-[225px] border-2 border-dashed border-[#AEAEAE] rounded-[15px] self-center cursor-pointer"
              >
                <input
                  ref={inputImageRef}
                  hidden
                  type="file"
                  onChange={(e) => setImages([...e.target.files])}
                  multiple
                />
                <div className="flex flex-col items-center">
                  <i className="fa-solid fa-image text-[#7F7F7F] text-[30px] md:text-[60px] mb-[10px]"></i>
                  <p className="text-[12px] md:text-[14px]">
                    <span className="hidden md:inline-block">
                      أو اسحبها هنا
                    </span>{" "}
                    اختر الصور{" "}
                  </p>
                </div>
              </div>
              <div className="max-h-[200px] overflow-auto w-full grid grid-cols-3 gap-1.5 justify-between">
                {imagesShow}
              </div>
            </div>
            <div className="flex justify-between mt-[15px]">
              <Button
                className="bg-green-600
                  text-white
                  w-[100px]
                  h-[40px]
                  rounded-[10px]
                  hover:text-black
                  hover:bg-transparent
                  hover:border-green-600
                  duration-300
                  border-2
                  border-green-600"
                label="إضافة"
                onClick={addSticker}
                icon="true"
              />
              <Button
                onClick={handleStickerModel}
                className="hover:bg-gray-300
              rounded-[10px]
              duration-300
              px-[30px]
              py-[3px]"
                label="رجوع"
              />
            </div>
          </div>
        </div>
      )}
      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-4 mb-[15px]">
        <Button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-2xl duration-300 bg-gray-300 ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-400"
          }`}
          label="السابق"
        />
        <span className="text-lg font-bold">
          {currentPage} / {lastPage}
        </span>
        <Button
          onClick={handleNextPage}
          disabled={currentPage === lastPage}
          className={`px-4 py-2 rounded-2xl duration-300 bg-gray-300 ${
            currentPage === lastPage
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-400"
          }`}
          label="التالي"
        />
      </div>
      {isBoxOpen && <Model message={boxMessage} imageSrc={boxImage}/>}
      {isLoading && <Loading />}
    </div>
  );
}