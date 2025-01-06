import { useEffect, useRef, useState, DragEvent } from "react";
import Header from "../../components/Header/Header";

export default function Door() {
  // useState
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [direction, setDirection] = useState("rtl");
  const [images, setImages] = useState([]);
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // useEffect
  useEffect(() => {
    if (isModelOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModelOpen]);

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

  function handleModelState() {
    setIsModelOpen(!isModelOpen);
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

  const handleFileClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
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
      setImages([...images, ...e.dataTransfer.files]); // تحديث الملفات
      e.dataTransfer.clearData();
    }
  };

  return (
    <div className="text-base md:text-xl">
      <Header />
      {/* صندوق مدخل إلى النصائح */}
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
          onClick={handleModelState}
          className="
          border-2
          border-[#46A92F]
          bg-[#46A92F]
          text-white
          hover:bg-[#317c20]
          hover:border-[#317c20]
          rounded-[10px]
          duration-300
          md:px-[30px]
          md:py-[17px]
          px-[10px]
          py-[5px]
          fixed
          left-[30px]
          bottom-[30px]
          md:text-[20px]
          text-[16px]"
        >
          إضافة مقال
          <i className="fa-solid fa-plus ml-[10px]" />
        </button>
        <div className="ml-[20px] md:ml-[50px]">
          <span className="font-semibold mr-[10px]">باب التفسير</span>
          <i className="fa-solid fa-door-open"></i>
        </div>
      </div>
      {isModelOpen && (
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
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onClick={handleImageClick}
                onDrop={handleDrop}
                className="relative flex items-center justify-center my-[10px] bg-[#F1F1F1] w-full md:w-[450px] h-[200px] md:h-[300px] border-2 border-dashed border-[#AEAEAE] rounded-[15px] self-center cursor-pointer"
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
                  <p className="text-[14px] md:text-[18px]">
                    <span className="hidden md:inline-block">
                      أو اسحبها هنا
                    </span>{" "}
                    اختر الصورة{" "}
                  </p>
                </div>
                {imagesShow}
              </div>
              <span>اختر ملف المقال</span>
              <div
                onClick={handleFileClick}
                className="flex items-center justify-end my-[10px] bg-[#F1F1F1] w-full border-[1px] border-[#AEAEAE] rounded-[15px] text-nowrap h-[35px] md:h-[50px] px-[15px]"
              >
                {fileName && (
                  <span className="text-[14px] md:text-[18px] inline-block w-fit overflow-hidden">
                    {fileName}
                  </span>
                )}
                <i className="fa-solid fa-file inline ml-[15px]"></i>
                <input
                  hidden
                  ref={inputFileRef}
                  type="file"
                  style={{ direction }}
                  onBlur={handleBlur}
                  onChange={handleFileChange}
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
                onClick={handleModelState}
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
      {/* صندوق محتوى الصفحة والجدول */}
      <div className="mt-[15px] container m-auto px-[10px] md:px-[25px] overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-[#535763]">
              <th className="w-1/4 p-[10px]">التاريخ</th>
              <th className="w-1/4 p-[10px]">الحجم</th>
              <th className="w-1/2 p-[10px] text-end">الاسم</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-2 border-[#AEAEAE]">
              <td className="text-center p-[10px]">2025/1/1</td>
              <td className="text-center p-[10px]">5 KB</td>
              <td className="text-center p-[10px] w-fit text-nowrap md:text-wrap font-bold">
                تفسير سورة الفتح
              </td>
            </tr>
            <tr className="border-2 border-[#AEAEAE]">
              <td className="text-center p-[10px]">2025/1/1</td>
              <td className="text-center p-[10px]">5 KB</td>
              <td className="text-center p-[10px] w-fit text-nowrap md:text-wrap font-bold">
                تفسير سورة البقرة
              </td>
            </tr>
            <tr className="border-2 border-[#AEAEAE]">
              <td className="text-center p-[10px]">2025/1/1</td>
              <td className="text-center p-[10px]">5 KB</td>
              <td className="text-center p-[10px] w-fit text-nowrap md:text-wrap font-bold">
                ما المقصود من ذكر النبي بلفظ عب
              </td>
            </tr>
            <tr className="border-2 border-[#AEAEAE]">
              <td className="text-center p-[10px]">2025/1/1</td>
              <td className="text-center p-[10px]">5 KB</td>
              <td className="text-center p-[10px] w-fit text-nowrap md:text-wrap font-bold">
                تفسير سورة الفتح
              </td>
            </tr>
            <tr className="border-2 border-[#AEAEAE]">
              <td className="text-center p-[10px]">2025/1/1</td>
              <td className="text-center p-[10px]">5 KB</td>
              <td className="text-center p-[10px] w-fit text-nowrap md:text-wrap font-bold">
                تفسير سورة الفتح
              </td>
            </tr>
            <tr className="border-2 border-[#AEAEAE]">
              <td className="text-center p-[10px]">2025/1/1</td>
              <td className="text-center p-[10px]">5 KB</td>
              <td className="text-center p-[10px] w-fit text-nowrap md:text-wrap font-bold">
                تفسير سورة الفتح
              </td>
            </tr>
            <tr className="border-2 border-[#AEAEAE]">
              <td className="text-center p-[10px]">2025/1/1</td>
              <td className="text-center p-[10px]">5 KB</td>
              <td className="text-center p-[10px] w-fit text-nowrap md:text-wrap font-bold">
                تفسير سورة الفتح
              </td>
            </tr>
            <tr className="border-2 border-[#AEAEAE]">
              <td className="text-center p-[10px]">2025/1/1</td>
              <td className="text-center p-[10px]">5 KB</td>
              <td className="text-center p-[10px] w-fit text-nowrap md:text-wrap font-bold">
                تفسير سورة الفتح
              </td>
            </tr>
            <tr className="border-2 border-[#AEAEAE]">
              <td className="text-center p-[10px]">2025/1/1</td>
              <td className="text-center p-[10px]">5 KB</td>
              <td className="text-center p-[10px] w-fit text-nowrap md:text-wrap font-bold">
                تفسير سورة الفتح
              </td>
            </tr>
            <tr className="border-2 border-[#AEAEAE]">
              <td className="text-center p-[10px]">2025/1/1</td>
              <td className="text-center p-[10px]">5 KB</td>
              <td className="text-center p-[10px] w-fit text-nowrap md:text-wrap font-bold">
                تفسير سورة الفتح
              </td>
            </tr>
            <tr className="border-2 border-[#AEAEAE]">
              <td className="text-center p-[10px]">2025/1/1</td>
              <td className="text-center p-[10px]">5 KB</td>
              <td className="text-center p-[10px] w-fit text-nowrap md:text-wrap font-bold">
                تفسير سورة الفتح
              </td>
            </tr>
            <tr className="border-2 border-[#AEAEAE]">
              <td className="text-center p-[10px]">2025/1/1</td>
              <td className="text-center p-[10px]">5 KB</td>
              <td className="text-center p-[10px] w-fit text-nowrap md:text-wrap font-bold">
                تفسير سورة الفتح
              </td>
            </tr>
            <tr className="border-2 border-[#AEAEAE]">
              <td className="text-center p-[10px]">2025/1/1</td>
              <td className="text-center p-[10px]">5 KB</td>
              <td className="text-center p-[10px] w-fit text-nowrap md:text-wrap font-bold">
                تفسير سورة الفتح
              </td>
            </tr>
            <tr className="border-2 border-[#AEAEAE]">
              <td className="text-center p-[10px]">2025/1/1</td>
              <td className="text-center p-[10px]">5 KB</td>
              <td className="text-center p-[10px] w-fit text-nowrap md:text-wrap font-bold">
                تفسير سورة الفتح
              </td>
            </tr>
            <tr className="border-2 border-[#AEAEAE]">
              <td className="text-center p-[10px]">2025/1/1</td>
              <td className="text-center p-[10px]">5 KB</td>
              <td className="text-center p-[10px] w-fit text-nowrap md:text-wrap font-bold">
                تفسير سورة الفتح
              </td>
            </tr>
            <tr className="border-2 border-[#AEAEAE]">
              <td className="text-center p-[10px]">2025/1/1</td>
              <td className="text-center p-[10px]">5 KB</td>
              <td className="text-center p-[10px] w-fit text-nowrap md:text-wrap font-bold">
                تفسير سورة الفتح
              </td>
            </tr>
            <tr className="border-2 border-[#AEAEAE]">
              <td className="text-center p-[10px]">2025/1/1</td>
              <td className="text-center p-[10px]">5 KB</td>
              <td className="text-center p-[10px] w-fit text-nowrap md:text-wrap font-bold">
                تفسير سورة الفتح
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
