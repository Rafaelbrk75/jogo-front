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
  startFiring();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateBossPosition);
  const img = bossBaseRef.value?.bossImg?.value;
  if (img) img.removeEventListener("load", onImgLoad);
  if (fireInterval) clearInterval(fireInterval);
});
</script>
