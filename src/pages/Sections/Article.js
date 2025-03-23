import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../config";

export default function Article() {
  // useState
  const [articleInfo, setArticleInfo] = useState([]);

  // useNavigate
  const nav = useNavigate();

  // useLocation
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const articleName = params.get('article_name');
  const articleId = params.get('article_id');
  const sectionId = params.get('section_id');
  const sectionName = params.get('section_name');

  // useEffect
  useEffect(() => {
    axios
      .get(`${BASE_URL}/blogs/${articleId}`, {
        headers: {
          Accept: "application/json",
        },
      })
      .then((data) => {setArticleInfo(data.data.data)})
      .catch((err) => console.log(err));
  }, []);

  const text = articleInfo.content;

  return(
    <>
      <Header disabled="true" />
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
        <div className="flex items-center">
          <p className="font-semibold mr-[10px] text-right">{sectionName} / {articleName}</p>
          <i className="fa-solid fa-door-open"></i>
        </div>
        <button onClick={() => nav(`/section?section_id=${sectionId}&section_name=${sectionName}`)}
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
      </div>
      <div className="px-[10px]">
        <div className="container bg-[#f1f1f1] overflow-hidden m-auto px-[10px] md:px-[25px] py-[10px] md:py-[25px] my-[20px] rounded-3xl text-right"
        style={{ boxShadow: "0px 7px 20px 0px rgba(0, 0, 0, 0.25)" }} >
          {articleInfo.length !== 0 && articleInfo.images.length !== 0 &&
          <img className="w-full rounded-2xl" src = {articleInfo.images[0].url} alt="article"/>}
          <h1 className="mt-[25px] text-[30px] text-[#3769AE] underline">{articleInfo.title}</h1>
          <pre
          className="mt-[20px] text-[20px] leading-10"
          dangerouslySetInnerHTML={{ __html: text }}
          style={{  fontFamily: "Cairo, serif" }}
          />
        </div>
      </div>
    </>
  );
}