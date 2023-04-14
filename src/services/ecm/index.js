import http from "@/api/base";

class ECM {
  ListFile(payload) {
    return http.post("folder/list", payload);
  }
  ListInvoice(payload) {
    return http.post("folder/list-processed-invoice-row", payload);
  }
}

export default new ECM();
