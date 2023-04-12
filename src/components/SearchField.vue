<template>
  <div>
    <a-input-search
      :placeholder="placeholder"
      @search="handleSearch"
      allowClear
    />
  </div>
</template>

<script>
export default {
  name: "SearchField",
  props: {
    placeholder: {
      type: String,
      default: "Tìm kiếm",
    },
  },
  methods: {
    handleSearch(e) {
      this.$emit("search", e);
    },
  },
};
</script>

<style lang="scss" scoped></style>
