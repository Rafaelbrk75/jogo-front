<template>
  <BossBase
    ref="bossBaseRef"
    :initialX="bossX"
    :initialY="bossY"
    src1="/fase1/boss.png"
    src2="/fase1/boss2.png"
    attackSrc="/fase1/bossatk.png"
    @update:x="onUpdateX"
  />
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, nextTick } from "vue";
import BossBase from "./BossBase.vue";

const bossX = 79.8; // valor inicial melhor que null
const bossY = 64; // valor inicial do y do boss
const bossBaseRef = ref(null);

const emit = defineEmits(["fire-power", "update:x"]);

function onUpdateX(novaX) {
  emit("update:x", novaX);
}

function updateBossPosition() {
  const img = bossBaseRef.value?.bossImg?.value;
  if (img && img.complete) {
    bossX.value = 79.8;
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

    const posX = bossX.value;
    const posY = bossY + 15;

    console.log("🔥 Criando poder em:", posX, posY);
    // Emite o evento de disparo com os parâmetros corretos

    emit("fire-power", {
      frames: [
    "/fase1/poder-binario.png",
    "/fase1/poder-binario2.png",
    "/fase1/poder-binario3.png",
    "/fase1/poder-binario4.png",
  ],
  speed: 1,
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
