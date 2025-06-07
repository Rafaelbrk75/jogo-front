<template>
  <img
    :src="currentSprite"
    alt="Jogador"
    class="player"
    :style="{ left: x + 'px', bottom: y + 'px' }"
  />
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const emit = defineEmits(["update:x", "update:y", "update:direcao", "update:estado"]);

const props = defineProps({
  initialX: { type: Number, default: 50 },
  initialY: { type: Number, default: 0 },
  pausado: { type: Boolean, default: false },
});

const x = ref(props.initialX);
const y = ref(props.initialY);
const speed = 6;
const jumpForce = 40;
const gravity = 0.8;
let velocityY = 0;
const somPulo = new Audio("/somPulo.mp3");
somPulo.volume = 1.0;
const somAgachando = new Audio("/somAgachando.mp3");
somAgachando.volume = 1.0;

const grounded = ref(true);
const agachado = ref(false);
const direcao = ref("direita");
const moving = { left: false, right: false, down: false };
const playerX = ref(50);
function atualizarX(novoX) {
  playerX.value = novoX;
}

// SPRITES ESTÁTICOS POR DIREÇÃO
const sprites = {
  direita: "/player.png",
  esquerda: "/bonecoVoltando.png",
  pulandoDireita: "/playerGiro.png",
  pulandoEsquerda: "/jumpVoltando.jpg",
  agachadoDireita: "/agachado.png",
  agachadoEsquerda: "/agachado2.png",
};

const currentSprite = computed(() => {
  if (!grounded.value) {
    return direcao.value === "esquerda"
      ? sprites.pulandoEsquerda
      : sprites.pulandoDireita;
  }

  if (agachado.value) {
    return direcao.value === "esquerda"
      ? sprites.agachadoEsquerda
      : sprites.agachadoDireita;
  }

  return sprites[direcao.value];
});

let rafId = null;
function gameLoop() {
  if (props.pausado) return;
  
  emit("update:x", x.value);

  if (moving.left) x.value = Math.max(0, x.value - speed);
  if (moving.right) x.value = Math.min(window.innerWidth - 100, x.value + speed);

  if (!grounded.value) {
    velocityY -= gravity;
    y.value += velocityY;
    if (y.value <= 0) {
      y.value = 0;
      velocityY = 0;
      grounded.value = true;
    }
  }

  if (grounded.value) {
  y.value = agachado.value ? -50 : 0;
}

  emit("update:x", x.value);
  emit("update:y", y.value);
  emit("update:direcao", direcao.value);
  emit("update:estado", {
    grounded: grounded.value,
    agachado: agachado.value,
  });

  rafId = requestAnimationFrame(gameLoop);
}

function onKeyDown(e) {
  if (props.pausado) return;

  if (e.key === "a") {
    moving.left = true;
    moving.right = false;
    direcao.value = "esquerda";
  }

  if (e.key === "d") {
    moving.right = true;
    moving.left = false;
    direcao.value = "direita";
  }

  if (e.key === "s" && grounded.value) {
    moving.down = true;
    agachado.value = true;
    y.value = 0;

    somAgachando.currentTime = 0;
    somAgachando.play().catch(() => {});
  }

  if ((e.key === " " || e.key === "w") && grounded.value && !agachado.value) {
    grounded.value = false;
    agachado.value = false;
    velocityY = jumpForce;

    somPulo.currentTime = 0;
    somPulo.play().catch(() => {});
  }
}

function onKeyUp(e) {
  if (props.pausado) return;
  if (e.key === "a") moving.left = false;
  if (e.key === "d") moving.right = false;
  if (e.key === "s") {
    moving.down = false;
    agachado.value = false;
    if (grounded.value) y.value = 0;
  }
}

onMounted(() => {
  direcao.value = "direita";
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  rafId = requestAnimationFrame(gameLoop);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("keyup", onKeyUp);
  if (rafId) cancelAnimationFrame(rafId);
});

</script>

<style scoped>
.player {
  position: absolute;
  width: 230px;
  transition: left 0.1s, bottom 0.1s;
  z-index: 2;
}
</style>




