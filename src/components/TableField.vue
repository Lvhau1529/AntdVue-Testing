<template>
  <div>
    <a-table
      ref="aTable"
      :loading="loading"
      :row-key="(record) => record.file_id"
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

      <template slot="ngay_lap_hoa_don" slot-scope="ngay_lap_hoa_don">
        <span>{{ ngay_lap_hoa_don | formatDate }}</span>
      </template>

      <template slot="tong_tien_khong_thue" slot-scope="tong_tien_khong_thue">
        <span>{{ tong_tien_khong_thue | formatMoney }}</span>
      </template>

      <template slot="tong_tien_thue" slot-scope="tong_tien_thue">
        <span>{{ tong_tien_thue | formatMoney }}</span>
      </template>

      <template slot="tong_gt_thanh_toan" slot-scope="tong_gt_thanh_toan">
        <span>{{ tong_gt_thanh_toan }}</span>
      </template>

      <template slot="trang_thai_ERP" slot-scope="trang_thai_ERP">
        <a-tag :color="trang_thai_ERP === 'Chưa tích hợp' ? 'pink' : 'green'">
          {{ trang_thai_ERP }}
        </a-tag>
      </template>

      <template slot="trang_thai_HD" slot-scope="file_id">
        <ItemInvoice
          ref="ItemInvoice"
          :fileId="file_id"
          :selectedRowKeys="selectedRowKeys"
          :reload="reloadCheck"
          @checkVaildSuccess="handleCheckValidSuccess"
        />
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
// import data from "@/data/mock_data.json";
import ECM from "@/services/ecm";
import ItemInvoice from "./ItemInvoice.vue";

export default {
  name: "TableField",
  props: {
    folderSelected: {
      type: String,
      default: "",
    },
  },
  components: {
    ItemInvoice,
  },
  data() {
    return {
      data: null,
      loading: true,
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
          dataIndex: "mau_hoa_don",
        },
        { title: "Ký hiệu hoá đơn", dataIndex: "ky_hieu_hoa_don" },
        {
          title: "Ngày lập hoá đơn",
          dataIndex: "ngay_lap_hoa_don",
          scopedSlots: { customRender: "ngay_lap_hoa_don" },
        },
        {
          title: "Tên người bán",
          dataIndex: "ten_nguoi_ban",
          width: "380px",
        },
        { title: "Mã số thuế người bán", dataIndex: "mst_nguoi_ban" },
        {
          title: "Giá trị trước thuế",
          dataIndex: "tong_tien_khong_thue",
          scopedSlots: { customRender: "tong_tien_khong_thue" },
        },
        {
          title: "GTGT",
          dataIndex: "tong_tien_thue",
          scopedSlots: { customRender: "tong_tien_thue" },
        },
        {
          title: "Tổng GT thanh toán",
          dataIndex: "tong_gt_thanh_toan",
          scopedSlots: { customRender: "tong_gt_thanh_toan" },
        },
        {
          title: "Trạng thái tích hợp ERP",
          dataIndex: "trang_thai_ERP",
          scopedSlots: { customRender: "trang_thai_ERP" },
        },
        {
          title: "Trạng thái kiểm tra hợp đồng",
          dataIndex: "trang_thai_HD",
          scopedSlots: { customRender: "trang_thai_HD" },
        },
      ],
      pagination: {
        current: 1,
        page: 1, // the page page number
        pageSize: 10, // the number of items per page
        total: 0, // the total number of items
        filter: "",
      },
      selectedRowKeys: [],
      listFileId: [],
      reloadCheck: false,
    };
  },
  watch: {
    folderSelected: {
      handler() {
        this.getDataTable();
      },
    },
    pagination: {
      handler() {
        this.getDataTable();
      },
      deep: true,
    },
  },
  mounted() {
    // this.getListFile();
    this.getDataTable();
    // this.data = data;
  },
  methods: {
    totalPayment(totalNoTax, totalTax) {
      const cal =
        parseFloat(Math.round(totalNoTax)) + parseFloat(Math.round(totalTax));
      return cal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    async getListFile() {
      await ECM.ListFile({ ecm_path: "" })
        .then((res) => {
          console.log("res", res);
        })
        .catch((err) => {
          this.$message.error(err.response.data.message);
        });
    },
    async getDataTable() {
      this.loading = true;
      let payload = {
        ecm_path: this.folderSelected,
        page: this.pagination.current,
        page_size: this.pagination.pageSize,
        filter: this.pagination.filter,
      };
      await ECM.ListInvoice(payload)
        .then((res) => {
          this.data = res?.data.details;
          // add col tong_gt_thanh_toan
          this.data.map((item) => {
            item.tong_gt_thanh_toan = this.totalPayment(
              item.tong_tien_khong_thue,
              item.tong_tien_thue
            );
            item.trang_thai_ERP = "Chưa tích hợp";
            item.trang_thai_HD = item.file_id;
          });
          this.pagination.total = res?.data?.details.length;
          this.loading = false;
          // this.data = res.data;
        })
        .catch((err) => {
          this.$message.error(err.response.data.message);
        });
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
      this.$emit("selectedRowKeys", selectedRowKeys);
    },
    handleCheckValidSuccess() {
      this.selectedRowKeys = [];
      this.$emit("checkVaildSuccess");
    },
    handleCheckValidInvoice() {
      console.log("aaaa");
      this.reloadCheck = !this.reloadCheck;
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
