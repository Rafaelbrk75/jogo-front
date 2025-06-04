<template>
  <img
    :src="currentSprite"
    alt="Jogador"
    class="player"
    :style="{ left: x + 'px', bottom: y + 'px', transform: flipped ? 'scaleX(-1)' : 'scaleX(1)' }"
  />
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";

// vamos emitir eventos de “posição atualizada” para o pai, para colisões etc.
const emit = defineEmits(["update:x", "update:y", "update:direcao", "update:estado"]);

// Props opcionais, caso queira posicionar o player a partir do pai no início
const props = defineProps({
  initialX: { type: Number, default: 50 },
  initialY: { type: Number, default: 0 },
  pausado: { type: Boolean, default: false }, // <-- adicione esta linha
});

const x = ref(props.initialX);
const y = ref(props.initialY);

// velocidade horizontal (pixels por quadro)
const speed = 6;
// força do pulo (valor inicial para velocityY)
const jumpForce = 30;
// gravidade (valor subtraído de velocityY a cada iteração)
const gravity = 0.8;
let velocityY = 0;

// flags de estado
const grounded = ref(true);
const agachado = ref(false);
const direcao = ref("direita"); // "direita" ou "esquerda"

// controle de quais teclas estão pressionadas
const moving = { left: false, right: false, down: false };

// sprites (troque pelos caminhos corretos das suas imagens)
const sprites = {
  paradoDireita: "/player.png",
  paradoEsquerda: "/bonecoVoltando.jpg",
  // Se só tem um sprite, mantenha assim:
  andandoDireita: ["/player.png"],
  andandoEsquerda: ["/bonecoVoltando.jpg"],
  pulandoDireita: "/playerGiro.png",
  pulandoEsquerda: "/jumpVoltando.jpg",
  agachadoDireita: "/agachado.png",
  agachadoEsquerda: "/agachado2.png",
};

// computado para ver se deve “virar” (flip horizontal)
const flipped = computed(() => direcao.value === "esquerda");

// computado para selecionar o sprite atual
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
  if (moving.left) {
    return sprites.andandoEsquerda[walkFrame.value % sprites.andandoEsquerda.length];
  }
  if (moving.right) {
    return sprites.andandoDireita[walkFrame.value % sprites.andandoDireita.length];
  }
  return direcao.value === "esquerda"
    ? sprites.paradoEsquerda
    : sprites.paradoDireita;
});

// função que roda em loop ~60FPS para atualizar posição e gravidade
let rafId = null;
function gameLoop() {
  if (props.pausado) {
    rafId = requestAnimationFrame(gameLoop);
    return;
  }
  // --- movimento horizontal ---
  if (moving.left) {
    x.value = Math.max(0, x.value - speed);
  }
  if (moving.right) {
    x.value = Math.min(window.innerWidth - 100, x.value + speed);
  }

  // atualizar sprite de direção
  if (moving.left) direcao.value = "esquerda";
  if (moving.right) direcao.value = "direita";

  // --- pulo e gravidade ---
  if (!grounded.value) {
    velocityY -= gravity;
    y.value += velocityY;

    if (y.value <= 0) {
      // aterrissou
      y.value = 0;
      velocityY = 0;
      grounded.value = true;
    }
  }

  // Se estiver agachado e no chão, mantém no chão
  if (agachado.value && grounded.value) {
    y.value = 0;
  }

  // emitir eventos de posição para o pai, se quiser usar para colisões
  emit("update:x", x.value);
  emit("update:y", y.value);
  emit("update:direcao", direcao.value);
  emit("update:estado", {
    grounded: grounded.value,
    agachado: agachado.value,
  });

  rafId = requestAnimationFrame(gameLoop);
}

// ──────────────────────────────────────────────────────────────
// **Tratamento de teclado**  
// ──────────────────────────────────────────────────────────────
function onKeyDown(e) {
  if (props.pausado) return;
  if (e.key === "a") {
    moving.left = true;
    moving.right = false;
  }
  if (e.key === "d") {
    moving.right = true;
    moving.left = false;
  }
  if (e.key === "s") {
    if (grounded.value) { // Só agacha se estiver no chão
      moving.down = true;
      agachado.value = true;
      y.value = 0;
    }
  }
  // pulo: espaço ou “W”
  if ((e.key === " " || e.key === "w") && grounded.value && !agachado.value) {
    grounded.value = false;
    agachado.value = false;
    velocityY = jumpForce;
  }
}

function onKeyUp(e) {
  if (props.pausado) return;
  if (e.key === "a") {
    moving.left = false;
  }
  if (e.key === "d") {
    moving.right = false;
  }
  if (e.key === "s") {
    moving.down = false;
    agachado.value = false;
    if (grounded.value) {
      y.value = 0;
    }
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  rafId = requestAnimationFrame(gameLoop);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("keyup", onKeyUp);
  if (rafId) cancelAnimationFrame(rafId);
  if (walkAnimInterval) clearInterval(walkAnimInterval);
});

// Animação de caminhada
const walkFrame = ref(0);
let walkAnimInterval = null;

watch([() => moving.left, () => moving.right], ([left, right]) => {
  if (left) {
    if (!walkAnimInterval) {
      walkAnimInterval = setInterval(() => {
        walkFrame.value = (walkFrame.value + 1) % sprites.andandoEsquerda.length;
      }, 120);
    }
  } else if (right) {
    if (!walkAnimInterval) {
      walkAnimInterval = setInterval(() => {
        walkFrame.value = (walkFrame.value + 1) % sprites.andandoDireita.length;
      }, 120);
    }
  } else {
    walkFrame.value = 0;
    clearInterval(walkAnimInterval);
    walkAnimInterval = null;
  }
});

</script>

<style scoped>
.player {
  position: absolute;
  width: 230px; /* ajuste conforme precisar */
  transition: left 0.1s, bottom 0.1s, transform 0.1s;
  z-index: 2;
}
</style>
