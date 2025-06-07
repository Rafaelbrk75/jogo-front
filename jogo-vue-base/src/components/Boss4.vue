<template>
  <!-- Usa BossBase apenas para trocar o sprite -->
  <BossBase
  ref="bossBaseRef"
  :initialX="bossX"
  src1="/fase4/boss.png"
  src2="/fase4/boss2.png"
  attackSrc="/fase4/bossatk.png"
  @update:x="onUpdateX"
  :style="{ top: bossY + 'px', left: bossX + 'px', position: 'absolute' }"
/>

</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, nextTick } from "vue";
import BossBase from "./BossBase.vue";

const bossX = ref(window.innerWidth - 400); // valor inicial
const bossBaseRef = ref(null);
const emit = defineEmits(["fire-power", "update:x"]);
const bossY = ref(300); // altura inicial personalizada


function onUpdateX(novaX) {
  emit("update:x", novaX);
}

function updateBossPosition() {
  const img = bossBaseRef.value?.bossImg?.value;
  if (img && img.complete) {
    bossX.value = window.innerWidth - img.offsetWidth - 50;
    emit("update:x", bossX.value);
  }
}

function handleImgLoad() {
  updateBossPosition();
  startFiring();
  startTeleporting(); // ✅ Isso agora está certo
}


let fireInterval = null;

function startFiring() {
  let contador = 0;
  fireInterval = setInterval(() => {
    bossBaseRef.value?.triggerAttack();
    console.log("🔥 Disparo Boss 4 em x =", bossX.value);

    contador++;
    if (contador % 3 === 0) {
      // 🔥 Rajada difícil
      emit("fire-power", {
        sprite: "/fase4/poder-binario.png",
        speed: 10,
        x: bossX.value,
        y: bossY.value
      });
      emit("fire-power", {
        sprite: "/fase4/poder-binario.png",
        speed: 7,
        x: bossX.value,
        y: bossY.value
      });
      emit("fire-power", {
        sprite: "/fase4/poder-binario.png",
        speed: 12,
        x: bossX.value,
        y: bossY.value
      });
    } else {
      // 🔥 Tiro simples
      emit("fire-power", {
        sprite: "/fase4/poder-binario.png",
        speed: 9,
        x: bossX.value,
        y: bossY.value
      });
    }
  }, 1200); // mais rápido
}

function startTeleporting() {
  const larguraBoss = 350; // ajuste conforme necessário
  const alturaBoss = 350;
  const margem = 100;

  const somTeleporte = new Audio("/fase4/teleport.mp3"); // 🔊 som do teleporte
  somTeleporte.volume = 1.0;

  setInterval(() => {
    const novaX = Math.floor(
      Math.random() * (window.innerWidth - larguraBoss - margem)
    ) + margem;

    const novaY = Math.floor(
      Math.random() * (window.innerHeight - alturaBoss - 200)
    ) + 100;

    bossX.value = novaX;
    bossY.value = novaY;
    emit("update:x", bossX.value);

    somTeleporte.currentTime = 0;
    somTeleporte.play().catch(() => {});

    console.log("🌀 Teleportando boss para:", novaX, novaY);
  }, 3000);
}

onMounted(async () => {
  await nextTick();
  const img = bossBaseRef.value?.bossImg?.value;

  if (img) {
    img.addEventListener("load", handleImgLoad);

    // ✅ Garante chamada mesmo se já tiver carregado
    if (img.complete) {
      handleImgLoad();
    }
  }

  window.addEventListener("resize", updateBossPosition);
});


onBeforeUnmount(() => {
  window.removeEventListener("resize", updateBossPosition);
  const img = bossBaseRef.value?.bossImg?.value;
  if (img) img.removeEventListener("load", handleImgLoad);
  if (fireInterval) clearInterval(fireInterval);
});
</script>

<style scoped>
.boss.boss4 {
  position: absolute !important;
}
</style>
