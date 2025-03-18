import { useEffect, useRef, useState } from "react";
import Header from "../../components/Header/Header";
import JoditEditor from "jodit-react";
import Button from "../../components/Button/Button";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import BASE_URL from "../../config";
import Cookies from "universal-cookie";
import successImage from '../../assets/success.gif';
import failureImage from '../../assets/failure.png'
import Model from "../../components/Models/Model";
import Loading from "../../components/Models/Loading";

export default function EditBlog() {
  // useState
  const [images, setImages] = useState([]);
  const [imagesUpload, setImagesUpload] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [direction, setDirection] = useState("rtl");
  const [articleInfo, setArticleInfo] = useState([]);
  const [title, setTitle] = useState("");
  const [boxMessage, setBoxMessage] = useState("");
  const [boxImage, setBoxImage] = useState("");
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);


  // useRef
  const inputImageRef = useRef(null);
  const contentRef = useRef("");

  // useNavigate
  const nav = useNavigate();

  // useLocation
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const doorId = params.get('article_id');
  const doorName = params.get('door');

  // Cookies
  const cookie = new Cookies();
  const token = cookie.get("userAccessToken");

  // Functions
  const handleEditorChange = (newContent) => {
    contentRef.current = newContent;
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
      setImagesUpload([...images, ...e.dataTransfer.files]);
      e.dataTransfer.clearData();
    }
  };

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

  // Configration
  const config = {
    toolbar: [
      ["bold", "italic", "underline", "strikethrough"],
      ["fontSize", "alignment", "unorderedList", "orderedList", "size"],
    ],
    showCharsCounter: true,
    showWordsCounter: true,
    removeButtons: ['hr', "selectall", "paragraph"],
    disablePlugins: ["Speech Recognize", "image", "file", "video", "table", "link", "print", "line", "color"],
  };

  // Mapping
  const imagesShow = images.length > 0
  ? images.map((img, key) => (
      <img
        key={key}
        className="absolute right-0 top-0 rounded-[15px] h-full w-full z-10"
        src={img.url}
        alt="Test"
      />
    ))
  : null;

  const newImage = imagesUpload.map((img, key) => (
    <img
      key={key}
      className="absolute right-0 top-0 rounded-[15px] h-full w-full z-10"
      src={URL.createObjectURL(img)}
      alt="Test"
    />
  ));

  // useEffect
  useEffect(() => {
    axios.get(`${BASE_URL}/blogs/${doorId}`)
    .then((data) => {
      setArticleInfo(data.data.data);
      setTitle(data.data.data.title);
      contentRef.current = data.data.data.html_free_content;
      if (data.data.data.images && data.data.data.images.length > 0) {
        setImages(data.data.data.images);
      }
    })
    .catch((error) => console.log(error))
  }, [doorId])

  useEffect(() => {
    if (isBoxOpen) {
      const timer = setTimeout(() => {
        setIsBoxOpen(false);
        if(success) {
          nav(`/door?section_id=${articleInfo.section_id}&door_name=${doorName}`)
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isBoxOpen]);

  // Communicatin With Backend
  async function Submit() {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", contentRef.current);
    formData.append("section_id", articleInfo.section_id);
    if(imagesUpload.length !== 0) {
      imagesUpload.forEach((img) => {
        formData.append("images[]", img);
      });
    }
    try {
      await axios.post(`${BASE_URL}/blogs/${Number(doorId)}`, formData,{
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    setBoxMessage("تم تعديل المقال بنجاح");
    setBoxImage(successImage);
    setSuccess(true);
    } catch {
      setBoxMessage("عذرا حدث خطأ ما");
      setBoxImage(failureImage);
    } finally {
      setIsLoading(false);
      setIsBoxOpen(true);
    }
  }

  return (
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
        border-b-2
        border-b-solid
        border-b-black
        py-[15px]"
      >
        <div className="flex flex-row-reverse items-center">
        <button onClick={()=> nav(`/door?section_id=${articleInfo.section_id}&door_name=${doorName}`)}
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
          <div className="flex items-center">
            <p className="font-semibold mr-[10px] text-right">تعديل مقال <span className="font-bold">{articleInfo.title}</span></p>
            <i className="fa-solid fa-door-open"></i>
          </div>
        </div>
      </div>
      <div className="container m-auto px-[10px] md:px-[25px] flex flex-col flex-col-reverse lg:flex-row my-[15px]">
        <div className="flex flex-col items-end grow overflow-auto">
          <span className="mb-3">محتوى المقال</span>
          <div className="w-full">
            <JoditEditor
              config={config}
              value={contentRef.current}
              onChange={handleEditorChange}
              />
          </div>
        </div>
        <div className="md:ml-[25px] flex flex-col">
          <div className="flex flex-col items-end">
            <span>عنوان المقال</span>
            <div className="flex items-center my-[10px] bg-[#F1F1F1] w-full border-[#AEAEAE] rounded-[15px]">
              <input
                style={{ direction }}
                onBlur={handleBlur}
                name="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  handleTextDirection(e);
                }}
                className="w-full bg-transparent focus:outline-none focus:border-[#61A3FF] border-[2px] rounded-[15px] py-[10px] px-[20px] border-[#AEAEAE]"
              />
            </div>
          </div>
            <div className="flex flex-col items-end grow my-[15px] grow">
              <span>(اختياري) اختر صورة المقال</span>
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onClick={handleImageClick}
                onDrop={handleDrop}
                className="grow relative flex items-center justify-center my-[10px] bg-[#F1F1F1] w-full md:w-[375px] h-[175px] md:h-[225px] border-2 border-dashed border-[#AEAEAE] rounded-[15px] self-center cursor-pointer"
              >
                <input
                  ref={inputImageRef}
                  hidden
                  type="file"
                  onChange={(e) => {setImagesUpload([...e.target.files]); setImages([])}}
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
                {imagesUpload.length !== 0 ? newImage : imagesShow}
              </div>
            </div>
        </div>
      </div>
      <div className="container m-auto px-[10px] md:px-[25px] flex items-start mb-[20px]">
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
            onClick={Submit}
            label= "تعديل"
        />
      </div>
      {isBoxOpen && <Model message={boxMessage} imageSrc={boxImage}/>}
      {isLoading && <Loading />}
    </div>
  );
}
