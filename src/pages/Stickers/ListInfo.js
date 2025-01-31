import { useEffect, useRef, useState } from "react";
import Button from "../../components/Button/Button";
import Header from "../../components/Header/Header";
import { useLocation } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../config";

export default function ListInfo() {
  const [listName, setListName] = useState('');
  const [listInfo, setListInfo] = useState(null);
  const [refreshPage, setRefreshPage] = useState(0);
  const [addStickerModel, setAddStickerModel] = useState(false);
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);

    const inputImageRef = useRef(null);

  // Mapping
  const imagesShow = images.map((img, key) => (
    <img
      className="absolute right-0 top-0 rounded-[15px] h-full w-full z-10"
      src={URL.createObjectURL(img)}
      alt="Test"
    />
  ));

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

  async function addSticker() {
    const formData = new FormData();
    formData.append("category_id", listId)
    images.forEach((img) => {
      formData.append("sticker", img);
    });
    try {
  const res = await axios.post(`${BASE_URL}/stickers`, formData,{
    headers: {
      Accept: "application/json",
    },
    });
    if(res.status === 201) {
      handleStickerModel();
      setRefreshPage((prev) => prev + 1);
    }
  } catch (error) {
    console.log(error);
  }
  }

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const listId = params.get('listinfo_id');

  useEffect(() => {
    axios
      .get(`${BASE_URL}/categories/${listId}`, {
        headers: {
          Accept: "application/json",
        },
      })
      .then((data) => {setListInfo(data.data.data); setListName(data.data.data.name);})
      .catch((err) => console.log(err));
  }, [refreshPage]);

  return(
    <>
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
        <Button
          onClick={handleStickerModel}
          className="hover:bg-gray-300
            rounded-md
            duration-300
            px-[10px]
            py-[3px]"
          label="إضافة ملصق"
          icon="true"
        />
        <div className="ml-[20px] md:ml-[50px]">
          <span className="font-semibold mr-[10px]">{listName}</span>
          <i className="fa-solid fa-note-sticky"></i>
        </div>
      </div>
      <div className="stickers-container container">
      {
        listInfo && listInfo.stickers ? (
          listInfo.stickers.map((sticker, index) => (
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
                    اختر الصورة{" "}
                  </p>
                </div>
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
    </>
  );
}