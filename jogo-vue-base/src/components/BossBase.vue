<template>
  <img
    :src="currentSprite"
    alt="Chefão"
    class="boss"
    :style="{ left: bossX + 'px' }"
  />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

// Props comuns a todos os bosses (posição X inicial e dois sprites para animação)
const props = defineProps({
  initialX: {
    type: Number,
    default: 1000,
  },
  src1: {
    type: String,
    required: true,
  },
  src2: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:x"]);

// posição fixa em X (não se move)
const bossX = ref(props.initialX);
const currentSprite = ref(props.src1);

let spriteInterval = null;

onMounted(() => {
  // Alterna entre src1 e src2 a cada 300ms
  spriteInterval = setInterval(() => {
    currentSprite.value =
      currentSprite.value === props.src1 ? props.src2 : props.src1;
  }, 300);
  // Logo ao montar, já informamos a posição X inicial para o pai (caso queira)
  emit("update:x", bossX.value);
});

onBeforeUnmount(() => {
  if (spriteInterval) {
    clearInterval(spriteInterval);
    spriteInterval = null;
  }
});
</script>

<style scoped>
.boss {
  position: absolute;
  bottom: 0px; /* ajuste conforme necessário para alinhar ao chão */
  width: 350px; /* ajuste conforme desejar */
  transition: left 0.2s;
  z-index: 2;
  image-rendering: pixelated;
}
</style>
