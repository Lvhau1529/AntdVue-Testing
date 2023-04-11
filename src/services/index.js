import axios from "@/plugins/axios";

export async function getProfile(params) {
  return await axios.get(
    `data/2.5/weather?q=${params}&appid=${process.env.VUE_APP_API_KEY}`
  );
}

export async function login(payload) {
  return await axios.get("user/v1/login", payload);
}
