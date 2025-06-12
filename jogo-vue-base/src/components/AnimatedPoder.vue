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
  frames: [Array, String], // <- aceita array ou string
  frameDelay: { type: Number, default: 100 },
});

const currentIndex = ref(0);

const normalizedFrames = computed(() => {
  return Array.isArray(props.frames) ? props.frames : [props.frames];
});

const currentFrame = computed(() => {
  return normalizedFrames.value[currentIndex.value] || "";
});

let interval = null;

onMounted(() => {
  interval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % normalizedFrames.value.length;
  }, props.frameDelay);
});

onBeforeUnmount(() => {
  clearInterval(interval);
});
</script>

<style scoped>
.poder {
  position: absolute;
  height: 80px;
  z-index: 2;
  image-rendering: pixelated;
}
</style>
