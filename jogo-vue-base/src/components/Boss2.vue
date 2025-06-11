<template>
  <BossBase
  ref="bossBaseRef"
  class="boss"
  :x="bossX"
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

let direcaoBoss = 1;
let intervaloBoss = null;
let bossPodeAndar = false;

const limiteEsquerdo = 100;
const limiteDireito = window.innerWidth - 400;

// Sprites que mudam conforme a direção
const spriteAtual = ref("/fase2/bossVoltando.png");
const spriteAlternado = ref("/fase2/bossVoltandoGrau.png");

// Som da moto
const roncoMoto = new Audio("/fase2/roncoMoto.mp3");
roncoMoto.volume = 0.2;
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

  let podeDarDano = true; // controle de cooldown

  intervaloBoss = setInterval(() => {
    if (!bossPodeAndar) return;

    bossX.value += direcaoBoss * 10;

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

    // 🔽 Colisão com jogador e emissão de dano com hitbox ajustada
    const playerEl = document.querySelector(".player");
    const bossEl = bossBaseRef.value?.$el;

    if (playerEl && bossEl) {
      const r1 = playerEl.getBoundingClientRect();
      const r2 = bossEl.getBoundingClientRect();

      // Expande a hitbox da moto em 20px para cada lado
      const r2Expandido = {
  left: r2.left + 20,
  right: r2.right - 20,
  top: r2.top + 20,      // Encurta por cima
  bottom: r2.bottom - 20 // Encurta por baixo
};

      const colidiu =
        r1.left < r2Expandido.right &&
        r1.right > r2Expandido.left &&
        r1.top < r2Expandido.bottom &&
        r1.bottom > r2Expandido.top;

      if (colidiu && podeDarDano) {
        emit("tocarPlayer");
        podeDarDano = false;
        setTimeout(() => {
          podeDarDano = true;
        }, 500); // cooldown de 500ms entre danos
      }
    }
  }, 30);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", liberarAudio);
  clearInterval(intervaloBoss);
  roncoMoto.pause();
  roncoMoto.currentTime = 0;
});
</script>