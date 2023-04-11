<template>
  <div>
    {{ selectedRowKeys }}
    <div style="margin-bottom: 16px">
      <a-button
        type="primary"
        :disabled="!hasSelected"
        :loading="loading"
        @click="start"
      >
        Reload
      </a-button>
      <span style="margin-left: 8px">
        <template v-if="hasSelected">
          {{ `Selected ${selectedRowKeys.length} items` }}
        </template>
      </span>
    </div>
    <a-table
      ref="aTable"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
      :columns="columns"
      :data-source="data"
      :pagination="pagination"
    >
      <span slot="intergationERP" slot-scope="intergationERP">
        <a-tag
          :color="
            intergationERP === 'loser'
              ? 'volcano'
              : intergationERP.length > 5
              ? 'geekblue'
              : 'green'
          "
        >
          {{ intergationERP }}
        </a-tag>
      </span>
      <span slot="contractCheck" slot-scope="contractCheck">
        <a-tag
          :color="
            contractCheck === 'loser'
              ? 'green'
              : contractCheck.length > 5
              ? 'geekblue'
              : 'volcano'
          "
        >
          {{ contractCheck }}
        </a-tag>
      </span>
      <template slot="footer">
        <div>
          <a-pagination
            v-model="pagination.current"
            :current="pagination.current"
            show-size-changer
            show-quick-jumper
            :default-current="1"
            :total="pagination.total"
            @showSizeChange="handlePageSizeChange"
          />
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
import data from "@/data/mock_data.json";
// const columns = [
//   {
//     title: "Name",
//     dataIndex: "name",
//   },
//   {
//     title: "Age",
//     dataIndex: "age",
//   },
//   {
//     title: "Address",
//     dataIndex: "address",
//   },
// ];

// const data = [];
// for (let i = 0; i < 46; i++) {
//   data.push({
//     key: i,
//     name: `Edward King ${i}`,
//     age: 32,
//     address: `London, Park Lane no. ${i}`,
//   });
// }

export default {
  name: "HelloWorld",
  data() {
    return {
      data: [],
      columns: [
        {
          title: "STT",
          dataIndex: "key",
          key: "key",
          customRender: (text, record, index) => {
            return (
              (this.pagination.current - 1) * this.pagination.pageSize +
              index +
              1
            );
          },
        },
        {
          title: "Mẫu hoá đơn",
          dataIndex: "invoice",
        },
        { title: "Ký hiệu hoá đơn", dataIndex: "symbolInvoice" },
        { title: "Ngày lập hoá đơn", dataIndex: "invoiceDate" },
        { title: "Tên người bán", dataIndex: "nameSeller" },
        { title: "Mã số thuế người bán", dataIndex: "taxCodeSeller" },
        { title: "Giá trị trước thuế", dataIndex: "preTax" },
        { title: "GTGT", dataIndex: "vat" },
        { title: "Tổng GT thanh toán", dataIndex: "totalPayment" },
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
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      pagination: {
        current: 1, // the current page number
        pageSize: 10, // the number of items per page
        total: 0, // the total number of items
      },
    };
  },
  mounted() {
    this.data = data;
    this.pagination.total = this.data && this.data.length;
    this.$nextTick(() => {
      console.log(this.$refs.aTable);
    });
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  methods: {
    start() {
      this.loading = true;
      // ajax request after empty completing
      setTimeout(() => {
        this.loading = false;
        this.selectedRowKeys = [];
      }, 1000);
    },
    onSelectChange(selectedRowKeys) {
      // eslint-disable-next-line no-console
      console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    handlePageSizeChange(current, pageSize) {
      console.log(current, pageSize);
      this.pagination.pageSize = pageSize;
    },
  },
};
</script>

<style lang="scss" scoped></style>
