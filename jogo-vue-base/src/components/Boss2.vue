<template>
  <!-- Usa BossBase apenas para trocar o sprite -->
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
const bossX = ref(0); // em pixels agora

let direcaoBoss = -1;
let intervaloBoss = null;

// Define limites da pista em pixels
const limiteEsquerdo = 100;
const limiteDireito = window.innerWidth - 400;

// Movimenta o boss automaticamente pela tela (ida e volta)
const moverBoss = () => {
  bossX.value += direcaoBoss * 4; // velocidade

  if (bossX.value <= limiteEsquerdo || bossX.value >= limiteDireito) {
    direcaoBoss *= -1;
  }

  emit("update:x", bossX.value);
};

function onUpdateX(novaX) {
  emit("update:x", novaX);
}

onMounted(() => {
  bossX.value = limiteDireito; // começa da direita
  intervaloBoss = setInterval(moverBoss, 16); // ~60fps
});

onBeforeUnmount(() => {
  clearInterval(intervaloBoss);
});
</script>
