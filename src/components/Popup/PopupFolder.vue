<template>
  <div v-if="visible" class="wrapper-modal">
    <a-modal
      v-model="visible"
      centered
      :maskClosable="false"
      :confirm-loading="loading"
      :width="540"
      :destroyOnClose="true"
      :visible.sync="visible"
      @on-visible-change="destroyAll"
      class="custom-modal"
    >
      <template slot="title">
        <div class="modal__header">
          <p>Chọn thư mục đích</p>
        </div>
      </template>
      <div class="modal__content">
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <BreadcrumbField
            :breadcrumb-data="treeData"
            :selected-value="selectFolder"
          />
          <a-icon style="margin-bottom: 11px" type="appstore" theme="filled" />
        </div>
        <a-table
          :customRow="customRow"
          :columns="columns"
          :data-source="showData"
          :pagination="false"
          :scroll="{ y: 400 }"
          @row-click="handleRowClick"
        >
          <template slot="folder">
            <a-icon style="font-size: 25px" type="folder" theme="twoTone" />
          </template>
        </a-table>
      </div>
      <template slot="footer">
        <div class="modal__footer">
          <a-button @click="handleOk" :loading="loading">Sao chép</a-button>
          <a-button type="primary" @click="handleCancel">Chuyển</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
import list_folder from "@/data/list_folder.json";
import { mapState } from "vuex";
export default {
  name: "PopupFolder",
  data() {
    return {
      visible: false,
      loading: false,
      data: list_folder.result,
      showData: [],
      columns: [
        {
          title: "",
          dataIndex: "folder",
          width: "40px",
          scopedSlots: { customRender: "folder" },
        },
        {
          title: "Tên",
          dataIndex: "path",
          width: "250px",
        },
        {
          title: "Kích cỡ",
        },
        {
          title: "Thay đổi",
        },
      ],
    };
  },
  created() {
    this.showData = this.data.filter((item) => item.type === "folder");
  },
  computed: {
    ...mapState({
      folderSelected: (state) => state.global.folderSelected,
      treeData: (state) => state.global.treeData,
    }),
    selectFolder: {
      get() {
        return this.folderSelected;
      },
      set(value) {
        this.setFolderSelected(value);
      },
    },
  },
  methods: {
    customRow(record) {
      return {
        on: {
          click: () => {
            console.log(record);
          },
        },
      };
    },
    handleOk() {},
    showModal() {
      this.visible = true;
    },
    handleCancel() {
      this.destroyAll();
    },
    destroyAll() {
      this.visible = false;
      this.$destroyAll();
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  &__header {
    p {
      font-size: 19px;
      margin: 0;
    }
  }

  &__content {
    font-weight: 500;

    p {
      margin: 0;
    }

    &--note {
      font-style: italic;
    }
  }

  &__footer {
    display: flex;
    justify-content: flex-end;

    button:last-child {
      margin-left: 10px;
    }
  }
}
::v-deep .ant-table-thead > tr > th,
::v-deep .ant-table-tbody > tr > td {
  padding: 10px;
}
</style>
