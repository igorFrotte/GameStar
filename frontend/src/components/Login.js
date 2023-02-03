import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { login } from "../services/axiosService";

export default function Login() {

  const navigate = useNavigate();

	const sucessGoogle = (response) => {
		const {name, email, picture , sub } = jwt_decode(response.credential);
    const userInfo = {name, email, picture, googleId: Number(sub)};
    const promise = login(userInfo);
    promise
      .then((r) => {
        localStorage.setItem("gamestar", JSON.stringify(userInfo));
        navigate("/");
      })
      .catch(() => {
        failGoogle();
      });
	};

  const failGoogle = () => { 
    localStorage.clear("gamestar");
    alert("Erro ao logar!");
  };

	return (
		<div className="container">
      <GoogleOAuthProvider 
      clientId="618107175710-ad2g5r7pivih84fp692gh1f70jkjnl9s.apps.googleusercontent.com">
        <GoogleLogin
				buttonText="Continuar com o Google"
				onSuccess={sucessGoogle}
				onFailure={failGoogle}
			  />    
      </GoogleOAuthProvider>
		</div>
	);
}
