import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo.png';
import "./Header.css";
import { useState } from 'react';
export default function Header() {
  const [isOpened, setIsOpened] = useState(false);

  function handleClick() {
    setIsOpened(!isOpened);
  }

  return (
    <div className = "container px-[25px] m-auto flex justify-between items-center relative">
        <i onClick = {handleClick} className = "lg:hidden hover:text-green-600 duration-300 cursor-pointer text-2xl fa-solid fa-bars-staggered"></i>
        {
          isOpened &&
          <ul className = "flex w-full absolute top-[100%] right-0 flex-col bg-green-100 border-solid border-2 border-green-500 rounded-md">
            <li className = 'text-lg text-center mt-[5px]'>
              <NavLink to = "/reminders" className={({ isActive }) => (isActive ? 'text-green-600 font-bold' : '')}>التذكيرات</NavLink>
            </li>
            <li className = 'text-lg text-center my-[10px]'>
              <NavLink to = "/tips" className={({ isActive }) => (isActive ? 'text-green-600 font-bold' : '')}>النصائح</NavLink>
            </li>
            <li className = 'text-lg text-center mb-[5px]'>
              <NavLink to = "/" className={({ isActive }) => (isActive ? 'text-green-600 font-bold' : '')}>المقالات</NavLink>
            </li>
          </ul>
        }
      <ul className = 'lg:flex min-[0px]:hidden max-[1024px]'>
        <li className = 'mr-5 text-2xl hover:text-green-600 duration-300'>
          <NavLink to = "/reminders" className={({ isActive }) => (isActive ? 'text-green-600 underline underline-offset-[15px]' : '')}>التذكيرات</NavLink>
        </li>
        <li className = 'mr-5 text-2xl hover:text-green-600 duration-300'>
          <NavLink to = "/tips" className={({ isActive }) => (isActive ? 'text-green-600 underline underline-offset-[15px]' : '')}>النصائح</NavLink>
        </li>
        <li className = 'mr-5 text-2xl hover:text-green-600 duration-300'>
          <NavLink to = "/" className={({ isActive }) => (isActive ? 'text-green-600 underline underline-offset-[15px]' : '')}>المقالات</NavLink>
        </li>
      </ul>
      <img className = "logo w-[175px] h-[130px]" alt = "logo" src = {logo}/>
    </div>
  );
}