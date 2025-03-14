import { useEffect, useState, DragEvent } from "react";
import Header from "../../components/Header/Header";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../config";
import Cookies from "universal-cookie";
import Button from "../../components/Button/Button";

export default function Section() {
  // useState
  const [doorInfo, setDoorInfo] = useState(null);
  const [refreshPage, setRefreshPage] = useState(0);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [articleName, setArticleName] = useState("");
  const [articleId, setArticleId] = useState(null);

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

  function handleSearch(query) {
    setSearchQuery(query);
  }

  const cookie = new Cookies();
  const token = cookie.get("userAccessToken");

  async function handleDelete(id) {
    try {
      await axios.delete(`${BASE_URL}/blogs/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setRefreshPage(refreshPage + 1);
      setConfirm(false);
    } catch {
      console.log("Error");
    }
  }

  const showDoor = Array.isArray(doorInfo) && doorInfo.length > 0 ? doorInfo.map((door, index) => (
    <tr onClick={() => {nav(`/article?article_id=${door.id}&article_name=${door.title}&door=${doorName}&section_id=${sectionId}`);}} className="border-2 border-[#AEAEAE] cursor-pointer" key={index}>
      <td className="text-center px-[5px]">
      <i
      onClick={(e) => {e.stopPropagation();nav(`/EditBlog?article_id=${door.id}&door=${doorName}`)}}
      className="fa-solid
          fa-wand-magic
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
          text-blue-500
          duration-300
          hover:bg-slate-200"
      />
      </td>
      <td className="text-center px-[5px]">
      <i
      onClick={(e) => {setConfirm(true); setArticleName(door.title); setArticleId(door.id); e.stopPropagation();}}
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
      <td className="text-end p-[10px] w-full text-nowrap md:text-wrap font-bold">
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
        <button onClick={() => nav('/sections')}
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
                  <th className="w-2/12 p-[10px]">تعديل</th>
                  <th className="w-2/12 p-[10px]">حذف</th>
                  <th className="w-2/12 p-[10px]">التاريخ</th>
                  <th className="w-6/12 p-[10px] text-end">الاسم</th>
                </tr>
              </thead>
              <tbody>
                {showDoor}
              </tbody>
            </table>
        </div>
      }
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
            <p className="text-right">هل تود حقاً حذف <span className="font-bold">{articleName}</span></p>
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
                onClick={() => handleDelete(articleId)}
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
    </div>
  );
}
