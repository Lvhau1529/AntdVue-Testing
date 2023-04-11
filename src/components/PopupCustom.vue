<template>
  <div class="wrapper-modal">
    <a-modal
      class="custom-modal"
      v-model="visible"
      centered
      :maskClosable="false"
      :confirm-loading="loading"
    >
      <template slot="title">
        <div class="modal-header">
          <p>Thông báo</p>
        </div>
      </template>
      <div class="modal-content">
        <p>{{ content }}</p>
        <p v-if="subContent">{{ subContent }}</p>
      </div>
      <template slot="footer">
        <div class="modal-footer">
          <a-button @click="handleOk" type="primary" :loading="loading"
            >Xác nhận</a-button
          >
          <a-button v-if="hasCancel" @click="handleCancel">Huỷ</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "PopupCustom",
  props: {
    content: {
      type: String,
      default: "Truyền props content",
      required: true,
    },
    subContent: {
      type: String,
      default: "",
    },
    hasCancel: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      visible: false,
      loading: false,
    };
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    handleOk() {
      this.loading = true;
      setTimeout(() => {
        this.visible = false;
        this.loading = false;
      }, 2000);
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
<style lang="scss">
.ant-modal-footer {
  border-top: none !important;
}
</style>

<style lang="scss" scoped>
.modal-header {
  text-align: center;
  p {
    font-size: 20px;
    margin: 0;
  }
}
.modal-content {
  text-align: center;
  font-weight: 500;
  p {
    margin: 0;
  }
}
.modal-footer {
  display: flex;
  justify-content: center;
  button:last-child {
    margin-left: 10px;
  }
}
</style>
