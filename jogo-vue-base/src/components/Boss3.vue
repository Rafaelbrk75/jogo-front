<template>
  <!-- Usa BossBase apenas para trocar o sprite -->
  <BossBase
  ref="bossBaseRef"
    :initialX="bossX"
    src1="/fase3/boss.png"
    src2="/fase3/boss2.png"
    attackSrc="/fase3/bossatk.png"
    @update:x="onUpdateX"
  />
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, nextTick } from "vue";
import BossBase from "./BossBase.vue";

const bossX = ref(null);
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
    bossX.value = window.innerWidth - img.offsetWidth - 50;
  }
}

// Garante que o cálculo só ocorra após a imagem carregar
function onImgLoad() {
  updateBossPosition();
}

let fireInterval = null;

function startFiring() {
  fireInterval = setInterval(() => {
    // 1) Dispara a animação de ataque (troca de sprite)
    bossBaseRef.value?.triggerAttack();

    // 2) Emite o tiro para o pai gerar a “energiabola” na tela
    emit("fire-power", {
      sprite: "/fase1/poder-binario.png",
      speed: 7,
    });
  }, 2000);
}

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

  // Chame o startFiring para ativar o ataque + animação
  startFiring();
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

