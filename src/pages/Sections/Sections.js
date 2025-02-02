import { useEffect, useRef, useState } from "react";
import Header from "../../components/Header/Header";
import "./Sections.css";
import axios from "axios";
import BASE_URL from "../../config";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";

export default function Sections() {
  // useState
  const [doorModelState, setDoorModelState] = useState(false);
  const [editDoorModelState, setEditDoorModelState] = useState(false);
  const [direction, setDirection] = useState("rtl");
  const [sections, setSections] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [refreshPage, setRefreshPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");


  const [name, setName] = useState("");
  const [about, setAbout] = useState("");

  const [sectionId, setSectionId] = useState(0);

  // useNavigate
  const nav = useNavigate();

  // useEffect
  useEffect(() => {
    if (doorModelState || editDoorModelState) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [doorModelState, editDoorModelState]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/sections?perPage=75`, {
        headers: {
          Accept: "application/json",
        },
      })
      .then((data) => {
        setSections(data.data.data);
      })
      .catch((err) => console.log(err));
  }, [refreshPage]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBlogs([]);
      return;
    }
    axios
      .get(`${BASE_URL}/blogs?title=${searchQuery}`, {
        headers: {
          Accept: "application/json",
        },
      })
      .then((response) => {
        setFilteredBlogs(response.data.data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, [searchQuery]);

  function handleSearch(query) {
    setSearchQuery(query);
  }

  function doorClick(id, name) {
    nav(`/door?section_id=${id}&door_name=${name}`);
  }

  // Show Blogs
  const showBlogs = sections.map((section, index) => (
    <div onClick={(e) => doorClick(section.id, section.name, e)}
      className="door-box cursor-pointer flex flex-col justify-between">
      <div>
        <span className="font-bold">{section.name}</span>
        <p className="my-[10px] text-justify font-medium p-[20px] rounded-[15px] bg-[#C5C5C5] h-fit">
          {section.about}
        </p>
      </div>
      <div className="flex justify-between mt-[15px]">
        <div>
          <i
            onClick={(e) => {
              setSectionId(section.id);
              handleEditDoorModelState();
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
              handleDeleteDoor(section.id);
              e.stopPropagation();
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
        <button
          onClick={(e) => {
            setSectionId(section.id);
            e.stopPropagation();
            nav(`/addBlog?section_id=${section.id}`);
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

  const showSearchResults = filteredBlogs.map((blog, index) => (
    <tr className="border-2 border-[#AEAEAE]" key={index}>
    <td className="text-center px-[5px]">
    <i
    onClick={() => handleDelete(blog.id)}
    className="fa-solid
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
    <td className="text-center p-[10px]">{(blog.created_at).slice(0, 10)}</td>
    <td className="text-center p-[10px] w-fit text-nowrap md:text-wrap font-bold">
      {blog.title}
    </td>
  </tr>
  ));

  async function handleDelete(id) {
    try {
      const res = await axios.delete(`${BASE_URL}/blogs/${id}`, {
        headers: {
          Accept: "application/json",
        },
      });
      setRefreshPage(refreshPage + 1);
    } catch {
      console.log("Error");
    }
  }

  // Functions
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

  // Communicating With Backend
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

  async function Submit() {
    try {
      const res = await axios.post(`${BASE_URL}/sections`, {
        headers: {
          Accept: "application/json",
        },
        name: name,
        about: about,
      });
      if(res.status === 201) {
        console.log("Yes !");
        handleDoorModelState();
        setRefreshPage((prev) => prev + 1);
      }
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

  return (
    <div className="text-base md:text-xl">
      <Header onSearch={handleSearch}/>
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
        mb-[15px]
        border-b-2
        border-b-solid
        border-b-black
        py-[15px]"
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
      {/* مودل إدخال الباب */}
      {doorModelState && (
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
            <p className="flex justify-end pb-[10px] font-bold">إضافة باب</p>
            <div className="flex flex-col ">
              <span className="flex justify-end mb-[5px]">اسم الباب</span>
              <input
                autoFocus
                className={`border-[2px] border-[#AEAEAE] focus:border-[#61A3FF] focus:outline-none rounded-lg p-[10px] ${
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
                label="إضافة"
                onClick={Submit}
                icon = "true"
                />
              <Button onClick={handleDoorModelState}
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
      )}
      {/* مودل تعديل الباب */}
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
            className="bg-white text-base w-full flex flex-col p-[20px] md:w-[800px] md:text-xl rounded"
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
                onClick={() => {
                  handleEditDoorModelState();
                  Edit();
                }}
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
      {/* صندوق المحتوى يعني صندوق الأبواب */}
        {
        searchQuery !== "" && filteredBlogs.length === 0
        ? <p className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">لا يوجد نتائج مطابقة</p>
        : searchQuery !== "" && filteredBlogs.length !== 0
        ?<div className="container m-auto px-[10px] md:px-[25px] overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[#535763]">
                <th className="w-1/4 p-[10px]">حذف</th>
                <th className="w-1/4 p-[10px]">التاريخ</th>
                <th className="w-1/2 p-[10px] text-end">الاسم</th>
              </tr>
            </thead>
            <tbody>
              {showSearchResults}
            </tbody>
          </table>
        </div>
        : <div className="articles-content container px-[25px] m-auto mb-[20px]">{showBlogs}</div>
        }
    </div>
  );
}
