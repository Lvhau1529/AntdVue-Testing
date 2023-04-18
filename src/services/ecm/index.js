import http from "@/api/base";

class ECM {
  ListFile(payload) {
    return http.post("folder/list", payload);
  }
  ListInvoice(payload) {
    return http.post("folder/list-processed-invoice-row", payload);
  }
  AddTask(payload) {
    return http.post("createTask", payload);
  }
  CheckValidInvoice(payload) {
    return http.post("xml/check-valid-invoice-by-id", payload);
  }
}

export default new ECM();
