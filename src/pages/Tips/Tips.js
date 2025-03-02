import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import axios from "axios";
import BASE_URL from "../../config";
import Cookies from "universal-cookie";

export default function Tips() {

  const [refreshPage, setRefreshPage] = useState(1);
  const [advices, setAdvices] = useState([]);

  const cookie = new Cookies();
  const token = cookie.get("userAccessToken");

  useEffect(() => {
    axios.get(`${BASE_URL}/advice`,{
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((data) => setAdvices(data.data.data))
    .catch((err) => console.log(err));
  }, [refreshPage])

  async function handleDeleteTip(id) {
    try{
      let res = await axios.delete(`${BASE_URL}/advice/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);
      console.log("Done !");
      setRefreshPage(refreshPage + 1);
    }
    catch {
      console.log("False !");
    }
  }

  // Show Advices
  const showAdvices = advices.map((advice, index) =>
    <tr className="border-2 border-[#AEAEAE]">
      <td className="text-center px-[5px]">
      <i onClick={() => handleDeleteTip(advice.id)} className="fa-solid
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
      <td className="text-center p-[10px]">
        {(advice.created_at).slice(0, 10)}
      </td>
      <td className="text-[14px] md:text-[18px] text-end md:text-center p-[10px] py-[20px] md:pl-[50px] font-bold">
        {advice.content}
      </td>
    </tr>
  )

  return (
    <div className="text-base md:text-xl">
      <Header />
      {/* صندوق مدخل إلى النصائح */}
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
        <button className="hover:bg-gray-300
        rounded-md
        duration-300
        px-[10px]
        py-[3px]"
        >
          ...فرز حسب
          <i className="fa-solid fa-chevron-down ml-[10px] text-sm text-[#7F7F7F]"/>
        </button>
        <div className="ml-[20px] md:ml-[50px]">
          <span className="font-semibold mr-[10px]">النصائح</span>
          <i class="fa-solid fa-envelope"/>
        </div>
      </div>
      {/* صندوق محتوى الصفحة والجدول */}
      <div className="mt-[15px] container m-auto px-[10px] md:px-[25px] overflow-x-auto">
        <table className="w-full mb-[20px]">
          <thead>
            <tr className="text-[#535763]">
              <th className="w-1/8 pb-[15px]">حذف</th>
              <th className="w-1/8 pb-[15px]">التاريخ</th>
              <th className="w-3/4 pb-[15px] text-end">النصيحة</th>
            </tr>
          </thead>
          <tbody>
            {/* <tr className="border-2 border-[#AEAEAE]">
              <td className="text-center p-[10px]">
                2025/1/1
              </td>
              <td className="text-end md:text-center p-[15px] pl-[50px] w-fit text-nowrap md:text-wrap font-bold">
                مرحباً, أنا هنا لأقدم نصيحة وأرجو أن تؤخذ بعين الاعتبار !
                بخصوص موضوع مواقيت الصلاة الخ
              </td>
            </tr>
            <tr className="border-2 border-[#AEAEAE]">
              <td className="text-center p-[10px]">
                2024/12/31
              </td>
              <td className="text-end md:text-center p-[10px] pl-[50px] font-bold">
                تحية طيبة وبعد, أرجو من القائمين على التطبيق الاهتمام أكثر بالروزنامة
              </td>
            </tr>
            <tr className="border-2 border-[#AEAEAE]">
              <td className="text-center p-[10px]">
                2024/12/27
              </td>
              <td className="text-end md:text-center p-[10px] pl-[50px] font-bold">
                السلام عليكم ورحمة الله وبركاته, لايوجد لدينا نصائح بل نريد شكر إدارة التطبيق على الإفادة وجعله الله في ميزان حسناتكم
              </td>
            </tr> */}
            {showAdvices}
          </tbody>
        </table>
      </div>
    </div>
  );
}