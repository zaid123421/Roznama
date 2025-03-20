import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import BASE_URL from "../../config";
import Model from "../../components/Models/Model";
import failureImage from '../../assets/failure.png'


export default function RequireAuth() {
  const cookies = new Cookies();
  const [isValid, setIsValid] = useState(true);
  const [failed, setFailed] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const token = cookies.get("userAccessToken");
    const interval = setInterval(() => {
      fetch(`${BASE_URL}/advice`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            handleInvalidToken();
          }
        })
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleInvalidToken = () => {
    cookies.remove("userAccessToken");
    setIsValid(false);
    setFailed(true);
    setTimeout(() => {
      nav("/");
    }, 3000);
  };

  if(failed) {
    return (<Model message="عذرا حدث خطأ ما" imageSrc={failureImage} />);
  }

  return isValid ? <Outlet /> : <Navigate to="/" />;
}
