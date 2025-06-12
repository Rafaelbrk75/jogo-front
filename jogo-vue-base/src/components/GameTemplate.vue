<template>
  <div>
    <!-- Tela de Menu -->
    <Menu v-if="faseAtual === 1 && telaAtual === 'menu'" @start="exibirIntro" />

    <!-- HQ de Introdução -->
    <div v-else-if="telaAtual === 'intro'" class="intro-hq">
      <img :key="hqIndex" :src="`/fase${props.fase}/hq-intro${hqIndex}.png`" class="hq-img" alt="HQ Intro" />
      <button class="btn-skip" @click="avancarHQ">PULAR</button>
    </div>

    <!-- Tela de Jogo -->
    <div v-else-if="telaAtual === 'jogo'" class="cenario" :style="{ backgroundImage: `url('${cenario}')` }">
      <Hud :vidas="vidas" />

      <!-- Sombra do Boss -->
      <img v-if="props.fase !== 2" src="/sombra.png" class="sombra sombra-boss" />

      <!-- Barra de vida do Boss -->
      <div class="barra-vida">
        <div class="barra-vida-fill" :style="{ width: (bossVida / bossVidaInicial) * 100 + '%' }"></div>
      </div>
      <!-- Barra de vida do Boss (com efeito de dano e animação) -->
      <div class="boss-health-wrapper">
        <div class="boss-health-bar">
          <!-- Barra atrasada (efeito de dano) -->
          <div class="boss-health-damage" :style="{ width: delayedHealthPercent + '%' }"></div>

          <!-- Barra atual -->
          <div class="boss-health-current" :style="{ width: healthPercent + '%', backgroundColor: barColor }"></div>
        </div>
      </div>


      <!-- Aqui carregamos o boss correto, de acordo com faseAtual -->
      <component :is="bossComponent" :key="faseAtual + '-' + bossKey" class="boss" :initialX="bossX"
        @update:x="bossX = $event" @update:y="bossY = $event" @fire-power="startBossPower" @tocarPlayer="levarDano" />

      <!-- Sombra do Player -->
      <img src="/sombra.png" class="sombra sombra-player" :style="{ left: playerX + 45 + 'px', bottom: '-50px' }" />

      <!-- Moedas -->
      <img v-if="mostrarMoeda" :src="moedas.bronze[moedaFrame - 1]" alt="Moeda Girando" class="moeda-girando" />
      <img v-if="mostrarMoedaPrata" :src="moedas.prata[moedaPrataFrame - 1]" alt="Moeda Prata Girando"
        class="moeda-girando" />
      <img v-if="mostrarMoedaDourada" :src="moedas.dourada[moedaDouradaFrame - 1]" class="moeda-girando-dourada" />

      <!-- Perguntas -->
      <div v-if="mostrarPergunta" class="pergunta-overlay" @click.stop>
        <img :src="perguntaBronze.imagem" class="img-pergunta" />
        <div class="contador">{{ tempoRestAnte }}</div>
      </div>
      <div v-if="mostrarPerguntaPrata" class="pergunta-overlay" @click.stop>
        <img :src="perguntaPrata.imagem" class="img-pergunta" />
        <div class="contador">{{ tempoRestAnte }}</div>
      </div>
      <div v-if="mostrarPerguntaDourada" class="pergunta-overlay" @click.stop>
        <img :src="perguntaDourada.imagem" class="img-pergunta" />
        <div class="contador">{{ tempoRestAnte }}</div>
      </div>

      <!-- Player (envia posição/estado via eventos emitidos) -->
      <Player :key="playerKey" :initialX="playerX" :initialY="jumpY" :pausado="jogoPausado || perguntaPausandoJogo"
        @update:x="playerX = $event" @update:y="jumpY = $event" @update:direcao="direcao = $event"
        @update:estado="onPlayerEstado($event)" />

      <!-- Poder (vindo do Boss) -->
      <AnimatedPoder v-for="(poder, index) in poderes" :key="index" :x="poder.x" :y="poder.y" :frames="poder.frames"
        :frameDelay="100" :style="{ left: poder.x + 'px', bottom: (poder.y || 160) + 'px' }" />

      <!-- Tiro de Laser do Player -->
      <img v-if="tiroVisivel" src="/impacto_laser_pixelado.png" alt="Tiro de Laser" class="tiro"
        :style="{ left: tiroX + 'px', bottom: tiroY + 'px' }" />

      <!-- Áudios -->
      <audio ref="somNivel1" :src="musica" loop />
      <audio ref="somImpacto" src="/somImpacto.mp3" />
      <audio ref="somGameOver" src="/gameover.mp3" />
      <audio ref="somAgachando" src="/somAgachando.mp3" />
      <audio ref="somPulo" src="/somPulo.mp3" />
      <audio ref="somMoeda" src="/public/somMoeda.wav" />
      <audio ref="somAcerto" src="/somAcerto.wav" />
      <audio ref="somPerda" src="/somPerda.mp3" />
      <audio ref="somRelogio" src="/somRelogio.mp3" />

      <!-- Botão de Som -->
      <button @click.stop="toggleSom" class="btn-som">
        <img :src="somAtivo ? '/iconSomLigado.png' : '/iconSomDesligado.png'" alt="Som" />
      </button>

      <!-- Overlay de Pause -->
      <div v-if="jogoPausado" class="pause-overlay">
        <img src="/telaPause.png" class="img-pause" alt="Pausado" />
        <button v-if="jogoPausado" class="btn-continuar" @click.stop="togglePause">
          CONTINUAR
        </button>
      </div>

      <!-- Tela de Game Over -->
      <div v-if="gameOver" class="game-over-overlay">
        <div class="game-over-container">
          <img src="/imgGameOver.png" class="img-game-over" alt="Game Over" />
          <button class="btn-reiniciar" @click="reiniciarJogo">
            REINICIAR
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  watch,
  onBeforeUnmount,
  onMounted,
} from "vue";
import Menu from "./Menu.vue";
import Hud from "./Hud.vue";
import Player from "./Player.vue";

// Importamos as fases de Boss
import BossFase1 from "./Boss1.vue";
import BossFase2 from "./Boss2.vue";
import AnimatedPoder from "./AnimatedPoder.vue";

const props = defineProps({
  fase: { type: Number, required: true },
  exibirMenu: { type: Boolean, default: false }, // ← ADICIONADO
  cenario: { type: String, required: true },
  musica: { type: String, required: true },
  bossVidaInicial: { type: Number, default: 3 },
  bossComponent: { type: Object, required: true },
  perguntas: { type: Object, required: true },
  moedas: { type: Object, required: true },
});

const playerKey = ref(0);
const hqIndex = ref(1); // começa na HQ 1
// ──────────────────────────────────────────────────────────────
// Estados principais do GameTemplate
// ──────────────────────────────────────────────────────────────

const bossY = ref(300);

let introTimeoutId = null;

const vidas = reactive([true, true, true]);
const playerX = ref(50);

const jumpY = ref(0);
const direcao = ref("direita");

// Essas duas refs são atualizadas pelo evento @update:estado do Player
const estaAgachado = ref(false);
const groundedGlob = ref(true);

// Variável que controla em que fase estamos (1 ou 2 neste exemplo)
const faseAtual = computed(() => props.fase); // sempre começa no menu
const telaAtual = ref(faseAtual.value === 1 ? "menu" : "jogo");
// Computed para eleger o boss correspondente a cada fase


// posição X do boss (recebida dos eventos @update:x)
const bossX = ref(window.innerWidth - 400); // exemplo de valor inicial razoável

// Tudo relativo ao “poder” do boss
const poderX = ref(0);
const poderVisivel = ref(false);
const invulneravel = ref(false);

// Qual sprite de poder exibir (muda conforme evento “fire-power”)
const poderSprite = ref("/poderFase1.png");

// Áudios e som
const somNivel1 = ref(null);
const somImpacto = ref(null);
const somGameOver = ref(null);
const somAgachando = ref(null);
const somPulo = ref(null);
const somMoeda = ref(null);
const somAcerto = ref(null);
const somPerda = ref(null);
const somRelogio = ref(null);
const somAtivo = ref(false);

const jogoPausado = ref(false);
const gameOver = ref(false);

const moedaFrame = ref(1);
const mostrarMoeda = ref(false);
const moedaPrataFrame = ref(1);
const mostrarMoedaPrata = ref(false);
const moedaDouradaFrame = ref(1);
const mostrarMoedaDourada = ref(false);

const mostrarPergunta = ref(false);
const mostrarPerguntaPrata = ref(false);
const mostrarPerguntaDourada = ref(false);
const respostaDigitada = ref("");
const tempoRestAnte = ref(10);
const perguntaPausandoJogo = ref(false);

const bossVida = ref(props.bossVidaInicial);
const healthPercent = computed(() => (bossVida.value / props.bossVidaInicial) * 100);
const delayedHealth = ref(healthPercent.value);
const delayedHealthPercent = computed(() => delayedHealth.value);

const perguntaBronze = computed(() => props.perguntas.bronze);
const perguntaPrata = computed(() => props.perguntas.prata);
const perguntaDourada = computed(() => props.perguntas.dourada);

const tiroVisivel = ref(false);
const tiroX = ref(0);
const tiroY = ref(0);
const tiroSpeed = 30;
let tiroAnimFrame = null;

let frameLoop = null;
let moedaAnimacao = null;
let animacaoPrata = null;
let animacaoDourada = null;
let timerPergunta = null;

const poderes = ref([]);
const bossKey = ref(0);

watch(healthPercent, (newVal) => {
  setTimeout(() => {
    delayedHealth.value = newVal;
  }, 300); // atraso de 300ms
});

const barColor = computed(() => {
  const p = healthPercent.value;
  if (p > 60) return '#4caf50'; // verde
  if (p > 30) return '#ff9800'; // laranja
  return '#f44336';             // vermelho
});
// ──────────────────────────────────────────────────────────────
// Exibe a HQ antes de iniciar o jogo
// ──────────────────────────────────────────────────────────────
function exibirIntro() {
  telaAtual.value = "intro";
  hqIndex.value = 1; // reseta HQ para a primeira
  clearTimeout(introTimeoutId);
  introTimeoutId = setTimeout(() => {
    if (telaAtual.value === "intro") iniciarJogo();
  }, 8000);
}


// Pula a HQ e inicia imediatamente
function pularIntro() {
  clearTimeout(introTimeoutId);
  iniciarJogo();
}
function avancarHQ() {
  if (faseAtual.value === 1 && hqIndex.value === 1) {
    hqIndex.value = 2; // vai para a segunda HQ
  } else {
    pularIntro(); // inicia o jogo
  }
}


// ──────────────────────────────────────────────────────────────
// Inicia o jogo (setting up loops, sons, etc.)
// ──────────────────────────────────────────────────────────────
function iniciarJogo() {
  telaAtual.value = "jogo";
  // Tocar música de fundo
  if (somNivel1.value) {
    somNivel1.value.currentTime = 0;
    somNivel1.value.loop = true;
    somNivel1.value.play().catch(() => { });
  }
  somAtivo.value = true;
  gameOver.value = false;

  // Resetar tudo
  vidas.splice(0, vidas.length, true, true, true);
  poderes.value.splice(0, poderes.value.length); // limpa todos os poderes
  poderVisivel.value = false;
  playerX.value = 50;
  jumpY.value = 0;
  bossX.value = 1475;
  poderX.value = 0;
  poderVisivel.value = false;
  moedaFrame.value = 1;
  moedaPrataFrame.value = 1;
  moedaDouradaFrame.value = 1;
  mostrarMoeda.value = false;
  mostrarMoedaPrata.value = false;
  mostrarMoedaDourada.value = false;
  mostrarPergunta.value = false;
  mostrarPerguntaPrata.value = false;
  mostrarPerguntaDourada.value = false;
  respostaDigitada.value = "";
  tempoRestAnte.value = 10;
  estaAgachado.value = false;
  groundedGlob.value = true;

  bossVida.value = props.bossVidaInicial;

  // Inicia loop de jogo (colisões e perguntas)
  frameLoop = requestAnimationFrame(gameLoop);

  // Limpa qualquer animação de moeda bronze anterior
  clearInterval(moedaAnimacao);
  mostrarMoeda.value = false; // Garante que começa oculto para o novo timeout
  setTimeout(() => {
    mostrarMoeda.value = true;
    moedaFrame.value = 1; // Reseta o frame da moeda
    moedaAnimacao = setInterval(() => {
      moedaFrame.value = moedaFrame.value === 4 ? 1 : moedaFrame.value + 1;
    }, 150);
  }, 7000);
  // -------------------------------------------------------------
}

// ──────────────────────────────────────────────────────────────
// Quando o BossFaseX emitir “fire-power” com { frames, speed }
// chamamos esta função para animar o “poder” no canvas
// ──────────────────────────────────────────────────────────────

function startBossPower({ frames, speed, x, y }) {
  console.log("🛫 Recebido poder do boss:", frames, x, y);
  const poderX = (x ?? window.innerWidth - 200) - 80; // margem extra para segurança
  const poderY = typeof y === "number" ? y : bossY.value;

  console.log("🔥 Poder ajustado:", poderX, poderY);

  poderes.value.push({
    frames: Array.isArray(frames) ? frames : [frames], // garante array
    x: poderX,
    y: poderY,
    speed,
  });
}

// ──────────────────────────────────────────────────────────────
// Tratamento de teclas para o jogo (pausar, respostas, tiro)
// ──────────────────────────────────────────────────────────────

function onKeyDown(e) {
  if (e.key === "Escape") {
    togglePause();
    return;
  }

  if (gameOver.value && e.key !== "Escape") return;

  // Responder pergunta bronze
  if (mostrarPergunta.value && /^[a-zA-Z-Z0-9]$/.test(e.key)) {
    const tecla = e.key.toUpperCase();
    if (tecla === perguntaBronze.value.resposta.toUpperCase()) {
      encerrarPergunta(true);
    } else {
      encerrarPergunta(false);
    }
  }

  // Responder pergunta prata
  if (mostrarPerguntaPrata.value && /^[a-zA-Z0-9]$/.test(e.key)) {
    const tecla = e.key.toString().toUpperCase();
    if (tecla === perguntaPrata.value.resposta.toString().toUpperCase()) {
      encerrarPerguntaPrata(true);
    } else {
      encerrarPerguntaPrata(false);
    }
  }

  // Responder pergunta dourada
  if (mostrarPerguntaDourada.value && /^[a-zA-Z0-9]$/.test(e.key)) {
    const tecla = e.key.toString().toUpperCase();
    if (tecla === perguntaDourada.value.resposta.toString().toUpperCase()) {
      encerrarPerguntaDourada(true);
    } else {
      encerrarPerguntaDourada(false);
    }
  }

  // Pular HQ no menu
  if (e.key === "Enter" && telaAtual.value === "menu") {
    exibirIntro();
  }

  // Disparar tiro
  if (e.key.toLowerCase() === "f") {
    dispararTiro();
  }
}

function onKeyUp(_) {
  // nada aqui
}

// ──────────────────────────────────────────────────────────────
// Função que dispara o laser (tiro do player)
// ──────────────────────────────────────────────────────────────
function dispararTiro() {
  if (tiroVisivel.value) return;
  tiroX.value = playerX.value + 60;
  tiroY.value = jumpY.value + 40;
  tiroVisivel.value = true;

  function animarTiro() {
    if (jogoPausado.value || gameOver.value) {
      cancelAnimationFrame(tiroAnimFrame);
      return;
    }
    tiroX.value += tiroSpeed;

    const bossEl = document.querySelector(".boss");
    const tiroEl = document.querySelector(".tiro");
    const danoLaser = 0.5;
    if (bossEl && tiroEl) {
      const rBoss = bossEl.getBoundingClientRect();
      const rTiro = tiroEl.getBoundingClientRect();
      const houveColisao =
        rTiro.left < rBoss.right &&
        rTiro.right > rBoss.left &&
        rTiro.top < rBoss.bottom &&
        rTiro.bottom > rBoss.top;

      if (houveColisao) {
        if (bossVida.value > 0) {
          bossVida.value -= danoLaser;
        }
        tiroVisivel.value = false;
        cancelAnimationFrame(tiroAnimFrame);
        if (bossVida.value <= 0) {
          emitirVitoria();
        }
        return;
      }
    }

    if (tiroX.value > window.innerWidth + 180) {
      tiroVisivel.value = false;
      cancelAnimationFrame(tiroAnimFrame);
      return;
    }
    tiroAnimFrame = requestAnimationFrame(animarTiro);
  }
  tiroAnimFrame = requestAnimationFrame(animarTiro);
}

// ──────────────────────────────────────────────────────────────
// Loop principal do jogo (colisões com moedas e trigger de perguntas)
// ──────────────────────────────────────────────────────────────
function gameLoop() {
  if (jogoPausado.value || perguntaPausandoJogo.value || gameOver.value) return;

  // Colisão com moeda bronze
  const checarColisaoMoeda = (selector, onCollect) => {
    const moedaEl = document.querySelector(selector);
    const playerEl = document.querySelector(".player");
    if (moedaEl && playerEl) {
      const r1 = moedaEl.getBoundingClientRect();
      const r2 = playerEl.getBoundingClientRect();
      const colidiu =
        r1.left < r2.right &&
        r1.right > r2.left &&
        r1.top < r2.bottom &&
        r1.bottom > r2.top;
      if (colidiu) onCollect();
    }
  };

  if (mostrarMoeda.value) {
    checarColisaoMoeda(".moeda-girando", () => {
      mostrarMoeda.value = false;
      if (somMoeda.value && somAtivo.value) {
        somMoeda.value.currentTime = 0;
        somMoeda.value.play().catch(() => { });
      }
      iniciarPergunta();
    });
  }
  if (mostrarMoedaPrata.value) {
    checarColisaoMoeda(".moeda-girando", () => {
      mostrarMoedaPrata.value = false;
      if (somMoeda.value && somAtivo.value) {
        somMoeda.value.currentTime = 0;
        somMoeda.value.play().catch(() => { });
      }
      iniciarPerguntaPrata();
    });
  }
  if (mostrarMoedaDourada.value) {
    checarColisaoMoeda(".moeda-girando-dourada", () => {
      mostrarMoedaDourada.value = false;
      if (somMoeda.value && somAtivo.value) {
        somMoeda.value.currentTime = 0;
        somMoeda.value.play().catch(() => { });
      }
      iniciarPerguntaDourada();
    });
  }

  // Atualiza e remove poderes do boss
  for (let i = poderes.value.length - 1; i >= 0; i--) {
    console.log("Poder", i, poderes.value[i]);
    poderes.value[i].x -= poderes.value[i].speed;

    const playerEl = document.querySelector(".player");
    const poderEls = document.querySelectorAll(".poder");
    const poderEl = poderEls[i];
    if (playerEl && poderEl) {
      const rPlayer = playerEl.getBoundingClientRect();
      const rPoder = poderEl.getBoundingClientRect();

      const colidiu =
        rPoder.left < rPlayer.right &&
        rPoder.right > rPlayer.left &&
        rPoder.top < rPlayer.bottom &&
        rPoder.bottom > rPlayer.top;

      if (colidiu) {
        // Remove uma vida
        const idx = vidas.findIndex((v) => v);
        if (idx !== -1) vidas[idx] = false;
        poderes.value.splice(i, 1);
        verificarGameOver();
        continue;
      }
    }

    if (poderes.value[i] && poderes.value[i].x < -200) {
      poderes.value.splice(i, 1);
    }
  }

  frameLoop = requestAnimationFrame(gameLoop);
}

// ──────────────────────────────────────────────────────────────
// Pergunta Bronze
// ──────────────────────────────────────────────────────────────
function iniciarPergunta() {
  mostrarPergunta.value = true;
  respostaDigitada.value = "";
  tempoRestAnte.value = 10;
  perguntaPausandoJogo.value = true;
  if (somRelogio.value && somAtivo.value) {
    somRelogio.value.currentTime = 0;
    somRelogio.value.play().catch(() => { });
  }

  timerPergunta = setInterval(() => {
    tempoRestAnte.value--;
    if (tempoRestAnte.value <= 0) {
      encerrarPergunta(false);
    }
  }, 1000);
}

function encerrarPergunta(acertou) {
  if (!mostrarPergunta.value) return;
  clearInterval(timerPergunta);
  mostrarPergunta.value = false;
  perguntaPausandoJogo.value = false;
  if (somRelogio.value) somRelogio.value.pause();

  if (somAtivo.value) {
    if (acertou && somAcerto.value) {
      somAcerto.value.currentTime = 0;
      somAcerto.value.play().catch(() => { });
      // --- ADIÇÃO: Diminuir a vida do boss ao acertar a pergunta bronze ---
      if (bossVida.value > 0) {
        bossVida.value--; // Reduz a vida do boss em 1
        console.log("Boss levou 1 de dano pela pergunta bronze! Vida atual:", bossVida.value);
      }
      // ---------------------------------------------------------------------
    } else if (!acertou && somPerda.value) {
      somPerda.value.currentTime = 0;
      somPerda.value.play().catch(() => { });
      const idx = vidas.findIndex((v) => v);
      if (idx !== -1) vidas[idx] = false;
      verificarGameOver();
    }
  }

  frameLoop = requestAnimationFrame(gameLoop);

  // Após 2s, aparece moeda prata
  setTimeout(() => {
    mostrarMoedaPrata.value = true;
    moedaPrataFrame.value = 1;
    animacaoPrata = setInterval(() => {
      moedaPrataFrame.value =
        moedaPrataFrame.value === 4 ? 1 : moedaPrataFrame.value + 1;
    }, 150);
  }, 2000);
}

// ──────────────────────────────────────────────────────────────
// Pergunta Prata
// ──────────────────────────────────────────────────────────────
function iniciarPerguntaPrata() {
  mostrarPerguntaPrata.value = true;
  respostaDigitada.value = "";
  tempoRestAnte.value = 10;
  perguntaPausandoJogo.value = true;
  if (somRelogio.value && somAtivo.value) {
    somRelogio.value.currentTime = 0;
    somRelogio.value.play().catch(() => { });
  }

  timerPergunta = setInterval(() => {
    tempoRestAnte.value--;
    if (tempoRestAnte.value <= 0) {
      encerrarPerguntaPrata(false);
    }
  }, 1000);
}

function encerrarPerguntaPrata(acertou) {
  if (!mostrarPerguntaPrata.value) return;
  clearInterval(timerPergunta);
  mostrarPerguntaPrata.value = false;
  perguntaPausandoJogo.value = false;
  if (somRelogio.value) somRelogio.value.pause();

  if (somAtivo.value) {
    if (acertou && somAcerto.value) {
      somAcerto.value.currentTime = 0;
      somAcerto.value.play().catch(() => { });
      // --- ADIÇÃO: Diminuir a vida do boss ao acertar a pergunta prata ---
      if (bossVida.value > 0) {
        bossVida.value -= 2; // Reduz a vida do boss em 2
        console.log("Boss levou 1 de dano pela pergunta prata! Vida atual:", bossVida.value);
      }
      // -------------------------------------------------------------------
    } else if (!acertou && somPerda.value) {
      somPerda.value.currentTime = 0;
      somPerda.value.play().catch(() => { });
      const idx = vidas.findIndex((v) => v);
      if (idx !== -1) vidas[idx] = false;
      verificarGameOver();
    }
  }

  frameLoop = requestAnimationFrame(gameLoop);

  // Após 4s, aparece moeda dourada
  setTimeout(() => {
    mostrarMoedaDourada.value = true;
    moedaDouradaFrame.value = 1;
    animacaoDourada = setInterval(() => {
      moedaDouradaFrame.value =
        moedaDouradaFrame.value === 4 ? 1 : moedaDouradaFrame.value + 1;
    }, 150);
  }, 4000);
}

// ──────────────────────────────────────────────────────────────
// Pergunta Dourada
// ──────────────────────────────────────────────────────────────
function iniciarPerguntaDourada() {
  mostrarPerguntaDourada.value = true;
  respostaDigitada.value = "";
  tempoRestAnte.value = 10;
  perguntaPausandoJogo.value = true;
  if (somRelogio.value && somAtivo.value) {
    somRelogio.value.currentTime = 0;
    somRelogio.value.play().catch(() => { });
  }

  timerPergunta = setInterval(() => {
    tempoRestAnte.value--;
    if (tempoRestAnte.value <= 0) {
      encerrarPerguntaDourada(false);
    }
  }, 1000);
}

function encerrarPerguntaDourada(acertou) {
  if (!mostrarPerguntaDourada.value) return;
  clearInterval(timerPergunta);
  mostrarPerguntaDourada.value = false;
  perguntaPausandoJogo.value = false;
  if (somRelogio.value) somRelogio.value.pause();

  if (somAtivo.value) {
    if (acertou && somAcerto.value) {
      somAcerto.value.currentTime = 0;
      somAcerto.value.play().catch(() => { });
      // --- ADIÇÃO: Diminuir a vida do boss ao acertar a pergunta dourada ---
      if (bossVida.value > 0) {
        bossVida.value -= 4; // Reduz a vida do boss em 1
        console.log("Boss levou 1 de dano pela pergunta dourada! Vida atual:", bossVida.value);
      }
      // ----------------------------------------------------------------------
    } else if (!acertou && somPerda.value) {
      somPerda.value.currentTime = 0;
      somPerda.value.play().catch(() => { });
      let perdidas = 0;
      for (let i = 0; i < vidas.length && perdidas < 3; i++) {
        if (vidas[i]) {
          vidas[i] = false;
          perdidas++;
        }
      }
      verificarGameOver();
    }
  }

  frameLoop = requestAnimationFrame(gameLoop);
}
// ──────────────────────────────────────────────────────────────
// Verifica Game Over
// ──────────────────────────────────────────────────────────────
function verificarGameOver() {
  if (vidas.every((v) => !v)) {
    gameOver.value = true;
    limparJogo();
    if (somNivel1.value) somNivel1.value.pause();
    if (somGameOver.value && somAtivo.value) {
      somGameOver.value.currentTime = 0;
      somGameOver.value.play().catch(() => { });
    }
    window.addEventListener("keydown", onKeyDown);
  }
}

// ──────────────────────────────────────────────────────────────
// Emitir Vitória de Fase
// ──────────────────────────────────────────────────────────────
const emit = defineEmits(["vencerNivel"]);

function emitirVitoria() {
  emit("vencerNivel");
}

// ──────────────────────────────────────────────────────────────
// Reiniciar Jogo
// ──────────────────────────────────────────────────────────────
function reiniciarJogo() {
  bossKey.value++;
  playerKey.value++;
  limparJogo({ manterTeclado: true }); // Limpa corretamente, mantendo o teclado
  // Reset de vidas e estados visuais
  vidas.splice(0, vidas.length, true, true, true);
  poderes.value.splice(0, poderes.value.length);
  poderVisivel.value = false;

  // Reset de moedas e perguntas
  mostrarMoeda.value = false;
  mostrarMoedaPrata.value = false;
  mostrarMoedaDourada.value = false;
  mostrarPergunta.value = false;
  mostrarPerguntaPrata.value = false;
  mostrarPerguntaDourada.value = false;
  respostaDigitada.value = "";
  tempoRestAnte.value = 10;

  // Reset de posição do player e do boss
  playerX.value = 50;
  jumpY.value = 0;
  bossX.value = window.innerWidth - 400;

  // Reset de controle de jogo
  gameOver.value = false;
  invulneravel.value = false;
  perguntaPausandoJogo.value = false;
  jogoPausado.value = false;

  // Reset do frame loop e timers
  cancelAnimationFrame(frameLoop);
  frameLoop = requestAnimationFrame(gameLoop);

  // Garantir que não há duplicação de evento
  window.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("keyup", onKeyUp);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  // Música
  if (somNivel1.value && somAtivo.value) {
    somNivel1.value.currentTime = 0;
    somNivel1.value.play().catch(() => { });
  }

  // Retorna à tela do jogo (caso esteja vindo do Game Over ou Menu)
  telaAtual.value = "jogo";
}

// ──────────────────────────────────────────────────────────────
// Limpar estados ao desmontar / mudar fase
// ──────────────────────────────────────────────────────────────
function limparJogo({ manterTeclado = false } = {}) {
  if (!manterTeclado) {
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
  }

  // Limpar loops e timers
  cancelAnimationFrame(frameLoop);
  cancelAnimationFrame(tiroAnimFrame);
  clearInterval(timerPergunta);
  clearInterval(moedaAnimacao);
  clearInterval(animacaoPrata);
  clearInterval(animacaoDourada);

  // Resetar sons
  if (somNivel1.value) {
    somNivel1.value.pause();
    somNivel1.value.currentTime = 0;
  }
  if (somRelogio.value) somRelogio.value.pause();

  // Resetar poderes
  poderes.value.splice(0, poderes.value.length);
  poderVisivel.value = false;

  // Resetar moedas e perguntas
  mostrarMoeda.value = false;
  mostrarMoedaPrata.value = false;
  mostrarMoedaDourada.value = false;
  mostrarPergunta.value = false;
  mostrarPerguntaPrata.value = false;
  mostrarPerguntaDourada.value = false;
  respostaDigitada.value = "";
  tempoRestAnte.value = 10;

  // Reset de estados globais
  invulneravel.value = false;
  jogoPausado.value = false;
  perguntaPausandoJogo.value = false;

  // Frame loops zerados
  frameLoop = null;
  tiroAnimFrame = null;
  timerPergunta = null;
  moedaAnimacao = null;
  animacaoPrata = null;
  animacaoDourada = null;
}

// ──────────────────────────────────────────────────────────────
// Liga/Desliga Som
// ──────────────────────────────────────────────────────────────
function toggleSom() {
  if (!somNivel1.value) return;
  somAtivo.value = !somAtivo.value;
  if (somAtivo.value) somNivel1.value.play().catch(() => { });
  else somNivel1.value.pause();
}

// ──────────────────────────────────────────────────────────────
// Liga/Desliga Pause
// ──────────────────────────────────────────────────────────────
function togglePause() {
  jogoPausado.value = !jogoPausado.value;
  if (jogoPausado.value) {
    if (somNivel1.value) somNivel1.value.pause();
    if (timerPergunta) clearInterval(timerPergunta);
    if (frameLoop) cancelAnimationFrame(frameLoop); // Impedir o jogo ficar funcionando quando estiver pausado
  } else {
    if (somAtivo.value && somNivel1.value)
      somNivel1.value.play().catch(() => { });
    if (!perguntaPausandoJogo.value)
      frameLoop = requestAnimationFrame(gameLoop);
  }
}

// ──────────────────────────────────────────────────────────────
// Controla troca de tela e listener de teclado
// ──────────────────────────────────────────────────────────────
watch(telaAtual, (t) => {
  if (t === "jogo") {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    iniciarJogo();
  } else {
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
    limparJogo();
  }
});

onBeforeUnmount(() => {
  clearTimeout(introTimeoutId);
  limparJogo();
});

onMounted(() => {
  exibirIntro();
  const tentarTocarSom = () => {
    if (telaAtual.value === "jogo" && somNivel1.value && somAtivo.value) {
      somNivel1.value.play().catch(() => { });
    }
    window.removeEventListener("click", tentarTocarSom);
  };
  window.addEventListener("click", tentarTocarSom);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
});

// Quando o Player.vue emite estado de “grounded” e “agachado”:
function onPlayerEstado(payload) {
  groundedGlob.value = payload.grounded;
  estaAgachado.value = payload.agachado;
}

function levarDano() {
  if (invulneravel.value || jogoPausado.value) return;

  const idx = vidas.findIndex((v) => v);
  if (idx !== -1) vidas[idx] = false;

  verificarGameOver();

  invulneravel.value = true;
  setTimeout(() => {
    invulneravel.value = false;
  }, 2000);
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");

.cenario {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  image-rendering: pixelated;
  overflow: hidden;
}

.sombra {
  width: 150px;
  height: auto;
  image-rendering: pixelated;
  pointer-events: none;
  opacity: 0.4;
  filter: brightness(0.2);
  z-index: 1;
  bottom: -50px;
}

.sombra-player {
  position: absolute;
  bottom: -60px;
  z-index: 1;
  transition: left 0.1s;
}

.sombra-boss {
  position: absolute;
  bottom: -134px;
  right: 70px;
  width: 320px;
  height: auto;
  image-rendering: pixelated;
  pointer-events: none;
  opacity: 0.2;
  filter: brightness(0.2);
  z-index: 1;
}

.poder {
  position: absolute;
  height: 80px;
  z-index: 2;
  image-rendering: pixelated;
}

.btn-som {
  position: absolute;
  top: 10px;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 20;
  padding: 3em;
}

.btn-som img {
  width: 60px;
  height: 60px;
}

.game-over-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.game-over-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.img-game-over {
  width: 100%;
  max-width: 700px;
  image-rendering: pixelated;
  pointer-events: none;
}

.btn-reiniciar {
  position: absolute;
  bottom: 38.8%;
  font-family: "Press Start 2P", monospace;
  font-size: 16px;
  background: red;
  color: #fff;
  padding: 16px 32px;
  border: 4px solid black;
  box-shadow: 4px 4px black;
  cursor: pointer;
  transition: transform 0.1s;
  z-index: 1000;
}

.btn-reiniciar:hover {
  transform: scale(1.05);
  background: rgb(100, 0, 0);
}

.pause-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9998;
}

.img-pause {
  max-width: 700px;
  image-rendering: pixelated;
  pointer-events: none;
}

.btn-continuar {
  margin-top: 100px;
  font-family: "Press Start 2P", monospace;
  font-size: 16px;
  background: limegreen;
  color: white;
  padding: 16px 32px;
  border: 4px solid black;
  box-shadow: 4px 4px black;
  cursor: pointer;
  transition: transform 0.1s;
  z-index: 1000;
}

.btn-continuar:hover {
  transform: scale(1.05);
  background: green;
}

.moeda-girando {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 180px;
  height: auto;
  image-rendering: pixelated;
  z-index: 10;
}

.moeda-girando-dourada {
  width: 190px;
  height: auto;
  position: absolute;
  left: 30%;
  bottom: 600px;
  z-index: 10;
}

.pergunta-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 9998;
}

.img-pergunta {
  width: 500px;
  pointer-events: none;
}

.contador {
  font-family: "Press Start 2P", monospace;
  font-size: 28px;
  color: #00ff88;
  margin-top: 30px;
}

.intro-hq {
  position: fixed;
  inset: 0;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 9999;
}

.hq-img {
  max-width: 100%;
  max-height: 100vh;
  image-rendering: pixelated;
}

.btn-skip {
  margin-top: 20px;
  font-family: "Press Start 2P", monospace;
  font-size: 14px;
  padding: 12px 24px;
  background: red;
  color: white;
  border: 4px solid black;
  box-shadow: 4px 4px black;
  cursor: pointer;
}

/* Estilos para o tiro de laser */
.tiro {
  position: absolute;
  width: 180px;
  height: auto;
  image-rendering: pixelated;
  z-index: 2;
  pointer-events: none;
}

/* Barra de vida do boss */


.boss-health-wrapper {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  z-index: 20;
  image-rendering: pixelated;
}

.boss-health-bar {
  width: 100%;
  height: 24px;
  background-color: #222;
  border: 2px solid #444;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  image-rendering: pixelated;
}

.boss-health-damage {
  height: 100%;
  background-color: rgba(255, 255, 255, 0.2);
  position: absolute;
  left: 0;
  top: 0;
  transition: width 0.3s ease;
  z-index: 1;
  image-rendering: pixelated;
}

.boss-health-current {
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  transition: width 0.2s ease;
  z-index: 2;
  image-rendering: pixelated;
}
</style>
