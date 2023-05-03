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
          <p>Bạn vui lòng chọn file bảng kê ERP để đồng bộ dữ liệu</p>
        </div>
      </template>
      <div class="modal__content">
        <a-list
          v-if="fileList.length > 0"
          :class="{ 'custom__alist--error': errorMessage }"
          item-layout="horizontal"
          :data-source="fileList"
          :bordered="true"
        >
          <a-list-item
            class="custom-list-item"
            slot="renderItem"
            slot-scope="item"
          >
            <div>
              <a-icon
                style="margin-right: 10px; font-size: 20px"
                type="file-excel"
                theme="twoTone"
                two-tone-color="#52c41a"
              />
              <span>{{ item.name }}</span>
            </div>
            <div style="cursor: pointer">
              <a-icon
                type="delete"
                theme="twoTone"
                two-tone-color="#f5222d"
                @click="handleClearUpload"
              />
            </div>
          </a-list-item>
        </a-list>
        <a-upload-dragger
          name="file"
          :multiple="false"
          :before-upload="beforeUpload"
          :on-success="onSuccess"
          :on-error="onError"
          :showUploadList="false"
        >
          <p class="ant-upload-drag-icon">
            <a-icon type="cloud-upload" />
          </p>
          <p class="ant-upload-text">Upload file</p>
          <transition name="fade">
            <p v-if="errorMessage" class="upload-error">
              File của bạn không hợp lệ, vui lòng upload đúng định dạng excel
            </p>
          </transition>
        </a-upload-dragger>
      </div>
      <template slot="footer">
        <div class="modal__footer">
          <a-button @click="handleOk" type="primary" :loading="loading"
            >Xác nhận</a-button
          >
          <a-button @click="handleCancel">Huỷ</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "PopupUpload",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      fileList: [],
      visible: false,
      loading: false,
      errorMessage: false,
    };
  },
  mounted() {
    console.log("aaaaa");
  },
  methods: {
    handleClearUpload() {
      this.errorMessage = false;
      this.fileList = [];
    },
    beforeUpload(file, fileList) {
      const fileType = file.type;
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      const isValidType = validTypes.includes(fileType);
      if (!isValidType) {
        this.errorMessage = true;
        // this.$notification["error"]({
        //   message: "Sai định dạng file",
        //   description: "Bạn chỉ có thể upload file Excel",
        //   onClick: () => {
        //     console.log("Notification Clicked!");
        //   },
        // });
      }
      this.fileList = fileList;
      return isValidType;
    },
    // onSuccess(response, file) {
    //   // Handle the successful upload
    // },
    // onError(error, response, file) {
    //   // Handle the upload error
    // },
    showModal() {
      this.visible = true;
    },
    handleOk() {
      this.loading = true;
      this.$emit("ok");
    },
    handleCancel() {
      this.destroyAll();
    },
    destroyAll() {
      console.log("asfjasjf");
      this.visible = false;
      this.$destroyAll();
    },
  },
};
</script>
<style lang="scss">
.ant-modal-footer {
  border-top: none !important;
}
.ant-upload-drag-icon {
  margin-bottom: 5px !important;
}
</style>

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
    justify-content: center;

    button:last-child {
      margin-left: 10px;
    }
  }
}

.modal__content {
  > div:not(:last-child) {
    margin-bottom: 10px;
  }

  .detail-notif {
    display: flex;
    align-items: center;

    i {
      font-size: 18px;
      margin-right: 8px;
    }

    .error_detail {
      font-weight: normal;
      text-decoration: underline;
      cursor: pointer;
      color: rgba(0, 0, 0, 0.5);
    }
  }
}
.custom__alist--error {
  border-color: #fb0808;
  .custom-list-item {
    align-items: center;
    justify-content: space-between;
  }
}
.upload-error {
  font-weight: normal;
  color: #fb0808;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
