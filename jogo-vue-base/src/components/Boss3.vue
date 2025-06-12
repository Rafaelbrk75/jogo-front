<template>
  <BossBase
    ref="bossBaseRef"
    :initialX="bossX"  
    src1="/fase3/boss.png"
    src2="/fase3/boss2.png"
    attackSrc="/fase3/bossatk.png"
    extraClass="boss3-ataque"
    @update:x="onUpdateX"
  />
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, nextTick } from "vue";
import BossBase from "./BossBase.vue";

// É importante que o BossBase defina props initialX e initialY
// E que o CSS do BossBase use `top: initialY + 'px'`
// para posicionar a imagem verticalmente.

const bossX = ref(window.innerWidth - 400);
const bossY = ref(300); // Adicione esta linha para controlar a altura do boss
const bossBaseRef = ref(null);

const emit = defineEmits(["fire-power", "update:x"]); // Certifique-se que "fire-power" está aqui

function onUpdateX(novaX) {
  // Como discutido, esta função e o @update:x do template
  // podem ser redundantes se Boss3 é a fonte da verdade para bossX.
  // Deixe-o por enquanto se não tiver certeza, mas saiba que pode ser otimizado.
  emit("update:x", novaX); // Emite para o pai do Boss3 (e não do BossBase)
}

function updateBossPosition() {
  const img = bossBaseRef.value?.bossImg?.value;
  if (img && img.complete) {
    // Isso ajusta a posição X para que o boss não fique cortado na direita
    bossX.value = window.innerWidth - img.offsetWidth - 50;
    // Removido: emit("update:x", bossX.value); aqui para evitar loop desnecessário
    // se Boss3 já está controlando bossX
  }
}

function onImgLoad() {
  updateBossPosition();
}

let fireInterval = null;

function startFiring() {
  fireInterval = setInterval(() => {
    bossBaseRef.value?.triggerAttack();

    const deslocamentoX = 60; // Tente entre 30 e 60

    const posX = bossX.value - deslocamentoX; // Subtrai para jogar o poder pra esquerda do boss
    const posY = 90; // ou 380, 420, etc.

    console.log("🔥 Criando poder em:", posX, posY);
    // Emite o evento de disparo com os parâmetros corretos

    emit("fire-power", {
      frames: [
    "/fase3/poder-choque.png",
    "/fase3/poder-choque2.png",
    "/fase3/poder-choque3.png",
  ],
  speed: 7,
  x: posX,
  y: posY
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