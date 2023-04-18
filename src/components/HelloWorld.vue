<template>
  <div class="wrapper">
    {{ result }}
    {{ value }}
    {{ selected }}
    {{ folderSelected }}
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

    <div class="box-header">
      <div class="box-header__left">
        <div>
          <a-tree-select
            :tree-data="treeData"
            :dropdown-style="{ maxHeight: '400px' }"
            style="min-width: 220px"
            allow-clear
            placeholder="Thư mục"
            defaultValue="/"
            tree-default-expand-all
            :tree-icon="true"
            :tree-line="false"
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
          <a-button
            :disabled="!hasSelected"
            type="primary"
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
          <a-button type="primary"> Xuất excel </a-button>
        </div>
      </div>
    </div>
    <TableField
      :folderSelected="folderSelected"
      @selectedRowKeys="selectedRowKeys = $event"
    />
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
import list_folder from "@/data/list_folder.json";
import PopupCustom from "@/components/PopupCustom.vue";
import SelectField from "@/components/SelectField.vue";
import SearchField from "./SearchField.vue";
import TableField from "./TableField.vue";

export default {
  name: "HelloWorld",
  components: {
    PopupCustom,
    SelectField,
    SearchField,
    TableField,
  },
  data() {
    return {
      data: [],
      selected: null,
      folderSelected: "/",
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
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
          title: "/",
          value: "/",
          key: "1",
          children: [
            { title: "Bug tìm kiếm", value: "Bug tìm kiếm", key: "1-1" },
            { title: "Hồng share", value: "Hồng share", key: "1-2" },
          ],
        },
        // {
        //   title: "Node 2",
        //   value: "2",
        //   key: "2",
        //   children: [
        //     {
        //       title: "Child Node 2-1",
        //       value: "2-1",
        //       key: "2-1",
        //       children: [{ title: "Child Node 2-1-1", value: "2-1-1" }],
        //     },
        //     { title: "Child Node 2-2", value: "2-2", key: "2-2" },
        //   ],
        // },
        // Add more nodes as needed
      ],
    };
  },
  mounted() {
    // this.formatData();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  methods: {
    renderIcon(node) {
      console.log(node);
      return false;
      // if (node.isLeaf) {
      //   return <a-icon type="file" />;
      // }
      // return <a-icon type="folder" />;
    },
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

    onSearch(search) {
      console.log("search", search);
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
