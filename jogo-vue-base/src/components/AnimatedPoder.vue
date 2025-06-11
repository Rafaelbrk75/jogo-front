<template>
  <img
    :src="currentFrame"
    :style="{ left: x + 'px', bottom: y + 'px' }"
    class="poder"
  />
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  x: Number,
  y: Number,
  frames: Array,
  frameDelay: { type: Number, default: 100 },
});

const currentIndex = ref(0);

const currentFrame = computed(() => {
  return props.frames?.[currentIndex.value] || "";
});

let interval = null;

onMounted(() => {
  interval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % props.frames.length;
  }, props.frameDelay);
});

onBeforeUnmount(() => {
  clearInterval(interval);
});
</script>
