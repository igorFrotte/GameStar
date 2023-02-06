import axios from "axios";

const BASE_URL = "http://localhost/api/";

function createHeader() {
  const auth = JSON.parse(localStorage.getItem("gamestar"));
  const config = {
    headers: { Authorization: `Bearer ${auth.googleId}` }
  };
  return config;
} 

function login(body) {
  const promise = axios.post(BASE_URL + "login", body);
  return promise;
}

function validToken() {
  const header = createHeader();
  const promise = axios.get(BASE_URL + "token", header);
  return promise;
}

function gameIn() {
  const header = createHeader();
  const promise = axios.get(BASE_URL + "game", header);
  return promise;
}

export { login, validToken, gameIn };