<script setup>
const props = defineProps({
  btnType: {
    type: String,
    default: "button",
  },
  size: String,
  color: String,
  content: String,
});
</script>

<template>
  <button :type="props.btnType" :class="[props.color, props.size]">
    {{ props.content }}
  </button>
</template>

<style scoped>
.big {
  width: 768px;
  height: 64px;
  font-size: 20px;
}
.middle {
  width: 356px;
  height: 56px;
  font-size: 40px;
}
.small {
  width: 93px;
  height: 38px;
  font-size: 20px;
}

.white {
  background-color: var(--personal-color-white);
  color: var(--personal-color-gray);
}
.blue {
  background-color: var(--personal-color-blue);
  color: var(--personal-color-white);
}
</style>
