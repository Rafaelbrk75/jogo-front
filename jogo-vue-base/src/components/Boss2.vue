<template>
  <BossBase
    ref="bossBaseRef"
    :initialX="bossX"
    :src1="spriteAtual"
    :src2="spriteAlternado"
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

// Sprites que mudam conforme a direção
const spriteAtual = ref("/fase2/bossVoltando.png");
const spriteAlternado = ref("/fase2/bossVoltandoGrau.png");

// Som da moto
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

    if (bossX.value <= limiteEsquerdo) {
  // Vai mudar pra direita
  direcaoBoss = 1;
  spriteAtual.value = "/fase2/bossVoltandoGrau.png";
  spriteAlternado.value = "/fase2/bossVoltando.png";
} else if (bossX.value >= limiteDireito) {
  // Vai mudar pra esquerda
  direcaoBoss = -1;
  spriteAtual.value = "/fase2/boss.png";
  spriteAlternado.value = "/fase2/boss2.png";
}

    emit("update:x", bossX.value);
  }, 30);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", liberarAudio);
  clearInterval(intervaloBoss);
});
</script>