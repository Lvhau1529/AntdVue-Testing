<template>
  <div class="wrapper">
    <!-- {{ result }}
    {{ value }}
    {{ selected }}
    {{ folderSelected }}
    {{ selectedRowKeys }} -->
    <div class="box-header">
      <div class="box-header__left">
        <div>
          <a-tree-select
            :tree-data="treeData"
            :dropdown-style="{ maxHeight: '400px' }"
            style="min-width: 220px"
            placeholder="Thư mục"
            defaultValue="/"
            tree-default-expand-all
            @change="handleChange"
          >
          </a-tree-select>
        </div>
        <!-- <div>
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
        </div> -->
        <a-input-search
          placeholder="Tìm kiếm"
          :allowClear="true"
          @search="onSearch"
        />
      </div>
      <div class="box-header__right">
        <div>
          <a-button
            :disabled="!hasSelected"
            type="primary"
            :loading="loading"
            @click="handleOpenPopup('CheckVerify')"
          >
            Kiểm tra tính hợp lệ
          </a-button>
        </div>
        <div>
          <a-button
            disabled
            type="primary"
            @click="handleOpenPopup('IntergationERP')"
          >
            Tích hợp ERP
          </a-button>
        </div>
        <div>
          <a-button
            :loading="loadingExport"
            type="primary"
            @click="handleExport"
          >
            Xuất excel
          </a-button>
        </div>
      </div>
    </div>
    <TableField
      ref="TableField"
      :folderSelected="folderSelected"
      @checkVaildSuccess="handleCheckValidSuccess"
      @selectedRowKeys="selectedRowKeys = $event"
    />
    <PopupCustom
      ref="PopupCustom"
      :content="modal.content"
      :sub-content="modal.subConent"
      :note="modal.note"
      :has-cancel="modal.hasCancel"
      @ok="handleOk"
    />
  </div>
</template>

<script>
// import list_folder from "@/data/list_folder.json";
import PopupCustom from "@/components/PopupCustom.vue";
// import SelectField from "@/components/SelectField.vue";
import TableField from "@/components/TableField.vue";
import ECM from "@/services/ecm/index";

export default {
  name: "HomeView",
  components: {
    PopupCustom,
    // SelectField,
    TableField,
  },
  data() {
    return {
      data: [],
      selected: null,
      folderSelected: "/",
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      loadingExport: false,
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
      treeData: [],
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  methods: {
    async init() {
      const payload = {
        ecm_path: "",
      };
      await ECM.ListFile(payload)
        .then((res) => {
          this.handleListFolder(res.data.result);
        })
        .catch((err) => {
          this.$message.error(err.data.message);
        });
    },
    async handleExport() {
      this.loadingExport = true;
      await ECM.ExportFile({
        ecm_path: this.folderSelected,
      })
        .then((res) => {
          window.open(res.data, "_blank");
          this.loadingExport = false;
        })
        .catch((err) => {
          this.$message.error(
            err.response.data.message || "Có lỗi xảy ra, vui lòng thử lại sau"
          );
          this.loadingExport = false;
        });
    },
    handleListFolder(listFoler) {
      let result = [];
      for (const i of listFoler) {
        if (i.path === "" && i.type === "folder") {
          result.push({
            title: "/",
            value: "/",
            children: [],
          });
        }
        if (i.path && i.type === "folder") {
          result[0].children.push({
            title: i.path,
            value: i.path,
            children: [],
          });
        }
      }
      this.treeData = result;
      // return result;
    },
    onSearch(search) {
      console.log("search", search);
      this.$refs.TableField.pagination.filter = search;
    },
    handleOpenPopup(type) {
      switch (type) {
        case "CheckVerify":
          this.modal = {
            content:
              this.selectedRowKeys.length > 1
                ? "Bạn có chắc chắn muốn kiểm tra tính hợp lệ của các hoá đơn này không?"
                : "Bạn có chắc chắn muốn kiểm tra tính hợp lệ của hoá đơn này không?",
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
      this.folderSelected = value;
    },
    handleOk() {
      this.$nextTick(() => {
        this.$refs.TableField.handleCheckValidInvoice();
        this.loading = true;
        this.$refs.PopupCustom.visible = false;
        this.$refs.PopupCustom.loading = false;
      });
    },
    handleCheckValidSuccess() {
      this.loading = false;
      this.selectedRowKeys = [];
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
