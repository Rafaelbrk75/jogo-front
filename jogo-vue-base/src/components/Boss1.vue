<template>
  <BossBase
    ref="bossBaseRef"
    :initialX="bossX"
    src1="/fase1/boss.png"
    src2="/fase1/boss2.png"
    attackSrc="/fase1/bossatk.png"
    @update:x="onUpdateX"
  />
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, nextTick } from "vue";
import BossBase from "./BossBase.vue";

const bossX = ref(window.innerWidth - 400); // valor inicial melhor que null
const bossBaseRef = ref(null);

const emit = defineEmits(["fire-power", "update:x"]);

function onUpdateX(novaX) {
  emit("update:x", novaX);
}

function updateBossPosition() {
  const img = bossBaseRef.value?.bossImg?.value;
  if (img && img.complete) {
    bossX.value = window.innerWidth - img.offsetWidth - 50;
    emit("update:x", bossX.value); // <-- isso aqui é ESSENCIAL
  }
}


function onImgLoad() {
  updateBossPosition();
}

let fireInterval = null;

function startFiring() {
  fireInterval = setInterval(() => {
    bossBaseRef.value?.triggerAttack();

    const deslocamentoX = 60; // Tente entre 30 e 60

    const posX = bossX.value - deslocamentoX; // Subtrai para jogar o poder pra esquerda do boss
    const posY = 90; // ou 380, 420, etc.

    console.log("🔥 Criando poder em:", posX, posY);
    // Emite o evento de disparo com os parâmetros corretos

    emit("fire-power", {
      frames: [
    "/fase1/poder-binario.png",
    "/fase1/poder-binario2.png",
    "/fase1/poder-binario3.png",
    "/fase1/poder-binario4.png",
  ],
  speed: 7,
  x: posX,
  y: posY
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
  startFiring();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateBossPosition);
  const img = bossBaseRef.value?.bossImg?.value;
  if (img) img.removeEventListener("load", onImgLoad);
  if (fireInterval) clearInterval(fireInterval);
});
</script>
