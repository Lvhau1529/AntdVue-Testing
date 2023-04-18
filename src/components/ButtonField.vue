<template>
  <div>
    <a-button @click="handleClick" :type="type" :disabled="disabled">
      {{ title }}
    </a-button>
  </div>
</template>

<script>
export default {
  name: "ButtonField",
  props: {
    title: {
      type: String,
      default: "Truyền props title",
    },
    type: {
      type: String,
      default: "primary",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleClick() {
      this.$emit("clickBtn");
    },
  },
};
</script>

<style lang="scss" scoped></style>
