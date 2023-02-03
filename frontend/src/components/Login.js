import { useState } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

export default function Login() {

	const [name, setName] = useState();
	const [email, setEmail] = useState();
	const [profilePic, setProfilePic] = useState();
  const [googleId, setGoogleId] = useState();
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const sucessGoogle = (response) => {
		const {name, email, picture , sub } = jwt_decode(response.credential);
		setName(name);
		setEmail(email);
		setProfilePic(picture);
    setGoogleId(sub);
		setIsLoggedIn(true);
	};

  const failGoogle = () => { alert("Erro ao logar!"); };

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
			
			{isLoggedIn ? (
				<div style={{ textAlign: "center" }}>
					<h1>User Information</h1>
					<img className="profile" src={profilePic} alt="Profile" />
					<p>Name: {name}</p>
					<p>Email: {email}</p>
          <p>Id: {googleId}</p>
				</div>
			) : (
				""
			)}
		</div>
	);
}
