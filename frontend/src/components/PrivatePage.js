import { useEffect, useState } from "react";
import { validToken } from "../services/axiosService";
import { useNavigate } from "react-router-dom";

export default function PrivatePage({ children }) {

  const [render, setRender] = useState(<></>);
  const navigate = useNavigate();
  const auth = JSON.parse(localStorage.getItem("gamestar"));

  function renderError() {
    localStorage.clear("gamestar");
    navigate("/login");
    return <>Erro!</>;
  }
  
  function verification() {
    const promise = validToken();
      promise
        .then((r) => {
          setRender(
            <>
              {children}
            </>
          );
        })
        .catch(() => {
          return renderError();
        }); 
  }

  useEffect(() => {
    if (!auth) {
      return renderError();
    } 
    verification();  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return render;
}