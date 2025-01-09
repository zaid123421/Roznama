import { useEffect, useRef, useState } from "react";
import Header from "../../components/Header/Header";
import "./Articles.css";
import axios from "axios";
import BASE_URL from "../../config";

export default function Articles() {
  // useState
  const [doorModelState, setDoorModelState] = useState(false);
  const [editDoorModelState, setEditDoorModelState] = useState(false);
  const [articleModelState, setArticleModelState] = useState(false);
  const [direction, setDirection] = useState("rtl");
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [sections, setSections] = useState([]);
  const [refreshPage, setRefreshPage] = useState(1);

  const [name, setName] = useState("");
  const [about, setAbout] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [sectionId, setSectionId] = useState(0);

  // useEffect
  useEffect(() => {
    if (doorModelState || articleModelState) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [doorModelState, articleModelState]);

  useEffect(() => {
    axios
      .get("http://199.192.19.220:8080/api/v1/sections", {
        headers: {
          Accept: "application/json",
        },
      })
      .then((data) => setSections(data.data.data))
      .catch((err) => console.log(err));
  }, [refreshPage]);

  // Show Blogs
  const showBlogs = sections.map((section, index) => (
    <div className="door-box cursor-pointer flex flex-col justify-between">
      <div>
        <span className="font-bold">{section.name}</span>
        <p className="my-[10px] text-justify font-medium p-[20px] rounded-[15px] bg-[#C5C5C5] h-fit">
          {section.about}
        </p>
      </div>
      <div className="flex justify-between mt-[15px]">
        <div>
          <i
            onClick={() => {
              setSectionId(section.id);
              handleEditDoorModelState();
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
            onClick={() => handleDeleteDoor(section.id)}
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
        <button
          onClick={() => {
            setSectionId(section.id);
            handleArticleModelState();
          }}
          className="bg-[#3FAB21]
          border-2
          border-[#3FAB21]
          rounded-[10px]
          px-[8px]
          md:px-[12px]
          text-white
          hover:text-black
          hover:bg-transparent
          duration-300"
        >
          <i className="fa-solid fa-plus ml-[10px]" />
          إضافة مقال
        </button>
      </div>
    </div>
  ));

  async function handleDeleteDoor(id) {
    try {
      const res = await axios.delete(`${BASE_URL}/sections/${id}`, {
        headers: {
          Accept: "application/json",
        },
      });
      setRefreshPage(refreshPage + 1);
    } catch {
      console.log("Error");
    }
  }

  async function Submit(e) {
    try {
      const res = await axios.post(`${BASE_URL}/sections`, {
        headers: {
          Accept: "application/json",
        },
        name: name,
        about: about,
      });
      console.log("Yes !");
      setDoorModelState(false);
      setRefreshPage((prev) => prev + 1);
    } catch (error) {
      console.log(error);
    }
  }

  async function addBlog() {
    try {
      const res = await axios.post(`${BASE_URL}/blogs`, {
        headers: {
          Accept: "application/json",
        },
        title: title,
        content: content,
        section_id: sectionId,
      });
      console.log("Yes !");
      setArticleModelState(false);
      setRefreshPage((prev) => prev + 1);
    } catch (error) {
      console.log(error);
    }
  }

  async function Edit() {
    try {
      const res = await axios.put(`${BASE_URL}/sections/${sectionId}`, {
        headers: {
          Accept: "application/json",
        },
        name: name,
        about: about,
      });
      console.log("Yes !");
      setEditDoorModelState(false);
      setRefreshPage((prev) => prev + 1);
    } catch (error) {
      console.log(error);
    }
  }

  // useRef
  const inputImageRef = useRef(null);
  const inputFileRef = useRef(null);

  // Mapping
  const imagesShow = images.map((img, key) => (
    <img
      className="absolute right-0 top-0 rounded-[10px] h-full w-full"
      src={URL.createObjectURL(img)}
      alt="Test"
    />
  ));

  // Handling
  function handleDoorModelState() {
    setDoorModelState(!doorModelState);
    setName("");
    setAbout("");
  }

  function handleEditDoorModelState() {
    setEditDoorModelState(!editDoorModelState);
    setName("");
    setAbout("");
  }

  function handleArticleModelState() {
    setArticleModelState(!articleModelState);
    setImages([]);
    setTitle("");
    setContent("");
  }

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

  const handleImageClick = () => {
    if (inputImageRef.current) {
      inputImageRef.current.click();
    }
  };

  const handleFileClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
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

  return (
    <div className="text-base md:text-xl">
      <Header />
      {/* صندوق المدخل إلى الأبواب وزر إمكانية إضافة الباب */}
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
        <button
          onClick={() => setDoorModelState(true)}
          className="hover:bg-gray-300
          rounded-[10px]
          duration-300
          px-[10px]
          py-[3px]"
        >
          إضافة باب
          <i className="fa-solid fa-plus ml-[10px]" />
        </button>
        <div className="ml-[20px] md:ml-[50px]">
          <span className="font-semibold mr-[10px]">الأبواب</span>
          <i className="fa-solid fa-door-open"></i>
        </div>
      </div>
      {doorModelState && (
        // صندوق إدخال الباب
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
            className="bg-white text-base w-full flex flex-col p-[20px] md:w-[800px] md:text-xl"
          >
            <p className="flex justify-end pb-[10px] font-bold">إضافة باب</p>
            <div className="flex flex-col ">
              <span className="flex justify-end mb-[5px]">اسم الباب</span>
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
            <div className="flex flex-col mt-[15px]">
              <span className="flex justify-end mb-[5px]">شرح عن الباب</span>
              <textarea
                className={`resize-none border-[2px] border-[#AEAEAE] focus:border-[#61A3FF] focus:outline-none rounded-lg p-[10px] min-h-[175px] ${
                  direction === "rtl"
                    ? "text-right"
                    : "text-left focus:border-[#61A3FF]"
                }`}
                name="about"
                style={{ direction }}
                value={about}
                onChange={(e) => {
                  setAbout(e.target.value);
                  handleTextDirection(e);
                }}
                onBlur={handleBlur}
              />
            </div>
            <div className="flex justify-between mt-[15px]">
              <button
                onClick={Submit}
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
              <button
                onClick={handleDoorModelState}
                className="hover:bg-gray-300
              rounded-[10px]
              duration-300
              px-[30px]
              py-[3px]"
              >
                رجوع
              </button>
            </div>
          </div>
        </div>
      )}
      {editDoorModelState && (
        // صندوق إدخال الباب
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
            className="bg-white text-base w-full flex flex-col p-[20px] md:w-[800px] md:text-xl"
          >
            <p className="flex justify-end pb-[10px] font-bold">تعديل الباب</p>
            <div className="flex flex-col ">
              <span className="flex justify-end mb-[5px]">اسم الباب</span>
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
            <div className="flex flex-col mt-[15px]">
              <span className="flex justify-end mb-[5px]">شرح عن الباب</span>
              <textarea
                className={`resize-none border-[2px] border-[#AEAEAE] focus:border-[#61A3FF] focus:outline-none rounded-lg p-[10px] min-h-[175px] ${
                  direction === "rtl"
                    ? "text-right"
                    : "text-left focus:border-[#61A3FF]"
                }`}
                name="about"
                style={{ direction }}
                value={about}
                onChange={(e) => {
                  setAbout(e.target.value);
                  handleTextDirection(e);
                }}
                onBlur={handleBlur}
              />
            </div>
            <div className="flex justify-between mt-[15px]">
              <button
                onClick={Edit}
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
                تعديل
              </button>
              <button
                onClick={handleEditDoorModelState}
                className="hover:bg-gray-300
              rounded-[10px]
              duration-300
              px-[30px]
              py-[3px]"
              >
                رجوع
              </button>
            </div>
          </div>
        </div>
      )}
      {articleModelState && (
        // صندوق إدخال المقال
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
            className="bg-white text-base md:text-xl w-full flex flex-col p-[20px] md:w-[700px] text-right"
          >
            <div className="flex flex-col">
              <span>(اختياري) اختر صورة المقال</span>
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onClick={handleImageClick}
                onDrop={handleDrop}
                className="relative flex items-center justify-center my-[10px] bg-[#F1F1F1] w-full h-[175px] border-2 border-dashed border-[#AEAEAE] rounded-[15px] self-center cursor-pointer"
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
              <span>محتوى المقال</span>
              <div className="flex items-center my-[10px] bg-[#F1F1F1] w-full rounded-[15px]">
                <textarea
                  className="min-h-[175px] w-full bg-transparent focus:outline-none resize-none py-[10px] px-[20px] border-[2px] border-[#AEAEAE] focus:border-[#61A3FF] rounded-[15px]"
                  style={{ direction }}
                  onBlur={handleBlur}
                  name="content"
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    handleTextDirection(e);
                  }}
                />
              </div>
            </div>
            <div className="flex justify-between mt-[15px]">
              <button
                onClick={addBlog}
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
              <button
                onClick={handleArticleModelState}
                className="hover:bg-gray-300
              rounded-[10px]
              duration-300
              px-[30px]
              py-[3px]"
              >
                رجوع
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="articles-content container px-[25px] m-auto my-[25px]">
        {/* صندوق الباب وتفاصيله */}
        {showBlogs}
      </div>
    </div>
  );
}
