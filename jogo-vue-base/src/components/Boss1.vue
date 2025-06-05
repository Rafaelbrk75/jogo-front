<template>
  <!-- Usa BossBase apenas para trocar o sprite -->
  <BossBase
    ref="bossBaseRef"
    :initialX="bossX"
    src1="/fase1/boss.png"
    src2="/fase1/boss2.png"
    @update:x="onUpdateX"
  />
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, nextTick } from "vue";
import BossBase from "./BossBase.vue";

const bossX = ref(0);
const bossBaseRef = ref(null);

const emit = defineEmits(["fire-power", "update:x"]);

function onUpdateX(novaX) {
  emit("update:x", novaX);
}

// Função para atualizar a posição do boss
function updateBossPosition() {
  // Aguarda a imagem carregar
  const img = bossBaseRef.value?.bossImg?.value;
  if (img && img.complete) {
    bossX.value = window.innerWidth - img.offsetWidth - 20;
  }
}

// Garante que o cálculo só ocorra após a imagem carregar
function onImgLoad() {
  updateBossPosition();
}

let fireInterval = null;

onMounted(async () => {
  await nextTick();
  const img = bossBaseRef.value?.bossImg?.value;
  if (img) {
    if (img.complete) {
      updateBossPosition();
    } else {
      img.addEventListener("load", onImgLoad);
    }
  }
  window.addEventListener("resize", updateBossPosition);
  fireInterval = setInterval(() => {
    emit("fire-power", {
      sprite: "/fase1/poder-binario.png",
      speed: 10,
    });
  }, 5000);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateBossPosition);
  const img = bossBaseRef.value?.bossImg?.value;
  if (img) {
    img.removeEventListener("load", onImgLoad);
  }
  if (fireInterval) {
    clearInterval(fireInterval);
    fireInterval = null;
  }
});
</script>
