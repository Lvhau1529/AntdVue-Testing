<template>
  <div class="wrapper">
    <h2 style="font-weight: bold; font-size: 20px">
      Danh sách hóa đơn chứng từ sai lệch
    </h2>
    <div class="box-header">
      <div class="box-header__right">
        <div>
          <a-button type="primary" @click="handleOpenPopup">
            Di chuyển/ sao chép
          </a-button>
        </div>
        <div>
          <a-button type="primary" @click="handleSyncERP">
            Đồng bộ bảng kê ERP
          </a-button>
        </div>
      </div>
    </div>
    <PopupNotifcation ref="PopupNotifcation" @ok="handleOk" />
    <PopupUpload ref="PopupUpload" />
    aaa {{ selectedRowKeys }}
  </div>
</template>
<script>
import PopupNotifcation from "@/components/Popup/PopupNotifcation.vue";
import PopupUpload from "@/components/Popup/PopupUpload.vue";
import { mapState } from "vuex";
export default {
  name: "AboutView",
  components: {
    PopupNotifcation,
    PopupUpload,
  },
  data() {
    return {};
  },
  mounted() {
    console.log(this.selectedRowKeys);
    console.log(this.$store.state);
  },
  computed: {
    ...mapState("table", ["selectedRowKeys"]),
  },
  methods: {
    handleOk() {
      console.log("aaaa");
    },
    handleOpenPopup() {
      this.$nextTick(() => {
        this.$refs.PopupNotifcation.showModal();
      });
    },
    handleSyncERP() {
      this.$nextTick(() => {
        this.$refs.PopupUpload.showModal();
      });
    },
    handleChange(info) {
      console.log(info);
      // const status = info.file.status;
      // if (status !== "uploading") {
      //   console.log(info.file, info.fileList);
      // }
      // if (status === "done") {
      //   this.$message.success(`${info.file.name} file uploaded successfully.`);
      // } else if (status === "error") {
      //   this.$message.error(`${info.file.name} file upload failed.`);
      // }
    },
  },
};
</script>
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
