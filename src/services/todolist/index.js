import axios from "@/plugins/axios";

export async function getListTask() {
  return await axios.get("createTask");
}

export async function addTask(payload) {
  return await axios.post("createTask", payload);
}
