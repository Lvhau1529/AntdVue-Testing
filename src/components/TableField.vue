<template>
  <div>
    <a-table
      ref="aTable"
      :row-key="(record) => record.invoice"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
      :columns="columns"
      :data-source="data"
      :pagination="pagination"
    >
      <template slot-scope="text, record, index" slot="stt">
        <div style="text-align: center">
          {{ (pagination.page - 1) * pagination.pageSize + index + 1 }}
        </div>
      </template>

      <template slot="intergationERP" slot-scope="intergationERP">
        <a-tag :color="intergationERP.length > 5 ? 'pink' : 'green'">
          {{ intergationERP }}
        </a-tag>
      </template>

      <template slot="contractCheck" slot-scope="contractCheck">
        <a-tag :color="contractCheck.length > 5 ? 'pink' : 'green'">
          {{ contractCheck }}
        </a-tag>
      </template>
      <template slot="footer">
        <div>
          <a-pagination
            v-model="pagination.page"
            :page="pagination.page"
            show-size-changer
            show-quick-jumper
            :default-page="1"
            :total="pagination.total"
            @change="handlePageSizeChange"
          />
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
import data from "@/data/mock_data.json";
import ECM from "@/services/ecm";
// import { addTask } from "@/services/todolist";

export default {
  name: "TableField",
  props: {
    folderSelectd: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      data: null,
      columns: [
        {
          title: "STT",
          dataIndex: "stt",
          width: "60px",
          key: "stt",
          scopedSlots: { customRender: "stt" },
        },
        {
          title: "Mẫu hoá đơn",
          dataIndex: "invoice",
        },
        { title: "Ký hiệu hoá đơn", dataIndex: "symbolInvoice" },
        { title: "Ngày lập hoá đơn", dataIndex: "invoiceDate" },
        {
          title: "Tên người bán",
          dataIndex: "nameSeller",
          width: "200px",
        },
        { title: "Mã số thuế người bán", dataIndex: "taxCodeSeller" },
        { title: "Giá trị trước thuế", dataIndex: "preTax" },
        { title: "GTGT", dataIndex: "vat" },
        {
          title: "Tổng GT thanh toán",
          dataIndex: "totalPayment",
        },
        {
          title: "Trạng thái tích hợp ERP",
          dataIndex: "intergationERP",
          scopedSlots: { customRender: "intergationERP" },
        },
        {
          title: "Trạng thái kiểm tra hợp đồng",
          dataIndex: "contractCheck",
          scopedSlots: { customRender: "contractCheck" },
        },
      ],
      pagination: {
        current: 1,
        page: 1, // the page page number
        pageSize: 10, // the number of items per page
        total: 0, // the total number of items
      },
      // pagination: {
      //   ecm_path: "/",
      //   page: 1,
      //   page_size: 10,
      //   filter: "",
      // },
      selectedRowKeys: [],
    };
  },
  watch: {
    // folderSelectd: {
    //   handler(val) {
    //     this.pagination.ecm_path = val;
    //   },
    // },
    // pagination: {
    //   handler() {
    //     this.getDataTable();
    //   },
    //   deep: true,
    // },
    pagination: {
      handler(val) {
        console.log(val);
      },
      deep: true,
    },
  },
  mounted() {
    // this.getListFile();
    // this.getDataTable();
    this.data = data;
    this.pagination.total = this.data && this.data.length;
    this.addTodo();
  },
  methods: {
    addTodo() {
      const payload = {
        name: "abc",
        createBy: "trangntt",
        status: false,
        id: "4",
      };
      // addTask(payload)
      //   .then((res) => {
      //     console.log(res);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
      ECM.AddTask(payload)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getListFile() {
      await ECM.ListFile({ ecm_path: "" })
        .then((res) => {
          console.log("res", res);
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    async getDataTable() {
      await ECM.ListInvoice(this.pagination)
        .then((res) => {
          this.data = res.data;
          this.pagination.total = this.data && this.data.length;
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
      this.$emit("selectedRowKeys", selectedRowKeys);
    },
    handlePageSizeChange(page, pageSize) {
      console.log("page", page, "pageSize", pageSize);
      this.pagination.current = page;
      this.pagination.pageSize = pageSize;
    },
  },
};
</script>

<style lang="scss" scoped></style>
