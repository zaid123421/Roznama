import { NavLink } from "react-router-dom";
import logo from "../../assets/lastlogo.png";
import { useState } from "react";
export default function Header({onSearch}) {
  const [isOpened, setIsOpened] = useState(false);
  const [direction, setDirection] = useState("rtl");

  function handleClick() {
    setIsOpened(!isOpened);
  }

  const handleInputChange = (event) => {
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

  return (
    // The Main Box With Padding
    <div className="text-base bg-[#46A92F] py-3">
      {/* The Secondary box */}
      <div className="container w-full px-[25px] m-auto flex justify-between items-center text-white">
        <i
          onClick={handleClick}
          className="fa-bars-staggered
          lg:hidden
          hover:text-black
          duration-300
          cursor-pointer
          text-2xl
          fa-solid"
        />
        {isOpened && (
          // Small Screend ul
          <ul
            className="flex
            w-full
            absolute
            top-[96px]
            right-0
            flex-col
            bg-green-100
            border-solid
            border-2
            border-green-500
            md:rounded-xl
            z-[100]"
          >
            <li className="text-green-500 duration-300 text-lg text-center mt-[5px]">
              <NavLink
                to="/tips"
                className={({ isActive }) =>
                  isActive ? "text-green-600 font-bold" : ""
                }
              >
                الترحيب والبريد
              </NavLink>
            </li>
            <li className="text-green-500 duration-300 text-lg text-center my-[10px]">
              <NavLink
                to="/stickers"
                className={({ isActive }) =>
                  isActive ? "text-green-600 font-bold" : ""
                }
              >
                ملصقات
              </NavLink>
            </li>
            <li className="text-green-500 duration-300 text-lg text-center mb-[5px]">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "text-green-600 font-bold" : ""
                }
              >
                مقالات
              </NavLink>
            </li>
          </ul>
        )}
        {/* Large Screend ul */}
        <ul className="lg:flex min-[0px]:hidden max-[1024px]">
          <li className="mr-5 text-2xl hover:text-black duration-300">
            <NavLink
              to="/tips"
              className={({ isActive }) =>
                isActive ? " underline underline-offset-[37px]" : ""
              }
            >
              الترحيب والبريد
            </NavLink>
          </li>
          <li className="mr-5 text-2xl hover:text-black duration-300">
            <NavLink
              to="/stickers"
              className={({ isActive }) =>
                isActive ? "underline underline-offset-[37px]" : ""
              }
            >
              ملصقات
            </NavLink>
          </li>
          <li className="mr-5 text-2xl hover:text-black duration-300">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "underline underline-offset-[37px]" : ""
              }
            >
              مقالات
            </NavLink>
          </li>
        </ul>
        {/* Search Box */}
        <div className="bg-white hidden md:flex items-center text-black px-[25px] py-[7px] w-[350px] rounded-xl">
          <i className="fa-solid fa-magnifying-glass text-gray-400" />
          <input
            placeholder="ابحث هنا"
            className={`flex justify-start w-full outline-none focus:text-right ${
              direction === "rtl" ? "text-right" : "text-left"
            }`}
            style={{ direction }}
            onChange={(e) => onSearch(e.target.value)}
            onBlur={handleBlur}
          />
        </div>
        {/* Logo */}
        <img className="logo w-[126px] h-[72px]" alt="logo" src={logo} />
      </div>
    </div>
  );
}