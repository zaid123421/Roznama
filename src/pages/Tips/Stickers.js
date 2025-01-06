import Header from "../../components/Header/Header";

export default function Stickers() {
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
          إضافة ملصقات
          <i className="fa-solid fa-plus ml-[10px]"/>
        </button>
        <div className="ml-[20px] md:ml-[50px]">
          <span className="font-semibold mr-[10px]">الملصقات</span>
          <i className="fa-solid fa-note-sticky"></i>
        </div>
      </div>
    </div>
  );
}