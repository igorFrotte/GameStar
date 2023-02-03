import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalStyle from "../assets/styles/globalStyles";
import Login from "./Login";
import PrivatePage from "./PrivatePage";
import Home from "./Home"; 

export default function App() {
  
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/"
            element={
              <PrivatePage>
                <Home />
              </PrivatePage>
            }
          /> 
        </Routes>
      </BrowserRouter>
    </>
  );
}
