<template>
  <div class="wrapper">
    <!-- {{ result }}
    {{ value }}
    {{ selected }}
    {{ folderSelected }}
    {{ selectedRowKeys }} -->
    <h2 style="font-weight: bold; font-size: 20px">Danh sách chứng từ</h2>
    <p v-if="!folderSelected && !search">
      Bạn vui lòng chọn danh sách chứng từ
    </p>
    <p v-else>
      Bạn có thể chọn danh sách những chứng từ nhập liệu ERP hoặc chọn danh sách
      những chứng từ cần kiểm tra tính hợp lệ
    </p>
    <div class="box-header">
      <div class="box-header__left">
        <div>
          <a-tree-select
            allowClear
            :tree-data="treeData"
            :dropdown-style="{ maxHeight: '400px' }"
            style="min-width: 220px; cursor: pointer"
            placeholder="Thư mục"
            defaultValue=""
            tree-default-expand-all
            v-model="folderSelected"
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
      <div v-if="folderSelected || search" class="box-header__right">
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
      v-show="folderSelected || search"
      ref="TableField"
      :folderSelected="folderSelected"
      @checkVaildSuccess="handleCheckValidSuccess"
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
// import SelectField from "@/components/SelectField.vue";
import { mapState, mapActions } from "vuex";
import PopupCustom from "@/components/PopupCustom.vue";
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
      folderSelected: "",
      loading: false,
      loadingExport: false,
      modal: {},
      result: null,
      value: null,
      search: "",
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
  watch: {
    folderSelected: {
      handler() {
        this.setSelectedRowKeys([]);
      },
    },
  },
  mounted() {
    this.init();
  },
  computed: {
    ...mapState({
      selectedRowKeys: (state) => state.selectedRowKeys,
    }),
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  methods: {
    ...mapActions(["setSelectedRowKeys"]),
    async init() {
      const payload = {
        ecm_path: "",
      };
      await ECM.ListFile(payload)
        .then((res) => {
          const listFolder = this.handleListFolder(res.data.result);
          this.treeData = [this.transformData(listFolder[0].children)];
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
    transformData(data) {
      const root = { title: "/", value: "/", children: [] };
      const map = { "/": root };

      data.forEach(({ value, children }) => {
        const nodes = value.split("/");
        let parent = root;
        let path = "";
        nodes.forEach((node) => {
          if (node !== "") {
            path += node + "/";
            if (!map[path]) {
              const newFolder = {
                title: node,
                value: path,
                children: [],
              };
              map[path] = newFolder;
              parent.children.push(newFolder);
            }
            parent = map[path];
          }
        });
        parent.children = [...parent.children, ...children];
      });
      return root;
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
      return result;
    },
    onSearch(search) {
      this.search = search;
      this.$nextTick(() => {
        this.$refs.TableField.pagination.filter = this.search;
      });
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
  padding: 0 25px;
  width: 100%;
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
