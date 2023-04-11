<template>
  <div class="wrapper">
    {{ result }}
    {{ value }}
    {{ selected }}
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

    <div class="box-header">
      <div class="box-header__left">
        <div>
          <a-tree-select
            v-model="value"
            style="min-width: 220px"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="Thư mục"
            allow-clear
          >
            <a-tree-select-node key="0-1" value="parent 1" title="parent 1">
              <a-tree-select-node
                key="0-1-1"
                value="parent 1-0"
                title="parent 1-0"
              >
                <a-tree-select-node
                  key="random"
                  :selectable="false"
                  value="leaf1"
                  title="my leaf"
                />
                <a-tree-select-node
                  key="random1"
                  value="leaf2"
                  title="your leaf"
                />
              </a-tree-select-node>
              <a-tree-select-node
                key="random2"
                value="parent 1-1"
                title="parent 1-1"
              >
                <a-tree-select-node key="random3" value="sss">
                  <b slot="title" style="color: #08c">sss</b>
                </a-tree-select-node>
              </a-tree-select-node>
            </a-tree-select-node>
          </a-tree-select>
        </div>
        <div>
          <SelectField
            placeholder="Trạng thái tích hợp ERP"
            :options="erpStatus"
            v-model="selected"
          />
        </div>
        <div>
          <SelectField
            placeholder="Trạng thái kiểm tra hoá đơn"
            :options="invoiceStatus"
            v-model="selected"
          />
        </div>
        <div>
          <a-input-search
            placeholder="Tìm kiếm"
            @search="onSearch"
            allowClear
          />
        </div>
      </div>
      <div class="box-header__right">
        <div>
          <a-button @click="handleOpenPopup('CheckVerify')" type="primary">
            Kiểm tra tính hợp lệ
          </a-button>
        </div>
        <div>
          <a-button type="primary" @click="handleOpenPopup('IntergationERP')">
            Tích hợp ERP
          </a-button>
        </div>
        <div>
          <a-button type="primary"> Xuất excel </a-button>
        </div>
      </div>
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
      <template slot-scope="text, record, index" slot="stt">
        <div style="text-align: center">
          {{ (pagination.current - 1) * pagination.pageSize + index + 1 }}
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
    <PopupCustom
      ref="PopupCustom"
      :content="modal.content"
      :sub-content="modal.subConent"
      :has-cancel="modal.hasCancel"
    />
  </div>
</template>

<script>
import data from "@/data/mock_data.json";
import PopupCustom from "@/components/PopupCustom.vue";
import { getProfile } from "@/services/index";
import SelectField from "@/components/SelectField.vue";

export default {
  name: "HelloWorld",
  components: {
    PopupCustom,
    SelectField,
  },
  data() {
    return {
      data: [],
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
          ellipsis: true,
          width: "200px",
        },
        { title: "Mã số thuế người bán", dataIndex: "taxCodeSeller" },
        { title: "Giá trị trước thuế", dataIndex: "preTax" },
        { title: "GTGT", dataIndex: "vat" },
        {
          title: "Tổng GT thanh toán",
          dataIndex: "totalPayment",
          ellipsis: true,
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
      selected: null,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      pagination: {
        current: 1, // the current page number
        pageSize: 10, // the number of items per page
        total: 0, // the total number of items
      },
      modal: {},
      result: null,
      value: null,
      erpStatus: [
        {
          value: "Đã tích hợp",
          label: "Đã tích hợp",
        },
        {
          value: "Chưa tích hợp",
          label: "Chưa tích hợp",
        },
      ],
      invoiceStatus: [
        {
          value: "Hợp lệ",
          label: "Hợp lệ",
        },
        {
          value: "Không hợp lệ",
          label: "Không hợp lệ",
        },
      ],
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
    async onSearch(search) {
      this.result = await getProfile(search);
    },
    handleOpenPopup(type) {
      switch (type) {
        case "CheckVerify":
          this.modal = {
            content: "Hoá đơn đã được tích hợp và nhập liệu trên hệ thống ERP",
            subConent: "Bạn vui lòng không tích hợp lại",
          };
          break;
        case "IntergationERP":
          this.modal = {
            content:
              "Bạn có chắc chắn muốn tích hợp hoá đơn lên hệ thống ERP không?",
            hasCancel: true,
          };
          break;

        default:
          break;
      }
      this.$nextTick(() => {
        this.$refs.PopupCustom.showModal();
      });
    },
  },
};
</script>

<style lang="scss">
.ant-table-footer {
  display: flex;
  justify-content: center;
  background: #fff;
}
</style>

<style lang="scss" scoped>
.wrapper {
  padding: 0 15px;
  .box-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    &__left {
      display: flex;
      div {
        margin-right: 8px;
      }
    }
    &__right {
      display: flex;
      div {
        margin-left: 8px;
      }
    }
  }
}
</style>
