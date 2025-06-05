<template>
  <BossBase
    ref="bossBaseRef"
    :initialX="bossX"
    src1="/fase2/boss.png"
    src2="/fase2/boss2.png"
    attackSrc="/fase2/bossatk.png"
    @update:x="onUpdateX"
  />
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import BossBase from "./BossBase.vue";

const emit = defineEmits(["update:x"]);

const bossBaseRef = ref(null);
const bossX = ref(0);

let direcaoBoss = -1;
let intervaloBoss = null;
let bossPodeAndar = false;

const limiteEsquerdo = 100;
const limiteDireito = window.innerWidth - 400;

const roncoMoto = new Audio("/fase2/roncoMoto.mp3");
roncoMoto.volume = 1.0;
roncoMoto.loop = true;
let somTocou = false;

const liberarAudio = () => {
  if (!somTocou) {
    roncoMoto.play();
    somTocou = true;
  }
};

const onUpdateX = (x) => {
  bossX.value = x;
};

onMounted(() => {
  document.addEventListener("keydown", liberarAudio);
  bossPodeAndar = true;

  intervaloBoss = setInterval(() => {
    if (!bossPodeAndar) return;

    bossX.value += direcaoBoss * 25;

    if (bossX.value <= limiteEsquerdo || bossX.value >= limiteDireito) {
      direcaoBoss *= -1;
    }

    emit("update:x", bossX.value);
  }, 30);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", liberarAudio);
  clearInterval(intervaloBoss);
});
</script>

