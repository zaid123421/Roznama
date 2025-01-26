export default function Button({className, onClick, label}) {
  return(
    <button className={className} onClick={onClick}>{label}</button>
  );
}