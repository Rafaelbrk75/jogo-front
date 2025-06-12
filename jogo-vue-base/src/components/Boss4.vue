<template>
  <BossBase
    ref="bossBaseRef"
    :initialX="bossX"
    :initialY="bossY"
    src1="/fase4/boss.png"
    src2="/fase4/boss2.png"
    attackSrc="/fase4/bossatk.png"
    @update:x="onUpdateX"
    :style="{ position: 'absolute', top: bossY - 15 + '%', left: bossX + '%' }"
  />
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, nextTick } from "vue";
import BossBase from "./BossBase.vue";

const emit = defineEmits(["fire-power", "update:x", "update:y"]);

const bossX = ref(79.8);
const bossY = ref(30);
const bossBaseRef = ref(null);

let fireInterval = null;
let teleportInterval = null;

function onUpdateX(novaX) {
  emit("update:x", novaX);
}

function updateBossPosition() {
  const img = bossBaseRef.value?.getBossImg?.()?.value;
  if (img && img.complete) {
    bossX.value = 79.8;
    emit("update:x", bossX.value);
  }
}

function handleImgLoad() {
  console.log("📦 Boss4 imagem carregada!");
  updateBossPosition();
  startFiring();
  startTeleporting();
}

function startFiring() {
  let contador = 0;
  if (fireInterval) clearInterval(fireInterval);

  fireInterval = setInterval(() => {
    bossBaseRef.value?.triggerAttack();
    console.log("🔥 Disparo Boss 4 em x =", bossX.value);

    contador++;

    const frames = "/fase4/poder_roxo.png";

    const basePayload = { frames, x: bossX.value, y: bossY.value };

    if (contador % 10 === 0) {
      emit("fire-power", { ...basePayload, speed: 2 });
      emit("fire-power", { ...basePayload, speed: 4 });
      emit("fire-power", { ...basePayload, speed: 6 });
    } else {
      emit("fire-power", { ...basePayload, speed: 2 });
    }
  }, 1200);
}

function startTeleporting() {
  console.log("🌀 Boss4 começou a teleportar!");
  const larguraBoss = 3;
  const alturaBoss = 3;
  const margem = 5;

  const somTeleporte = new Audio("/fase4/teleport.mp3");
  somTeleporte.volume = 1.0;

  teleportInterval = setInterval(() => {
    const novaX = Math.max(0, Math.min(100 - larguraBoss - margem, Math.random() * 100));
    const novaY = Math.max(0, Math.min(100 - alturaBoss - 45, Math.random() * 100));

    const img = bossBaseRef.value?.bossImg?.value || bossBaseRef.value?.getBossImg?.().value;
    if (img) {
      img.style.opacity = 0;
      setTimeout(() => {
        bossX.value = novaX;
        bossY.value = novaY;
        emit("update:x", bossX.value);
        emit("update:y", bossY.value);
        img.style.opacity = 1;
      }, 300);
    } else {
      bossX.value = novaX;
      bossY.value = novaY;
      emit("update:x", bossX.value);
      emit("update:y", bossY.value);
    }

    somTeleporte.currentTime = 0;
    somTeleporte.play().catch(() => {});
    console.log("🌀 Teleportando boss para:", novaX, novaY);
  }, 3000);
}

onMounted(async () => {
  await nextTick();

  setTimeout(() => {
  const imgRef = bossBaseRef.value?.getBossImg?.();
  const img = imgRef?.value;

  if (img) {
    console.log("✅ Imagem do boss encontrada:", img);
    if (img.complete) {
      handleImgLoad();
    } else {
      img.addEventListener("load", handleImgLoad);
    }
  }
}, 100);

});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateBossPosition);
  const img = bossBaseRef.value?.bossImg?.value || bossBaseRef.value?.getBossImg?.().value;
  if (img) img.removeEventListener("load", handleImgLoad);
  clearInterval(fireInterval);
  clearInterval(teleportInterval);
});

</script>

<style scoped>
.boss.boss4 {
  position: absolute !important;
}
</style>
