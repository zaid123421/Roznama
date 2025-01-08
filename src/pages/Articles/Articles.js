import { useEffect, useRef, useState } from "react";
import Header from "../../components/Header/Header";
import "./Articles.css";
import axios from 'axios'

export default function Articles() {
  // useState
  const [doorModelState, setDoorModelState] = useState(false);
  const [articleModelState, setArticleModelState] = useState(false);
  const [direction, setDirection] = useState("rtl");
  const [images, setImages] = useState([]);
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [refreshPage, setRefreshPage] = useState(1);

  const [form, setForm] = useState({
    title: "",
    content: ""
  });

  // useEffect
  useEffect(() => {
    if (doorModelState) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [doorModelState]);

  useEffect(() => {
    axios.get("http://199.192.19.220:8080/api/v1/blogs", {
      headers: {
        Accept: "application/json",
        Authorization: " Bearer 2|pG8rktMiWrygmLy0nUp3c2mfHJSuflnBB62vfPNh8c223f32" ,
      },
    })
    .then((data) => setBlogs(data.data.data))
    .catch((err) => console.log(err));
  }, [refreshPage])

  console.log(blogs);

  // Show Blogs
  const showBlogs = blogs.map((blog, index) => 
    <div className="door-box cursor-pointer">
    <span className="font-bold">{blog.title}</span>
    <p className="my-[10px] text-justify font-medium p-[20px] rounded-[15px] bg-[#C5C5C5] h-fit">
      {blog.content}
    </p>
    <div className="flex justify-between mt-[15px]">
      <div>
        <i className="fa-solid
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
        <i onClick={() => handleDeleteDoor(blog.id)} className="fa-solid
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
      <button onClick={handleArticleModelState} className="bg-[#3FAB21]
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
        <i className="fa-solid fa-plus ml-[10px]"/>
        إضافة مقال
      </button>
    </div>
  </div>
  )

  async function handleDeleteDoor(id) {
    try{
      let res = await axios.delete(`http://199.192.19.220:8080/api/v1/blogs/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: " Bearer 2|pG8rktMiWrygmLy0nUp3c2mfHJSuflnBB62vfPNh8c223f32" ,
        },
      });
      console.log(res);
      if(res.status === 204)
      console.log("Done !");
      setRefreshPage(refreshPage + 1);
    }
    catch {
      console.log("None");
    }
  }

  async function Submit(e){
    e.preventDefault();
    const data = new FormData();
    data.append("title", form.title);
    data.append("content", form.content);
    try { 
      const res = await axios.post(`http://199.192.19.220:8080/api/v1/blogs`, data, {
          headers: {
            'Authorization': `Bearer 2|pG8rktMiWrygmLy0nUp3c2mfHJSuflnBB62vfPNh8c223f32`,
          }
        }
      );
      console.log('Yes !');
      setRefreshPage((prev) => prev + 1 );
    } catch (error) {
      console.log(error);
    }
  }

  // useRef
    const inputImageRef = useRef(null);
    const inputFileRef = useRef(null);

  // Mapping
  const imagesShow = images.map((img, key) => (
    <img className="absolute right-0 top-0 rounded-[10px] h-full w-full" src={URL.createObjectURL(img)} alt="Test" />
  ));

  // Handling
  function handleDoorModelState () {
    setDoorModelState(!doorModelState);
  }

  function handleArticleModelState () {
    setArticleModelState(!articleModelState);
    setImages([]);
    setFile(null);
    setFileName(null);
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name); 
    }
  };

  function handleChange(e){
    setForm({ ...form, [e.target.name]: e.target.value});
  }

  return (
    <div className="text-base md:text-xl">
      <Header />
      {/* صندوق المدخل إلى الأبواب وزر إمكانية إضافة الباب */}
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
        <button onClick={() => setDoorModelState(true)} className="hover:bg-gray-300
          rounded-[10px]
          duration-300
          px-[10px]
          py-[3px]"
        >
          إضافة باب
          <i className="fa-solid fa-plus ml-[10px]"/>
        </button>
        <div className="ml-[20px] md:ml-[50px]">
          <span className="font-semibold mr-[10px]">الأبواب</span>
          <i className="fa-solid fa-door-open"></i>
        </div>
      </div>
      {doorModelState &&
      // صندوق إدخال الباب
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
              onChange = {(e) => {handleChange(e);handleTextDirection(e)}}
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
              value = {form.content} onChange = {(e) => {handleChange(e);handleTextDirection(e)}}
              onBlur={handleBlur}
            />
          </div>
          <div className="flex justify-between mt-[15px]">
            <button onClick={Submit}
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
            <button onClick={handleDoorModelState} className="hover:bg-gray-300
              rounded-[10px]
              duration-300
              px-[30px]
              py-[3px]">
              رجوع
            </button>
          </div>
        </div>
      </div>
      }
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
          absolute
          z-50
          px-[25px]"
        >
          <div
            style={{ boxShadow: "0px 15px 20px 5px rgba(0, 0, 0, 0.25)" }}
            className="bg-white text-base md:text-xl w-full flex flex-col p-[20px] md:w-[700px] text-right"
          >
            <div className="flex flex-col">
              <span>اختر صورة المقال</span>
              <div onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onClick={handleImageClick}
                onDrop={handleDrop} className = "relative flex items-center justify-center my-[10px] bg-[#F1F1F1] w-full md:w-[450px] h-[200px] md:h-[300px] border-2 border-dashed border-[#AEAEAE] rounded-[15px] self-center cursor-pointer">
                <input
                  ref = {inputImageRef}
                  hidden
                  type = "file"
                  onChange = {(e) => setImages([...e.target.files])}
                  multiple />
                <div className = "flex flex-col items-center">
                  <i className="fa-solid fa-image text-[#7F7F7F] text-[30px] md:text-[60px] mb-[10px]"></i>
                  <p className="text-[14px] md:text-[18px]"><span className="hidden md:inline-block">أو اسحبها هنا</span> اختر الصورة </p>
                </div>
                {imagesShow}
              </div>
          <span>اختر ملف المقال</span>
            <div onClick={handleFileClick} className="flex items-center justify-end my-[10px] bg-[#F1F1F1] w-full border-[1px] border-[#AEAEAE] rounded-[15px] text-nowrap h-[35px] md:h-[50px] px-[15px]">
            {fileName && <span className="text-[14px] md:text-[18px] inline-block w-fit overflow-hidden">{fileName}</span>}
            <i className="fa-solid fa-file inline ml-[15px]"></i>
            <input
                hidden
                ref={inputFileRef}
                type="file"
                style={{ direction }}
                onBlur={handleBlur}
                onChange = {handleFileChange}
              />
            </div>
              <span>عنوان المقال</span>
              <div className="flex items-center my-[10px] bg-[#F1F1F1] w-full border-[1px] border-[#AEAEAE] rounded-[15px] h-[35px] md:h-[50px] px-[15px]">
              <input
                style={{ direction }}
                onChange={handleTextDirection}
                onBlur={handleBlur}
                className="w-full bg-transparent focus:outline-none"
              />
              </div>
            </div>
            <div className="flex justify-between mt-[15px]">
              <button
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
