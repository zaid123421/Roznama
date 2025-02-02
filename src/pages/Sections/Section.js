import { useEffect, useRef, useState, DragEvent } from "react";
import Header from "../../components/Header/Header";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../config";

export default function Section() {
  // useState
  const [doorInfo, setDoorInfo] = useState(null);
  const [refreshPage, setRefreshPage] = useState(0);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const nav = useNavigate();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const sectionId = params.get('section_id');
  const doorName = params.get('door_name');

  useEffect(() => {
    axios
      .get(`${BASE_URL}/blogs?section_id=${sectionId}`, {
        headers: {
          Accept: "application/json",
        },
      })
      .then((data) => {setDoorInfo(data.data.data)})
      .catch((err) => console.log(err));
  }, [refreshPage]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBlogs([]);
      return;
    }
    axios
      .get(`${BASE_URL}/blogs?section_id=${sectionId}&title=${searchQuery}`, {
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

  function handleBack() {
    nav('/')
  }

  function handleSearch(query) {
    setSearchQuery(query);
  }

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

  const showDoor = Array.isArray(doorInfo) && doorInfo.length > 0 ? doorInfo.map((door, index) => (
    <tr className="border-2 border-[#AEAEAE]" key={index}>
      <td className="text-center px-[5px]">
      <i
      onClick={() => handleDelete(door.id)}
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
      <td className="text-center p-[10px]">{(door.created_at).slice(0, 10)}</td>
      <td className="text-center p-[10px] w-fit text-nowrap md:text-wrap font-bold">
        {door.title}
      </td>
    </tr>
  )) : null;

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

  return (
    <div className="text-base md:text-xl">
      <Header onSearch={handleSearch}/>
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
        border-b-2
        border-b-solid
        border-b-black
        py-[15px]"
      >
        <div className="ml-[20px] md:ml-[50px]">
          <span className="font-semibold mr-[10px]">{doorName}</span>
          <i className="fa-solid fa-door-open"></i>
        </div>
        <button onClick={handleBack}
          className="ml-[25px]
          hover:bg-gray-300
          rounded-[10px]
          duration-300
          px-[10px]
          py-[5px]">
          رجوع
          <i className="fa-solid fa-chevron-right text-[10px] md:text-[15px] ml-[5px] md:ml-[10px]"></i>
        </button>
      </div>
      {/* صندوق محتوى الصفحة والجدول */}
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
        : <div className="container m-auto px-[10px] md:px-[25px] overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[#535763]">
                  <th className="w-1/4 p-[10px]">حذف</th>
                  <th className="w-1/4 p-[10px]">التاريخ</th>
                  <th className="w-1/2 p-[10px] text-end">الاسم</th>
                </tr>
              </thead>
              <tbody>
                {showDoor}
              </tbody>
            </table>
          </div>
        }
    </div>
  );
}
