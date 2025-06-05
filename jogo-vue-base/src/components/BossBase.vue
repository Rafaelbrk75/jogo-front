<template>
  <img
    ref="bossImg"
    :src="currentSprite"
    alt="Chefão"
    class="boss"
    :style="{ left: initialX + 'px' }"
  />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";

// Props comuns a todos os bosses (posição X inicial e dois sprites para animação)
const props = defineProps({
  initialX: {
    type: Number,
    default: 1000,
  },
  src1: {
    type: String,
    required: true,
  },
  src2: {
    type: String,
    required: true,
  },
  attackSrc: {
    type: String,
    required: true,
  },
});

// Estado que indica se o boss está em “modo de ataque”
const isAttacking = ref(false);

// Para intercalar / animar idle entre src1 e src2
const idleFrame = ref(0); // 0 => usar src1; 1 => usar src2
let idleInterval = null;

// Computed que escolhe qual sprite mostrar:
// - Se isAttacking = true, mostramos attackSrc imediatamente
// - Se isAttacking = false, alternamos entre src1 e src2 a cada X ms
const currentSprite = computed(() => {
  if (isAttacking.value) {
    return props.attackSrc; // Aqui ele mostra o bosstak.png se attackSrc for esse valor!
  } else {
    return idleFrame.value === 0 ? props.src1 : props.src2;
  }
});

// Ref para expor o <img> do boss, se algum dia você quiser manipulá-lo diretamente
const bossImg = ref(null);

// Função que troca de sprite para “ataque” por um curtíssimo período
function triggerAttack() {
  // 1) Se já estivermos atacando, não empilha outro ataque
  if (isAttacking.value) return;

  // 2) Coloca em modo de ataque:
  isAttacking.value = true;

  // 3) Para não ficar alternando o idle, limpe a animação de idle:
  if (idleInterval) {
    clearInterval(idleInterval);
    idleInterval = null;
  }

  // 4) Após um intervalo (por exemplo, 300 ms), volta ao idle normal:
  setTimeout(() => {
    isAttacking.value = false;
    // Reinicia a animação de idle:
    startIdleAnimation();
  }, 300);
}

// Função interna para rodar a animação de idle (frame 0 ↔ frame 1 a cada 500 ms)
function startIdleAnimation() {
  // Caso já esteja rodando, não recrie intervalo
  if (idleInterval) return;
  idleInterval = setInterval(() => {
    idleFrame.value = idleFrame.value === 0 ? 1 : 0;
  }, 500);
}

// Quando o componente “montar”, já inicia o idle e informa a posição X ao pai (se necessário)
onMounted(() => {
  // Ajusta a posição X inicial (caso o pai precise saber)
  bossX.value = props.initialX;
  emit("update:x", bossX.value);

  // Inicia a troca de frames do idle
  startIdleAnimation();
});

// Limpa tudo quando o componente for destruído
onBeforeUnmount(() => {
  if (idleInterval) {
    clearInterval(idleInterval);
    idleInterval = null;
  }
});

defineExpose({
  bossImg,
  triggerAttack
});

const emit = defineEmits(["update:x"]);

// posição fixa em X (não se move)
const bossX = ref(props.initialX);

let spriteInterval = null;

onMounted(() => {
  // Alterna entre src1 e src2 a cada 300ms
  spriteInterval = setInterval(() => {
    currentSprite.value =
      currentSprite.value === props.src1 ? props.src2 : props.src1;
  }, 300);
  // Logo ao montar, já informamos a posição X inicial para o pai (caso queira)
  emit("update:x", bossX.value);
});

onBeforeUnmount(() => {
  if (spriteInterval) {
    clearInterval(spriteInterval);
    spriteInterval = null;
  }
});


</script>

<style scoped>
.boss {
  position: absolute;
  bottom: 0px;
  width: 18vw; /* 18% da largura da tela, ajuste conforme necessário */
  min-width: 350px; /* nunca menor que 350px */
  max-width: 600px; /* limite máximo para telas muito grandes */
  transition: left 0.2s;
  z-index: 2;
  image-rendering: pixelated;
}
</style>
