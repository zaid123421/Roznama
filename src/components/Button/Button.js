export default function Button({className, onClick, label, icon}) {
  return(
    <button className={className} onClick={onClick}>
      {label}
      {icon && <i className="fa-solid fa-plus text-base ml-[10px]"/>}
    </button>
  );
}