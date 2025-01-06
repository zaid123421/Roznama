import Header from "../../components/Header/Header";

export default function WelcomeMail() {
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
          <span className="font-semibold mr-[10px]">البريد</span>
          <i class="fa-solid fa-envelope"/>
        </div>
      </div>
      {/* صندوق محتوى الصفحة والجدول */}
      <div className="mt-[15px] container m-auto px-[10px] md:px-[25px] overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-[#535763]">
              <th className="w-1/4 p-[10px]">التاريخ</th>
              <th className="w-1/4 p-[10px]">الحجم</th>
              <th className="w-1/2 p-[10px] text-end">النصيحة</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-2 border-[#AEAEAE]">
              <td className="text-center p-[10px]">
                2025/1/1
              </td>
              <td className="text-center p-[10px]">
                5 KB
              </td>
              <td className="text-center p-[10px] w-fit text-nowrap md:text-wrap font-bold">
                مرحباً, أنا هنا لأقدم نصيحة وأرجو أن تؤخذ بعين الاعتبار !
                بخصوص موضوع مواقيت الصلاة الخ
              </td>
            </tr>
            <tr className="border-2 border-[#AEAEAE]">
              <td className="text-center p-[10px]">
                2024/12/31
              </td>
              <td className="text-center p-[10px]">
                3 KB
              </td>
              <td className="text-center p-[10px] font-bold">
                تحية طيبة وبعد, أرجو من القائمين على التطبيق الاهتمام أكثر بالروزنامة
              </td>
            </tr>
            <tr className="border-2 border-[#AEAEAE]">
              <td className="text-center p-[10px]">
                2024/12/27
              </td>
              <td className="text-center p-[10px]">
                8 KB
              </td>
              <td className="text-center p-[10px]  font-bold">
                السلام عليكم ورحمة الله وبركاته, لايوجد لدينا نصائح بل نريد شكر إدارة التطبيق على الإفادة وجعله الله في ميزان حسناتكم
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}