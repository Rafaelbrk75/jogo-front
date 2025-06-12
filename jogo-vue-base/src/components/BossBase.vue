<template>
  <img
  ref="bossImg"
  :src="currentSprite"
  alt="Chefão"
  class="boss"
  :class="extraClass"
  :style="{ left: initialX + 'px', top: initialY + 'px', position: 'absolute' }"
/>

</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";

const props = defineProps({
  initialX: { type: Number, default: 1000 },
  initialY: { type: Number, default: 0 },
  src1: { type: String, required: true },
  src2: { type: String, required: true },
  attackSrc: { type: String, required: true },
  attackPrepSrc: { type: String, required: false },
  extraClass: {
  type: String,
  default: ""
}
});

const emit = defineEmits(["update:x"]);

const bossImg = ref(null);
const bossX = ref(props.initialX);

// Estado do sprite
const isAttacking = ref(false);
const idleFrame = ref(0);
let idleInterval = null;

const currentSprite = ref(props.src1);

// Animação idle
function startIdleAnimation() {
  if (idleInterval) return;

  idleFrame.value = 0;
  currentSprite.value = props.src1;

  idleInterval = setInterval(() => {
    idleFrame.value = idleFrame.value === 0 ? 1 : 0;
    currentSprite.value = idleFrame.value === 0 ? props.src1 : props.src2;
  }, 500);
}



// Trigger de ataque
function triggerAttack() {
  if (isAttacking.value) return;
  isAttacking.value = true;
  clearInterval(idleInterval);
  idleInterval = null;

  // Etapa 1: preparação
  currentSprite.value = props.attackPrepSrc || props.attackSrc;

  setTimeout(() => {
    // Etapa 2: ataque real
    currentSprite.value = props.attackSrc;

    setTimeout(() => {
      // Etapa 3: volta para idle
      isAttacking.value = false;
      currentSprite.value = props.src1;
      startIdleAnimation();
    }, 250); // tempo que o segundo frame fica visível
  }, 300); // tempo que o primeiro frame (preparação) fica visível
}

onMounted(() => {
  bossX.value = props.initialX;
  emit("update:x", bossX.value);
  startIdleAnimation();
});

onBeforeUnmount(() => {
  if (idleInterval) clearInterval(idleInterval);
});

defineExpose({
  bossImg,
  triggerAttack,
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
.boss3-ataque[src*="bossatk.png"] {
  transform: scale(1.6);
  transform-origin: bottom center;
}
</style>
