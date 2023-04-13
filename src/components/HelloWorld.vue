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
            :tree-data="treeData"
            :show-search="true"
            :dropdown-style="{ maxHeight: '400px' }"
            style="width: 300px"
            allow-clear
            placeholder="Please select"
            @change="handleChange"
          >
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
        <SearchField @search="onSearch" />
      </div>
      <div class="box-header__right">
        <div>
          <ButtonField
            title="Kiểm tra tính hợp lệ"
            @clickBtn="handleOpenPopup('CheckVerify')"
          />
          <!-- <a-button @click="handleOpenPopup('CheckVerify')" type="primary">
            Kiểm tra tính hợp lệ
          </a-button> -->
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
      :note="modal.note"
      :has-cancel="modal.hasCancel"
    />
  </div>
</template>

<script>
import data from "@/data/mock_data.json";
import list_folder from "@/data/list_folder.json";
import PopupCustom from "@/components/PopupCustom.vue";
import WeatherService from "@/services/index";
import SelectField from "@/components/SelectField.vue";
import ButtonField from "@/components/ButtonField.vue";
import SearchField from "./SearchField.vue";

export default {
  name: "HelloWorld",
  components: {
    PopupCustom,
    SelectField,
    ButtonField,
    SearchField,
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
      treeData: [
        {
          title: "Node 1",
          value: "1",
          key: "1",
          children: [
            { title: "Child Node 1-1", value: "1-1", key: "1-1" },
            { title: "Child Node 1-2", value: "1-2", key: "1-2" },
          ],
        },
        {
          title: "Node 2",
          value: "2",
          key: "2",
          children: [
            {
              title: "Child Node 2-1",
              value: "2-1",
              key: "2-1",
              children: [{ title: "Child Node 2-1-1", value: "2-1-1" }],
            },
            { title: "Child Node 2-2", value: "2-2", key: "2-2" },
          ],
        },
        // Add more nodes as needed
      ],
    };
  },
  mounted() {
    this.data = data;
    this.formatData();
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
    formatData() {
      let folderName = "";
      let itemTree = {
        title: "",
        value: "",
        children: [],
      };
      let dataTree = list_folder.result;
      this.treeData = dataTree.filter((item) => {
        console.log(item);
        if (item.type === "folder") {
          folderName = item.path;
          itemTree = {
            title: item.path,
            value: item.file_id,
            children: [],
          };
          return itemTree;
        }
        if (
          item.type === "file" &&
          folderName &&
          item.path.includes(folderName)
        ) {
          itemTree.children.push({
            title: item.path.replace(folderName, ""),
            value: item.file_id,
          });
          return itemTree;
        }
        console.log(itemTree);
        return false;
      });
      console.log("this.treeData", this.treeData);
    },
    // formatItem(item) {
    //   let
    // },
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
      await WeatherService.searchByCity(search)
        .then((res) => {
          this.result = res;
        })
        .catch((err) => {
          console.log("Loi roi", err);
        });
    },
    handleOpenPopup(type) {
      switch (type) {
        case "CheckVerify":
          this.modal = {
            content: "Hoá đơn đã được tích hợp và nhập liệu trên hệ thống ERP",
            subConent: "Bạn vui lòng không tích hợp lại",
            hasCancel: false,
          };
          break;
        case "IntergationERP":
          this.modal = {
            content:
              "Bạn có chắc chắn muốn tích hợp hoá đơn lên hệ thống ERP không?",
            note: "Không nhập liệu hoá đơn đã được tích hợp lên hệ thống",
          };
          break;

        default:
          break;
      }
      this.$nextTick(() => {
        this.$refs.PopupCustom.showModal();
      });
    },
    handleChange(value) {
      console.log(value);
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
