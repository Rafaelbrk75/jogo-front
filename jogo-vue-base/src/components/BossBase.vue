<template>
  <img
  ref="bossImg"
  :src="currentSprite"
  alt="Chefão"
  class="boss"
  :style="{ left: bossX + 'px', position: 'absolute' }"
/>

</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";

const props = defineProps({
  initialX: { type: Number, default: 1000 },
  initialY: { type: Number, default: 0 },
  src1: { type: String, required: true },
  src2: { type: String, required: true },
  src3: { type: String, required: true },
  src4: { type: String, required: true },
  attackSrc: { type: String, required: true },
});

const emit = defineEmits(["update:x"]);

const bossImg = ref(null);
const bossX = ref(props.initialX);

// Estado do sprite
const isAttacking = ref(false);
const idleFrame = ref(0);
let idleInterval = null;

const currentSprite = computed(() =>
  isAttacking.value ? props.attackSrc : (idleFrame.value === 0 ? props.src1 : props.src2)
);

// Animação idle
function startIdleAnimation() {
  if (idleInterval) return;
  idleInterval = setInterval(() => {
    idleFrame.value = idleFrame.value === 0 ? 1 : 0;
  }, 500);
}


// Trigger de ataque
function triggerAttack() {
  if (isAttacking.value) return;
  isAttacking.value = true;
  clearInterval(idleInterval);
  idleInterval = null;

  setTimeout(() => {
    isAttacking.value = false;
    startIdleAnimation();
  }, 300);
}

onMounted(() => {
  bossX.value = props.initialX;
  emit("update:x", bossX.value);
  

  startIdleAnimation();
});

onBeforeUnmount(() => {
  console.log("🔧 BossBase montado!", bossImg.value);
  if (idleInterval) clearInterval(idleInterval);
});

defineExpose({
  bossImg,
  getBossImg: () => bossImg,
  triggerAttack
});

</script>

<style scoped>
.boss {
  position: absolute;
  bottom: 0px;
  width: 18vw;
  min-width: 350px;
  max-width: 600px;
  transition: left 0.2s;
  z-index: 2;
  image-rendering: pixelated;
}
</style>
