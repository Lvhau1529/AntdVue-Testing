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
        <div class="modal__header">
          <p>Thông báo</p>
        </div>
      </template>
      <div class="modal__content">
        <p>{{ content }}</p>
        <p v-if="subContent">{{ subContent }}</p>
        <p v-if="note" class="modal__content--note">
          <span style="color: red">Lưu ý</span>: {{ note }}
        </p>
      </div>
      <template slot="footer">
        <div class="modal__footer">
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
    note: {
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
.modal {
  &__header {
    text-align: center;
    p {
      font-size: 20px;
      margin: 0;
    }
  }
  &__content {
    text-align: center;
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
</style>
