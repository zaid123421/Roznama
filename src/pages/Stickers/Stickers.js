import { useEffect, useRef, useState } from "react";
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import axios from "axios";
import "./Sticker.css";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../config";
import Cookies from "universal-cookie";
import successImage from '../../assets/success.gif';
import failureImage from '../../assets/failure.png'
import Model from "../../components/Models/Model";
import Loading from "../../components/Models/Loading";

export default function Stickers() {
  // useState
  const [listModel, setListModel] = useState(false);
  const [direction, setDirection] = useState("rtl");
  const [name, setName] = useState("");
  const [refreshPage, setRefreshPage] = useState(0);
  const [lists, setLists] = useState([]);
  const [addStickerModel, setAddStickerModel] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [listName, setListName] = useState("");
  const [images, setImages] = useState([]);
  const [categoryId, setCategoryId] = useState(0);
  const [editListModel, setEditListModel] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [listId, setListId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(null);
  const [boxMessage, setBoxMessage] = useState("");
  const [boxImage, setBoxImage] = useState("");
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // useRef
  const inputImageRef = useRef(null);

  // useNavigate
  const nav = useNavigate();

  // Cookies
  const cookie = new Cookies();
  const token = cookie.get("userAccessToken");

  // Functions
  const handleTextDirection = (e) => {
    const value = e.target.value;
    if (/[\u0600-\u06FF]/.test(value)) {
      setDirection("rtl");
    } else {
      setDirection("ltr");
    }
  };

  const handleBlur = () => {
    setDirection("rtl");
  };

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
      setImages([...images, ...e.dataTransfer.files]);
      e.dataTransfer.clearData();
    }
  };

  function handleListModel() {
    setListModel(!listModel);
    setName("");
  }

  function handleStickerModel(name) {
    setAddStickerModel(!addStickerModel);
    setListName(name);
    setImages([]);
  }

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

  function handleEditListModel() {
    setName("");
    setEditListModel(!editListModel);
  }

  // Mapping
  const imagesShow = images.map((img, key) => (
    <img
      key={key}
      className="w-[75px] h-[75px] sm:w-[150px] sm:h-[150px]"
      src={URL.createObjectURL(img)}
      alt="Test"
    />
  ));

  const showLists = lists.map((list, index) => (
    <div key={index}
      onClick={() => nav(`/listinfo?listinfo_id=${list.id}&listName=${list.name}`)}
      className="list-box cursor-pointer grid grid-cols-2 relative bg-gradient-to-t"
      style={{
        background: "linear-gradient(to bottom, rgba(10,0,37,0.5), rgba(32,32,32,0.2))"
      }}
    >
      <span className="text-white font-black absolute z-50 top-[25px] right-[20px]">
        {list.name}
      </span>
        <div className="relative z-[-1] bg-contain max-w-full max-h-1/2">
          {
            list.stickers.length > 0 ? <img alt="picture1" className="w-full h-full" src={list.stickers[0].url}/> : ""
          }
        </div>
        <div className="relative z-[-1] bg-contain max-w-full max-h-1/2">
          {
            list.stickers.length > 1 ? <img alt="picture2" className="w-full h-full" src={list.stickers[1].url}/> : ""
          }
        </div>
        <div className="relative z-[-1] bg-contain max-w-full max-h-1/2">
          {
            list.stickers.length > 2 ? <img alt="picture3" className="w-full h-full" src={list.stickers[2].url}/> : ""
          }
        </div>
        <div className="relative z-[-1] bg-cover max-w-full max-h-1/2">
          {
            list.stickers.length > 3 ? <img alt="picture4" className="w-full h-full" src={list.stickers[3].url}/> : ""
          }
        </div>
      <div className="w-full absolute bottom-0 left-0 flex flex-row-reverse items-center px-[15px] pb-[15px] justify-between">
        <Button
          className="
        bg-[#3FAB21]
        px-[10px]
        py-[5px]
        md:px-[17px]
        md:py-[12px]
        text-white
        rounded-[15px]
        hover:bg-green-600
        hover:border-green-600
        duration-300
        border-2
        border-[#3FAB21]
        cursor-pointer
        flex
        items-center
        justify-center
        flex-row-reverse"
          label="إضافة ملصق"
          onClick={(e) => {
            handleStickerModel(list.name);
            setCategoryId(list.id);
            e.stopPropagation();
          }}
          icon="true"
        />
        <div>
          <i
            onClick={(e) => {
              setCategoryId(list.id);
              handleEditListModel();
              setName(list.name)
              e.stopPropagation();
            }}
            className="fa-solid
            fa-wand-magic
            bg-[#F1F1F1]
            w-[30px]
            h-[30px]
            md:w-[40px]
            md:h-[40px]
            inline-flex
            justify-center
            items-center
            rounded-md
            cursor-pointer
            text-[#535763]
            duration-300
            hover:bg-slate-200"
          />
          <i
            onClick={(e) => { 
              e.stopPropagation();
              setConfirm(true);
              setListId(list.id);
              setListName(list.name);
            }}
            className="fa-solid
            fa-trash
            w-[30px]
            h-[30px]
            md:w-[40px]
            md:h-[40px]
            inline-flex
            justify-center
            items-center
            bg-[#F1F1F1]
            mr-[10px]
            rounded-md
            cursor-pointer
            text-[#BF305E]
            duration-300 
            hover:bg-slate-200"
          />
        </div>
      </div>
    </div>
  ));

  // useEffect
  useEffect(() => {
    if (listModel || editListModel || addStickerModel || confirm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [listModel, editListModel, addStickerModel, confirm]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/categories?page=${currentPage}&perPage=9`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((data) => {
        setLists(data.data.data);
        setLastPage(data.data.meta.last_page);
      })
      .catch((err) => console.log(err));
  }, [currentPage, refreshPage]);

  useEffect(() => {
    if (isBoxOpen) {
      const timer = setTimeout(() => {
        setIsBoxOpen(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isBoxOpen]);

  // Communicating With Backend
  async function Submit() {
    setIsLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/categories`,
        {
          name: name,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBoxMessage("تم إضافة قائمة الملصقات بنجاح");
      setBoxImage(successImage);
      handleListModel();
      setRefreshPage((prev) => prev + 1);
    } catch {
      setBoxMessage("عذرا حدث خطأ ما");
      setBoxImage(failureImage);
      handleListModel();
    } finally {
      setIsLoading(false);
      setIsBoxOpen(true);
    }
  }

  async function Edit() {
    setIsLoading(true);
    try {
      await axios.put(
        `${BASE_URL}/categories/${categoryId}`,
        {
          name: name,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBoxMessage("تم تعديل قائمة الملصقات بنجاح");
      setBoxImage(successImage);
      handleEditListModel();
      setRefreshPage((prev) => prev + 1);
    } catch {
      setBoxMessage("عذرا حدث خطأ ما");
      setBoxImage(failureImage);
      handleEditListModel();
    } finally {
      setIsLoading(false);
      setIsBoxOpen(true);
    }
  }

  async function handleDeleteList(id) {
    setIsLoading(true);
    try {
      await axios.delete(
        `${BASE_URL}/categories/${id}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBoxMessage("تم حذف قائمة الملصقات بنجاح");
      setBoxImage(successImage);
      setConfirm(false);
      setRefreshPage((prev) => prev + 1);
    } catch {
      setBoxMessage("عذرا حدث خطأ ما");
      setBoxImage(failureImage);
      setConfirm(false);
    } finally {
      setIsLoading(false);
      setIsBoxOpen(true);
    }
  }

  async function addSticker() {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("category_id", categoryId)
    images.forEach((img) => {
      formData.append("stickers[]", img);
    });
    try {
    await axios.post(`${BASE_URL}/stickers`, formData,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setBoxMessage("تم إضافة الملصقات للقائمة بنجاح");
      setBoxImage(successImage);
      handleStickerModel();
      setRefreshPage((prev) => prev + 1);
    } catch {
      setBoxMessage("عذرا حدث خطأ ما");
      setBoxImage(failureImage);
      handleStickerModel();
    } finally {
      setIsLoading(false);
      setIsBoxOpen(true);
    }
  }

  return (
    <div className="text-base md:text-xl">
      <Header disabled="true" />
      {/* صندوق مدخل إلى الملصقات */}
      <div
        className="introduction-box
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
          onClick={handleListModel}
          className="hover:bg-gray-300
            rounded-md
            duration-300
            px-[10px]
            py-[3px]"
          label="إنشاء قائمة"
          icon="true"
        />
        <div className="ml-[20px]">
          <span className="font-semibold mr-[10px]">الملصقات</span>
          <i className="fa-solid fa-note-sticky"></i>
        </div>
      </div>
      {listModel && (
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
            className="bg-white text-base w-full flex flex-col p-[20px] md:w-[500px] md:text-xl rounded"
          >
            <p className="flex justify-end font-bold border-b-[1px] pb-[15px] mb-[15px] border-black">
              إضافة قائمة ملصقات
            </p>
            <div className="flex flex-col ">
              <span className="flex justify-end mb-[15px]">اسم القائمة</span>
              <input
                autoFocus
                className={`border-[2px] border-[#AEAEAE] focus:border-[#61A3FF] focus:outline-none rounded-lg p-[10px]  ${
                  direction === "rtl" ? "text-right" : "text-left"
                }`}
                style={{ direction }}
                name="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  handleTextDirection(e);
                }}
                onBlur={handleBlur}
              />
            </div>
            <div className="flex justify-between mt-[15px]">
              <Button
              className={`w-[100px] h-[40px] md:w-[282px] md:h-[65px] rounded-[10px] 
                border-2 duration-300 
                ${
                  name.length > 4
                    ? "bg-green-600 text-white hover:text-black hover:bg-transparent border-green-600"
                    : "bg-gray-400 text-white cursor-not-allowed border-gray-400"
                }`}
              label="إضافة"
              onClick={() => {
                if (name.length > 4) {
                  Submit();
                }
              }}
              icon="true"
              disabled={name.length <= 4}
              />
              <Button
                onClick={handleListModel}
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
      {lists.length === 0 ? (
        <div className="text-center absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] min-w-[250px] max-w-[450px]">
          <i className="fa-solid fa-inbox text-gray-500 text-[40px] mb-[10px] sm:text-[50px]"></i>
          <p>
            لا يوجد قوائم ملصقات بعد, اضغط على "إنشاء قائمة" لإنشاء قائمة ملصقات
          </p>
        </div>
      ) : (
        <div className="lists-container container m-auto px-[10px] md:px-[25px] my-[25px]">
          {showLists}
        </div>
      )}
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
      {editListModel && (
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
            className="bg-white text-base w-full flex flex-col p-[20px] md:w-[500px] md:text-xl rounded"
          >
            <p className="flex justify-end font-bold border-b-[1px] pb-[15px] mb-[15px] border-black">
              تعديل قائمة الملصقات
            </p>
            <div className="flex flex-col ">
              <span className="flex justify-end mb-[15px]">اسم القائمة</span>
              <input
                autoFocus
                className={`border-[2px] border-[#AEAEAE] focus:border-[#61A3FF] focus:outline-none rounded-lg p-[10px]  ${
                  direction === "rtl" ? "text-right" : "text-left"
                }`}
                style={{ direction }}
                name="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  handleTextDirection(e);
                }}
                onBlur={handleBlur}
              />
            </div>
            <div className="flex justify-between mt-[15px]">
              <Button
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
                label="تعديل"
                onClick={Edit}
              />
              <Button
                onClick={handleEditListModel}
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
            <p className="text-right">هل تود حقاً حذف <span className="font-bold">{listName}</span> مع الملصقات الخاصة بالقائمة ؟</p>
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
                onClick={() => handleDeleteList(listId)}
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
