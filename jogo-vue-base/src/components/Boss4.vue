<template>
  <!-- Usa BossBase apenas para trocar o sprite -->
  <BossBase :initialX="initialX" src1="/fase4/boss.png" src2="/fase4/boss2.png" @update:x="onUpdateX" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import BossBase from "./BossBase.vue";

const props = defineProps({
  initialX: { type: Number, default: 1000 },
});

// Emitiremos “fire-power” para o GameTemplate.vue quando for a hora
const emit = defineEmits(["fire-power", "update:x"]);

// Encaminha o update:x para o pai
function onUpdateX(novaX) {
  emit("update:x", novaX);
}

// Cada 5s, emitemos o evento “fire-power” com os dados desta fase
let fireInterval = null;
onMounted(() => {
  fireInterval = setInterval(() => {
    // sprite do poder desta fase + velocidade
    emit("fire-power", {
      sprite: "/fase1/poder-binario.png",
      speed: 10,
    });
  }, 5000);
});

onBeforeUnmount(() => {
  if (fireInterval) {
    clearInterval(fireInterval);
    fireInterval = null;
  }
});
</script>
