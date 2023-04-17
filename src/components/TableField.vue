<template>
  <div>
    <a-table
      ref="aTable"
      :loading="loading"
      :row-key="(record) => record.ecm_path"
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

      <!-- <template slot="intergationERP" slot-scope="intergationERP">
        <a-tag :color="intergationERP.length > 5 ? 'pink' : 'green'">
          {{ intergationERP }}
        </a-tag>
      </template>

      <template slot="contractCheck" slot-scope="contractCheck">
        <a-tag :color="contractCheck.length > 5 ? 'pink' : 'green'">
          {{ contractCheck }}
        </a-tag>
      </template> -->
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

export default {
  name: "TableField",
  props: {
    folderSelected: {
      type: String,
      default: "",
    },
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
          dataIndex: "ecm_path",
          ellipsis: true,
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
          width: "200px",
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
      selectedRowKeys: [],
    };
  },
  watch: {
    folderSelected: {
      handler() {
        this.getDataTable();
      },
    },
    // pagination: {
    //   handler() {
    //     console.log("bbbb");
    //     this.getDataTable();
    //   },
    //   deep: true,
    // },
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
          console.log("err", err);
        });
    },
    async getDataTable() {
      this.loading = true;
      let payload = {
        ecm_path: this.folderSelected,
        page: this.pagination.current,
        page_size: this.pagination.pageSize,
        filter: "",
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
          });
          this.pagination.total = res?.data?.details.length;
          this.loading = false;
          // this.data = res.data;
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
