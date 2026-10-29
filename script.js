/**
 * ==============================================================================
 * JS EVENT ARCADE - LABORATÓRIO INTERATIVO DE EVENTOS JAVASCRIPT
 * Projeto: Sala de Aula Invertida
 * ==============================================================================
 * 
 * 📚 GUIA DIDÁTICO INTRODUTÓRIO: O QUE SÃO EVENTOS NO JAVASCRIPT?
 * ------------------------------------------------------------------------------
 * No ecossistema web, o JavaScript adota uma arquitetura orientada a eventos 
 * (Event-Driven Architecture). Isso significa que grande parte do código não é 
 * executada sequencialmente do início ao fim, mas sim "fica à espreita" (listening), 
 * aguardando que algo aconteça no navegador.
 * 
 * Essas "coisas que acontecem" são os chamados EVENTOS. Podem ser ações disparadas:
 * 1. Pelo Usuário: Clicar com o mouse, digitar uma letra, rolar a página, etc.
 * 2. Pelo Navegador: Término do carregamento da página, erros de rede, redimensionamento.
 * 
 * 🛠️ O MÉTODO PADRÃO: element.addEventListener(tipo, callback)
 * ------------------------------------------------------------------------------
 * A forma moderna e recomendada de conectar código a um evento é o `addEventListener`:
 * - 1º argumento (tipo): Uma string com o nome exato do evento ('click', 'input', etc.).
 * - 2º argumento (callback): Uma função que será executada automaticamente pelo 
 *   navegador no exato milissegundo em que o evento acontecer.
 * - O navegador injeta nesta função um objeto especial: o "Event Object" (frequentemente 
 *   apelidado de `e` ou `event`), repleto de dados vitais sobre o que acabou de ocorrer!
 * ==============================================================================
 */


// ==============================================================================
// SEÇÃO 1: GERENCIADOR DE ÁUDIO SINTETIZADO (Web Audio API)
// ==============================================================================
/**
 * DIDÁTICA: Web Audio API
 * A Web Audio API é uma interface nativa do navegador para criação e síntese sonora.
 * Em vez de carregar arquivos pesados (.mp3 / .wav), geramos ondas sonoras puras 
 * através de osciladores matemáticos diretamente no hardware de som!
 */
class SoundFX {
  constructor() {
    // Armazena a referência para o contexto de áudio do navegador
    this.ctx = null;
    // Flag booleana que controla se os sons estão habilitados ou silenciados
    this.enabled = true;
  }

  /**
   * Inicializa o contexto de áudio sob demanda.
   * MOTIVO DIDÁTICO: Navegadores modernos (Chrome, Firefox, Safari) bloqueiam
   * a reprodução de áudio automático antes que o usuário interaja com a página
   * (por exemplo, clicando em algum botão). Isso evita páginas barulhentas indesejadas.
   */
  init() {
    if (!this.ctx) {
      // Compatibilidade cruzada com navegadores antigos via webkitAudioContext
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  /**
   * Toca um tom sonoro (bip) baseado em frequência e tipo de onda.
   * @param {number} freq - Frequência em Hertz (Hz). Tons graves: ~100Hz, Tons agudos: ~1000Hz.
   * @param {string} type - Formato da onda: 'sine' (suave), 'square' (retro 8-bits), 'triangle' (flauta), 'sawtooth' (estridente).
   * @param {number} duration - Duração do som em segundos.
   * @param {number} vol - Volume de 0.0 (mudo) até 1.0 (máximo).
   */
  playTone(freq, type = 'sine', duration = 0.15, vol = 0.1) {
    // Se o usuário desligou o som, encerra imediatamente sem tocar nada
    if (!this.enabled) return;

    try {
      this.init();
      if (!this.ctx) return;

      // Se o contexto foi pausado por política de autoplay, reativa-o
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      // 1. Criamos um Nó Oscilador (gera a onda de frequência matemática)
      const osc = this.ctx.createOscillator();

      // 2. Criamos um Nó de Ganho (controla o volume do som gerado)
      const gain = this.ctx.createGain();

      // Define propriedades do som
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Aplica o volume inicial
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);

      // Fade-out suave: reduz o volume gradativamente para 0.0001 para evitar estalo de clique (pop acústico)
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      // Conecta o circuito de áudio: Oscilador -> Controle de Volume -> Caixas de Som do Usuário
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      // Inicia a oscilação imediatamente e agenda o término após 'duration' segundos
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Áudio não suportado ou bloqueado pelo navegador:', e);
    }
  }

  // --- Efeitos sonoros temáticos pré-configurados para os eventos ---

  /** Efeito sonoro sutil para cliques padrão */
  clickPop() {
    this.playTone(520, 'triangle', 0.1, 0.15);
  }

  /** Efeito de estouro grave para o balão da estação CLICK */
  balloonPop() {
    this.playTone(180, 'square', 0.25, 0.2);
    setTimeout(() => this.playTone(80, 'sawtooth', 0.3, 0.25), 50);
  }

  /** Efeito de ronronado agudo para a estação MOUSEOVER */
  purr() {
    this.playTone(320, 'sine', 0.2, 0.1);
    setTimeout(() => this.playTone(480, 'sine', 0.2, 0.12), 100);
  }

  /** Efeito de digitação futurista para a estação INPUT */
  typeBeep() {
    this.playTone(800 + Math.random() * 400, 'sine', 0.04, 0.04);
  }

  /** Efeito de borbulhar de poção para a estação CHANGE */
  potionBubble() {
    this.playTone(300, 'sine', 0.12, 0.1);
    setTimeout(() => this.playTone(450, 'sine', 0.14, 0.12), 80);
    setTimeout(() => this.playTone(600, 'triangle', 0.18, 0.1), 160);
  }

  /** Toca uma nota musical sintetizada para a estação KEYDOWN */
  note(freq) {
    this.playTone(freq, 'sawtooth', 0.22, 0.12);
  }

  /** Efeito de casca rachando para a estação DBLCLICK */
  eggCrack() {
    this.playTone(200, 'square', 0.08, 0.15);
    setTimeout(() => this.playTone(700, 'triangle', 0.25, 0.18), 90);
  }

  /** Som de ativação quando o campo recebe FOCUS */
  focusIn() {
    this.playTone(440, 'sine', 0.15, 0.08);
    setTimeout(() => this.playTone(660, 'sine', 0.2, 0.08), 80);
  }

  /** Som de desativação quando o campo perde foco (BLUR) */
  focusOut() {
    this.playTone(660, 'sine', 0.12, 0.06);
    setTimeout(() => this.playTone(330, 'sine', 0.2, 0.06), 70);
  }

  /** Efeito de propulsão espacial para a estação SUBMIT */
  rocketLaunch() {
    this.playTone(150, 'sawtooth', 1.2, 0.2);
    setTimeout(() => this.playTone(300, 'square', 1.0, 0.15), 300);
    setTimeout(() => this.playTone(600, 'sine', 0.8, 0.15), 700);
  }

  /** Fanfarra de comemoração quando todos os eventos são descobertos */
  fanfare() {
    const notes = [261.63, 329.63, 392.00, 523.25];
    notes.forEach((f, idx) => {
      setTimeout(() => this.playTone(f, 'triangle', 0.3, 0.15), idx * 120);
    });
  }
}

// Cria uma instância única e global do nosso sintetizador sonoro
const sfx = new SoundFX();


// ==============================================================================
// SEÇÃO 2: SISTEMA DE MONITORAMENTO, CONSOLE E CONQUISTAS (ACHIEVEMENTS)
// ==============================================================================
/**
 * DIDÁTICA: Gerenciamento de Estado e Monitoramento em Tempo Real
 * Para transformar o laboratório em uma experiência interativa e gamificada,
 * mantemos um registro de quais eventos o aluno já experimentou e alimentamos
 * um console deslizante com todos os detalhes técnicos disparados.
 */

// Lista dos 10 eventos monitorados pelo sistema
const REQUIRED_EVENTS = [
  'click',
  'mouseover',
  'mouseout',
  'input',
  'change',
  'keydown',
  'dblclick',
  'focus',
  'blur',
  'submit'
];

/**
 * Usamos um Set() em vez de um Array comum para guardar os eventos já descobertos.
 * VANTAGEM DIDÁTICA: O Set armazena apenas valores únicos. Se o usuário disparar
 * 50 vezes o evento 'click', o Set mantém apenas 1 entrada, facilitando saber
 * quando todos os 10 eventos foram desbloqueados!
 */
const discoveredEvents = new Set();

// Contador numérico de todos os eventos disparados durante a sessão atual
let totalEventsFiredCount = 0;

// Filtro ativo no console ('all' ou o nome específico de um evento)
let currentFilter = 'all';

// --- Seleção de Elementos DOM (Document Object Model) via getElementById ---
// Armazenar as referências em constantes evita buscas repetidas e custosas na página
const eventsCountEl = document.getElementById('events-count');
const progressBarEl = document.getElementById('progress-bar');
const badgesContainerEl = document.getElementById('badges-container');
const logsContainerEl = document.getElementById('logs-container');
const logCounterEl = document.getElementById('log-counter');
const totalFiredEl = document.getElementById('total-events-fired');
const consoleDrawerEl = document.getElementById('console-drawer');
const celebrationModalEl = document.getElementById('celebration-modal');

/**
 * Função Central de Registro de Eventos.
 * Chamada internamente sempre que qualquer evento alvo acontece na página.
 * 
 * @param {string} eventName - Nome do evento (ex: 'click', 'keydown')
 * @param {string} targetDesc - Descrição do elemento HTML que foi alvo (ex: 'button#click-btn')
 * @param {string} details - Dados adicionais relevantes (tecla pressionada, coordenadas, etc.)
 */
function logEvent(eventName, targetDesc, details = '') {
  // 1. Incrementa o contador total e atualiza os rótulos na tela
  totalEventsFiredCount++;
  logCounterEl.textContent = totalEventsFiredCount;
  totalFiredEl.textContent = totalEventsFiredCount;

  // 2. Verifica se este evento já foi descoberto pelo aluno
  const normalizedName = eventName.toLowerCase();
  if (REQUIRED_EVENTS.includes(normalizedName) && !discoveredEvents.has(normalizedName)) {
    discoveredEvents.add(normalizedName);
    updateProgress(); // Atualiza a barra de progresso visual
  }

  // 3. Formata o carimbo de data e hora com precisão de milissegundos (HH:MM:SS.mmm)
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;

  // 4. Criação Dinâmica do Elemento HTML do Log
  // Usamos document.createElement() para gerar elementos direto na memória
  const entry = document.createElement('div');
  entry.className = `log-entry ev-${normalizedName}`;
  entry.setAttribute('data-event', normalizedName);

  // Aplica o filtro atual: se o filtro não for 'all' e for diferente deste evento, esconde
  if (currentFilter !== 'all' && currentFilter !== normalizedName) {
    entry.style.display = 'none';
  }

  // Insere a estrutura interna via template string (interpolação `${}`)
  entry.innerHTML = `
    <div class="log-meta">
      <span class="log-name">${eventName}</span>
      <span class="log-time">${timeStr}</span>
    </div>
    <div class="log-target">Alvo: <code>${targetDesc}</code></div>
    ${details ? `<div class="log-details">${details}</div>` : ''}
  `;

  // Se existir a mensagem padrão de "nenhum evento", remove-a
  const emptyMsg = logsContainerEl.querySelector('.empty-log-msg');
  if (emptyMsg) {
    emptyMsg.remove();
  }

  // Insere o novo log sempre NO TOPO da lista com insertBefore
  logsContainerEl.insertBefore(entry, logsContainerEl.firstChild);

  // LIMITAÇÃO DE DESEMPENHO: Mantém no máximo 80 registros para não sobrecarregar a memória
  if (logsContainerEl.children.length > 80) {
    logsContainerEl.removeChild(logsContainerEl.lastChild);
  }
}

/**
 * Atualiza o placar superior, insígnias (badges) e a barra de progresso.
 */
function updateProgress() {
  const count = discoveredEvents.size;
  eventsCountEl.textContent = `${count} / ${REQUIRED_EVENTS.length}`;

  // Calcula a porcentagem concluída para a largura da barra CSS (0% a 100%)
  const pct = (count / REQUIRED_EVENTS.length) * 100;
  progressBarEl.style.width = `${pct}%`;

  // Itera sobre todos os eventos necessários e adiciona a classe 'unlocked' nos badges correspondentes
  REQUIRED_EVENTS.forEach(ev => {
    const badge = badgesContainerEl.querySelector(`[data-event="${ev}"]`);
    if (badge && discoveredEvents.has(ev)) {
      badge.classList.add('unlocked');
    }
  });

  // DISPARO DE CELEBRAÇÃO: Quando todos os 10 eventos são acionados pela primeira vez
  if (count === REQUIRED_EVENTS.length && !sessionStorage.getItem('celebrated')) {
    sessionStorage.setItem('celebrated', 'true');
    setTimeout(() => {
      sfx.fanfare(); // Toca a fanfarra de vitória
      celebrationModalEl.classList.remove('hidden'); // Exibe a janela de sucesso
    }, 600);
  }
}


// ==============================================================================
// SEÇÃO 3: ESTAÇÃO 1 — EVENTO 'CLICK'
// ==============================================================================
/**
 * 📚 CONCEITO DIDÁTICO: O QUE É O EVENTO 'click'?
 * ------------------------------------------------------------------------------
 * O evento 'click' ocorre quando o usuário pressiona E SOLTA o botão principal
 * do mouse sobre o mesmo elemento HTML.
 * Sequência de baixo nível: mousedown -> mouseup -> click.
 * É o evento mais comum da web, usado em botões, links, ícones e menus.
 */

// Seleciona o balão, o botão auxiliar e o mostrador numérico
const balloonEl = document.getElementById('balloon');
const clickBtnEl = document.getElementById('click-btn');
const clickCounterEl = document.getElementById('click-counter');

// Variáveis de controle de estado do balão
let balloonClicks = 0;   // Contagem de cliques no balão atual
let balloonScale = 1.0;  // Escala visual de tamanho (via CSS transform)
let explosionScore = 0;  // Total de balões que o usuário já estourou

/**
 * Função de manipulação do clique do balão.
 * @param {MouseEvent} e - Objeto do evento mouse fornecido pelo navegador.
 */
function handleBalloonClick(e) {
  balloonClicks++;
  sfx.clickPop();

  // DIDÁTICA: O objeto 'e' possui propriedades incríveis como e.clientX e e.clientY,
  // que representam as coordenadas horizontais e verticais do ponteiro na janela!
  logEvent('click', 'div#balloon', `Cliques: ${balloonClicks} | Posição: (X: ${e.clientX}, Y: ${e.clientY})`);

  // Se atingir 5 cliques consecutivos, o balão estoura!
  if (balloonClicks >= 5) {
    sfx.balloonPop();
    explosionScore++;
    clickCounterEl.textContent = explosionScore;

    // Adiciona classe de animação de explosão e troca o emoji
    balloonEl.classList.add('popped');
    balloonEl.innerHTML = '<span class="balloon-face">💥</span>';

    // Agenda o renascimento de um novo balão após a animação de explosão terminar
    setTimeout(() => {
      balloonClicks = 0;
      balloonScale = 1.0;
      balloonEl.classList.remove('popped');
      balloonEl.style.transform = `scale(${balloonScale})`;
      balloonEl.innerHTML = '<span class="balloon-face">🎈</span><div class="balloon-string"></div>';
    }, 650);
  } else {
    // Infla o balão proporcionalmente ao número de cliques
    balloonScale += 0.15;
    balloonEl.style.transform = `scale(${balloonScale})`;
  }
}

// Registra o ouvinte de evento 'click' diretamente no balão
balloonEl.addEventListener('click', handleBalloonClick);

// Permite também acionar via botão de ação abaixo do balão
clickBtnEl.addEventListener('click', (e) => {
  handleBalloonClick(e);
});


// ==============================================================================
// SEÇÃO 4: ESTAÇÃO 2 — EVENTOS 'MOUSEOVER' E 'MOUSEOUT'
// ==============================================================================
/**
 * 📚 CONCEITO DIDÁTICO: O QUE SÃO OS EVENTOS 'mouseover' E 'mouseout'?
 * ------------------------------------------------------------------------------
 * - 'mouseover': Disparado no exato instante em que o ponteiro do mouse ENTRA
 *   nos limites geométricos do elemento (ou em um de seus filhos).
 * - 'mouseout': Disparado no momento em que o ponteiro SAI dos limites do elemento.
 * 
 * Casos de uso clássicos:
 * - Menus dropdown que se abrem ao passar o mouse.
 * - Efeitos visuais de zoom em cartões e produtos de e-commerce.
 * - Caixas de ajuda contextual (Tooltips).
 */

const petAreaEl = document.getElementById('pet-area');
const petEmojiEl = document.getElementById('pet-emoji');
const petSpeechEl = document.getElementById('pet-speech');
const petStateTextEl = document.getElementById('pet-state-text');

// EVENTO 1: MOUSEOVER (O ponteiro entrou na área do gatinho)
petAreaEl.addEventListener('mouseover', (e) => {
  sfx.purr(); // Toca o miado/ronronado
  petEmojiEl.textContent = '😻';
  petSpeechEl.textContent = 'Miau! Que carinho bom! Continue passando o mouse! 💖';
  petStateTextEl.textContent = 'Acordado & Feliz';
  petStateTextEl.className = 'status-badge awake';

  logEvent('mouseover', 'div#pet-area', 'Ponteiro do mouse entrou na área do gatinho.');
});

// EVENTO 2: MOUSEOUT (O ponteiro saiu da área do gatinho)
petAreaEl.addEventListener('mouseout', (e) => {
  petEmojiEl.textContent = '😴';
  petSpeechEl.textContent = 'Zzz... Passe o mouse aqui para me acordar!';
  petStateTextEl.textContent = 'Dormindo';
  petStateTextEl.className = 'status-badge sleep';

  logEvent('mouseout', 'div#pet-area', 'Ponteiro do mouse saiu da área do gatinho.');
});


// ==============================================================================
// SEÇÃO 5: ESTAÇÃO 3 — EVENTO 'INPUT'
// ==============================================================================
/**
 * 📚 CONCEITO DIDÁTICO: O QUE É O EVENTO 'input'?
 * ------------------------------------------------------------------------------
 * O evento 'input' é disparado de forma SÍNCRONA E IMEDIATA sempre que o valor 
 * de um campo `<input>`, `<textarea>` ou `<select>` é modificado.
 * 
 * DIFERENÇA CRUCIAL PARA INICIANTES:
 * - 'input': Dispara caractere por caractere (ao digitar, apagar com Backspace,
 *   colar com Ctrl+V ou recortar com Ctrl+X). Perfeito para buscas em tempo real,
 *   filtros dinâmicos e contadores de caracteres.
 * - 'change': Só dispara quando o usuário TERMINA a edição (ao pressionar Enter
 *   ou clicar fora do campo, perdendo o foco).
 */

const liveInputEl = document.getElementById('live-input');
const robotLiveTextEl = document.getElementById('robot-live-text');
const charCountEl = document.getElementById('char-count');
const wordCountEl = document.getElementById('word-count');
const robotFaceEl = document.getElementById('robot-face');

liveInputEl.addEventListener('input', (e) => {
  // DIDÁTICA: 'e.target' referencia o elemento HTML que originou o evento (neste caso, o input)
  // 'e.target.value' contém a string atualizada com tudo o que está escrito no campo
  const value = e.target.value;
  sfx.typeBeep();

  // Se o campo estiver vazio
  if (value.trim().length === 0) {
    robotLiveTextEl.textContent = 'Aguardando sinal...';
    robotFaceEl.textContent = '🤖';
    charCountEl.textContent = '0';
    wordCountEl.textContent = '0';
  } else {
    // Projeta o texto ao vivo na tela do robô
    robotLiveTextEl.textContent = value;

    // Alterna a expressão do robô dinamicamente baseando-se na paridade de caracteres
    robotFaceEl.textContent = value.length % 2 === 0 ? '🗣️' : '🦾';

    // Atualiza estatísticas em tempo real
    charCountEl.textContent = value.length;

    // Divide o texto por espaços em branco para calcular a quantidade de palavras
    const words = value.trim().split(/\s+/).filter(Boolean);
    wordCountEl.textContent = words.length;
  }

  logEvent('input', 'input#live-input', `Valor atual: "${value}" (Tamanho: ${value.length})`);
});


// ==============================================================================
// SEÇÃO 6: ESTAÇÃO 4 — EVENTO 'CHANGE'
// ==============================================================================
/**
 * 📚 CONCEITO DIDÁTICO: O QUE É O EVENTO 'change'?
 * ------------------------------------------------------------------------------
 * O evento 'change' sinaliza que uma alteração foi CONFIRMADA e consolidada.
 * - Em `<select>`: Dispara no exato instante em que o usuário escolhe uma opção diferente.
 * - Em `<input type="range">`: Dispara quando o usuário solta o controle deslizante.
 * - Em `<input type="text">`: Dispara somente após o usuário alterar o texto e desfocar o campo.
 */

const potionSelectEl = document.getElementById('potion-select');
const potionRangeEl = document.getElementById('potion-range');
const cauldronLiquidEl = document.getElementById('cauldron-liquid');
const potionIconEl = document.getElementById('potion-icon');
const potionMsgEl = document.getElementById('potion-msg');

// Dicionário de temas visuais para cada poção
const potionThemes = {
  water: {
    bg: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.7)',
    icon: '💧',
    msg: 'Água Cristalina preparada com sucesso!'
  },
  fire: {
    bg: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.8)',
    icon: '🔥',
    msg: 'Elixir de Fogo Dracônico em combustão pura!'
  },
  nature: {
    bg: '#10b981',
    glow: 'rgba(16, 185, 129, 0.8)',
    icon: '🌿',
    msg: 'Essência da Floresta infundida com vida!'
  },
  cosmic: {
    bg: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.85)',
    icon: '🌌',
    msg: 'Nebulosa Cósmica destilada com energia estelar!'
  },
  gold: {
    bg: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.9)',
    icon: '🪙',
    msg: 'Ouro Líquido de Midas pronto para transmutação!'
  }
};

/**
 * Atualiza as cores, brilhos e mensagens do caldeirão de acordo com as escolhas confirmadas.
 */
function updatePotion() {
  sfx.potionBubble();
  const formulaKey = potionSelectEl.value; // Chave da poção selecionada
  const intensity = potionRangeEl.value;    // Valor de 10 a 100 do slider
  const theme = potionThemes[formulaKey] || potionThemes.water;

  // Atualização direta de estilos CSS via JavaScript
  cauldronLiquidEl.style.backgroundColor = theme.bg;
  cauldronLiquidEl.style.boxShadow = `0 0 ${intensity / 2 + 10}px ${theme.glow}`;
  cauldronLiquidEl.style.opacity = `${intensity / 100 + 0.3}`;
  potionIconEl.textContent = theme.icon;
  potionMsgEl.textContent = `${theme.msg} (Potência: ${intensity}%)`;
}

// CHANGE no Select: Dispara quando uma nova opção da lista é confirmada
potionSelectEl.addEventListener('change', (e) => {
  updatePotion();
  logEvent('change', 'select#potion-select', `Nova opção selecionada: "${e.target.value}"`);
});

// CHANGE no Range Slider: Dispara quando o usuário solta o botão do mouse após arrastar o controle
potionRangeEl.addEventListener('change', (e) => {
  updatePotion();
  logEvent('change', 'input#potion-range', `Valor de potência confirmado em: ${e.target.value}%`);
});


// ==============================================================================
// SEÇÃO 7: ESTAÇÃO 5 — EVENTO 'KEYDOWN'
// ==============================================================================
/**
 * 📚 CONCEITO DIDÁTICO: O QUE É O EVENTO 'keydown'?
 * ------------------------------------------------------------------------------
 * O evento 'keydown' ocorre no momento em que qualquer tecla física do teclado
 * é pressionada para baixo.
 * 
 * DIFERENÇA ENTRE 'e.key' E 'e.code':
 * - 'e.key': Representa o valor textual impresso (ex: "a", "A", "Enter", "ArrowUp").
 *   Leva em consideração se Shift ou CapsLock estão ativados.
 * - 'e.code': Representa a tecla FÍSICA do hardware no teclado (ex: "KeyA", "Space", "Digit1").
 *   Não muda mesmo se o teclado estiver em outro idioma.
 */

const keyNameEl = document.getElementById('key-name');
const keyCodeEl = document.getElementById('key-code');
const dancerEl = document.getElementById('dancer');
const danceFloorEl = document.getElementById('dance-floor');

// Mapeamento das frequências musicais (em Hertz) para o piano interativo
const pianoNotes = {
  a: 261.63, // Nota Dó (C4)
  s: 293.66, // Nota Ré (D4)
  d: 329.63, // Nota Mi (E4)
  f: 349.23, // Nota Fá (F4)
  g: 392.00, // Nota Sol (G4)
  h: 440.00, // Nota Lá (A4)
  j: 493.88, // Nota Si (B4)
  space: 523.25 // Nota Dó agudo (C5)
};

// Conjunto de dançarinos para alternar a cada batida do teclado
const dancerEmojis = ['🕺', '💃', '👯‍♂️', '🕴️', '🤸', '🎉'];

/**
 * Função executada tanto pelo teclado físico quanto pelos cliques nas teclas virtuais.
 * @param {string} keyChar - Caractere da tecla
 * @param {string} codeStr - Código físico da tecla
 */
function triggerKeyAction(keyChar, codeStr) {
  const normalizedKey = keyChar.toLowerCase();

  // 1. Atualiza as informações visuais no monitor da estação
  keyNameEl.textContent = keyChar === ' ' ? 'Espaço (Space)' : keyChar;
  keyCodeEl.textContent = codeStr;

  // 2. Animação do Dançarino:
  // TRUQUE DIDÁTICO: Para reiniciar uma animação CSS no mesmo elemento,
  // removemos a classe, forçamos um reflow com `offsetWidth` e recolocamos a classe!
  dancerEl.classList.remove('groove');
  void dancerEl.offsetWidth; // Força o motor de renderização do navegador a recalcular o layout
  dancerEl.classList.add('groove');

  // Sorteia um novo dançarino da lista
  const randomEmoji = dancerEmojis[Math.floor(Math.random() * dancerEmojis.length)];
  dancerEl.textContent = randomEmoji;

  // 3. Execução sonora da nota musical
  if (pianoNotes[normalizedKey]) {
    sfx.note(pianoNotes[normalizedKey]);
  } else if (normalizedKey === ' ') {
    sfx.note(pianoNotes['space']);
  } else {
    // Para qualquer outra tecla aleatória, calcula uma frequência harmônica baseada no código ASCII
    const customPitch = 200 + (keyChar.charCodeAt(0) % 25) * 20;
    sfx.note(customPitch);
  }

  // 4. Ilumina a tecla virtual na tela caso ela exista
  const targetKeyBtn = document.querySelector(`.vkey[data-key="${normalizedKey === ' ' ? 'space' : normalizedKey}"]`);
  if (targetKeyBtn) {
    targetKeyBtn.classList.add('pressed');
    setTimeout(() => targetKeyBtn.classList.remove('pressed'), 200);
  }
}

// OUVINTE GLOBAL 'keydown': Captura teclas pressionadas em qualquer lugar da página
window.addEventListener('keydown', (e) => {
  // Se o usuário estiver digitando dentro de outro campo de texto (como o robô),
  // não interferimos na digitação dele
  if (e.target.tagName === 'INPUT' && e.target.id !== 'secret-agent-input') {
    return;
  }

  triggerKeyAction(e.key, e.code);

  // DIDÁTICA: Podemos inspecionar teclas modificadoras no objeto de evento:
  // e.altKey, e.ctrlKey, e.shiftKey retornam 'true' se estiverem pressionadas em conjunto!
  logEvent('keydown', 'window', `Tecla: "${e.key}" | Código: "${e.code}" | Alt: ${e.altKey} | Ctrl: ${e.ctrlKey}`);
});

// Permite também tocar o sintetizador clicando com o mouse nas teclas virtuais
document.querySelectorAll('.vkey').forEach(btn => {
  btn.addEventListener('click', () => {
    const keyAttr = btn.getAttribute('data-key');
    const displayKey = keyAttr === 'space' ? ' ' : keyAttr.toUpperCase();
    triggerKeyAction(displayKey, `Key${keyAttr.toUpperCase()}`);
    logEvent('keydown', `button.vkey[${keyAttr}]`, `Tecla virtual acionada: "${displayKey}"`);
  });
});


// ==============================================================================
// SEÇÃO 8: ESTAÇÃO 6 — EVENTO 'DBLCLICK' (DUPLO CLIQUE)
// ==============================================================================
/**
 * 📚 CONCEITO DIDÁTICO: O QUE É O EVENTO 'dblclick'?
 * ------------------------------------------------------------------------------
 * O evento 'dblclick' ocorre quando o usuário dispara dois cliques rápidos no
 * mesmo elemento em um intervalo de tempo muito curto (geralmente menos de 300ms a 500ms).
 * 
 * ATENÇÃO PEDAGÓGICA:
 * Quando o usuário dá um duplo clique, o navegador dispara a sequência:
 * click -> click -> dblclick.
 * Por isso, é comum proteger elementos para que o clique simples não atrapalhe
 * a ação principal do duplo clique, como demonstrado abaixo.
 */

const dragonEggEl = document.getElementById('dragon-egg');
const dragonBabyEl = document.getElementById('dragon-baby');
const eggHintEl = document.getElementById('egg-hint');
const resetEggBtn = document.getElementById('reset-egg-btn');

let eggHatched = false; // Flag de estado para saber se o dragão já nasceu

// Clique simples: Não choca o ovo, apenas faz tremer e ensina o usuário
dragonEggEl.addEventListener('click', () => {
  if (eggHatched) return;

  // Faz o ovo tremer
  dragonEggEl.classList.remove('shake');
  void dragonEggEl.offsetWidth;
  dragonEggEl.classList.add('shake');
  sfx.clickPop();

  eggHintEl.innerHTML = '⚠️ Um clique só não quebra a casca mágica! Dê um <strong>DUPLO CLIQUE RÁPIDO</strong>!';
});

// EVENTO DBLCLICK: Apenas dois cliques rápidos conseguem chocar o ovo!
dragonEggEl.addEventListener('dblclick', (e) => {
  if (eggHatched) return;
  eggHatched = true;

  sfx.eggCrack(); // Som de casca quebrando
  dragonEggEl.classList.add('hidden');
  dragonBabyEl.classList.remove('hidden');
  resetEggBtn.classList.remove('hidden');
  eggHintEl.innerHTML = '✨ <strong>O dragão nasceu!</strong> Você dominou o evento <code>dblclick</code>!';

  logEvent('dblclick', 'div#dragon-egg', `Ovo chocado com sucesso! Posição: (X: ${e.clientX}, Y: ${e.clientY})`);
});

// Botão para resetar o ovo e permitir que os alunos testem novamente
resetEggBtn.addEventListener('click', () => {
  eggHatched = false;
  dragonBabyEl.classList.add('hidden');
  dragonEggEl.classList.remove('hidden');
  resetEggBtn.classList.add('hidden');
  eggHintEl.innerHTML = 'Dê um <strong>DUPLO CLIQUE</strong> rápido no ovo para chocá-lo!';
  sfx.clickPop();
});


// ==============================================================================
// SEÇÃO 9: ESTAÇÃO 7 — EVENTOS 'FOCUS' E 'BLUR'
// ==============================================================================
/**
 * 📚 CONCEITO DIDÁTICO: O QUE SÃO OS EVENTOS 'focus' E 'blur'?
 * ------------------------------------------------------------------------------
 * Ambos estão intimamente ligados à acessibilidade, usabilidade e navegação por teclado:
 * - 'focus': Ocorre quando um elemento se torna ativo e recebe a atenção do usuário 
 *   (seja por um clique do mouse ou pela navegação com a tecla Tab).
 * - 'blur': Ocorre quando o elemento PERDE a atenção (o usuário clica em outro 
 *   lugar ou pressiona Tab para ir ao próximo campo).
 * 
 * Uso no mundo real:
 * - 'focus': Destacar campos com bordas coloridas, exibir balões com dicas de preenchimento.
 * - 'blur': Validar dados assim que o usuário termina o campo (ex: avisar na hora se o CPF/E-mail é inválido).
 */

const secretInputEl = document.getElementById('secret-agent-input');
const spotlightRoomEl = document.getElementById('spotlight-room');
const guardianAvatarEl = document.getElementById('guardian-avatar');
const guardianDialogueEl = document.getElementById('guardian-dialogue');
const badgeFocusEl = document.getElementById('badge-focus');
const badgeBlurEl = document.getElementById('badge-blur');

// EVENTO 1: FOCUS (Entrada no campo)
secretInputEl.addEventListener('focus', () => {
  sfx.focusIn();

  // Acende os holofotes na sala e desperta a coruja guardiã
  spotlightRoomEl.classList.add('active-focus');
  guardianAvatarEl.textContent = '👀';
  guardianDialogueEl.textContent = '🚨 Holofotes ligados! O sistema detectou seu FOCUS!';

  // Atualiza indicadores visuais
  badgeFocusEl.textContent = 'FOCUS: ATIVO ✅';
  badgeFocusEl.classList.add('active');

  badgeBlurEl.textContent = 'BLUR: Inativo';
  badgeBlurEl.classList.remove('active');

  logEvent('focus', 'input#secret-agent-input', 'Elemento ganhou foco (usuário interagindo diretamente).');
});

// EVENTO 2: BLUR (Saída do campo)
secretInputEl.addEventListener('blur', () => {
  sfx.focusOut();

  // Apaga os holofotes e acalma a coruja
  spotlightRoomEl.classList.remove('active-focus');
  guardianAvatarEl.textContent = '🦉';
  guardianDialogueEl.textContent = '🌙 Holofotes desligados. Você acionou o evento BLUR ao sair!';

  // Atualiza indicadores visuais
  badgeFocusEl.textContent = 'FOCUS: Inativo';
  badgeFocusEl.classList.remove('active');

  badgeBlurEl.textContent = 'BLUR: ATIVO ✅';
  badgeBlurEl.classList.add('active');

  logEvent('blur', 'input#secret-agent-input', 'Elemento perdeu o foco (usuário desviou a atenção).');
});


// ==============================================================================
// SEÇÃO 10: ESTAÇÃO 8 — EVENTO 'SUBMIT'
// ==============================================================================
/**
 * 📚 CONCEITO DIDÁTICO: O QUE É O EVENTO 'submit' E POR QUE USAR 'preventDefault()'?
 * ------------------------------------------------------------------------------
 * O evento 'submit' é disparado em uma tag `<form>` quando o usuário submete os dados,
 * geralmente clicando em um `<button type="submit">` ou pressionando Enter dentro do formulário.
 * 
 * ⚠️ O COMPORTAMENTO PADRÃO DO NAVEGADOR:
 * Desde a década de 1990, o comportamento nativo do navegador ao receber um 'submit'
 * é empacotar os campos e recarregar toda a página enviando uma requisição HTTP.
 * 
 * 💡 A MÁGICA DO 'e.preventDefault()':
 * Ao chamar `e.preventDefault()`, nós instruímos o navegador a NÃO RECARREGAR a página!
 * Isso nos dá controle total para validar os dados, disparar animações e comunicar 
 * com APIs em segundo plano (Fetch/AJAX), que é a base de aplicações modernas (SPAs).
 */

const rocketFormEl = document.getElementById('rocket-form');
const rocketEl = document.getElementById('rocket');
const rocketFlameEl = document.getElementById('rocket-flame');
const launchTerminalEl = document.getElementById('launch-terminal');
const launchButtonEl = document.getElementById('launch-button');

let isLaunching = false; // Impede envios múltiplos simultâneos enquanto o foguete sobe

rocketFormEl.addEventListener('submit', (e) => {
  // PASSO ESSENCIAL: Evita que a página seja recarregada!
  e.preventDefault();

  if (isLaunching) return;
  isLaunching = true;

  // Leitura dos valores preenchidos nos campos do formulário
  const pilotName = document.getElementById('pilot-name').value;
  const destination = document.getElementById('destination-planet').value;
  const crewCount = document.getElementById('crew-count').value;

  sfx.rocketLaunch(); // Efeito de decolagem espacial

  logEvent('submit', 'form#rocket-form', `Formulário enviado! Piloto: "${pilotName}", Destino: "${destination}", Tripulação: ${crewCount}`);

  // Desativa o botão temporariamente durante o voo
  launchButtonEl.disabled = true;
  launchButtonEl.style.opacity = '0.6';

  // Mensagem no terminal de lançamento
  launchTerminalEl.innerHTML = `<span class="terminal-cursor">></span> Contagem regressiva iniciada para ${destination.toUpperCase()}... 3, 2, 1! 🚀`;

  // Ativa as chamas e a animação CSS de decolagem vertical
  rocketFlameEl.classList.remove('hidden');
  rocketEl.classList.add('launching');

  // Mensagem de sucesso após a decolagem
  setTimeout(() => {
    launchTerminalEl.innerHTML = `✅ <strong>SUCESSO!</strong> O Comandante ${pilotName} e sua equipe de ${crewCount} astronautas partiram rumo a ${destination}!`;
  }, 1200);

  // Restaura o foguete na plataforma após o pouso para permitir novas experiências
  setTimeout(() => {
    rocketEl.classList.remove('launching');
    rocketFlameEl.classList.add('hidden');
    launchButtonEl.disabled = false;
    launchButtonEl.style.opacity = '1';
    isLaunching = false;
  }, 3200);
});


// ==============================================================================
// SEÇÃO 11: CONTROLES GLOBAIS (ÁUDIO, GAVETA DO CONSOLE E MODAL)
// ==============================================================================
/**
 * DIDÁTICA: Interface do Usuário (UI) Reativa
 * Conectamos os botões utilitários da página (abrir console, alternar som,
 * limpar registros e filtrar eventos) usando a mesma mecânica de 'click'.
 */

const toggleSoundBtn = document.getElementById('toggle-sound-btn');
const soundStatusEl = document.getElementById('sound-status');
const toggleConsoleBtn = document.getElementById('toggle-console-btn');
const closeConsoleBtn = document.getElementById('close-console-btn');
const clearLogsBtn = document.getElementById('clear-logs-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const filterChips = document.querySelectorAll('.chip');

// Ligar/Desligar Som: Alterna a flag booleana e atualiza o botão
toggleSoundBtn.addEventListener('click', () => {
  sfx.enabled = !sfx.enabled;
  if (sfx.enabled) {
    soundStatusEl.textContent = 'Som: ON';
    toggleSoundBtn.querySelector('.icon').textContent = '🔊';
    sfx.clickPop();
  } else {
    soundStatusEl.textContent = 'Som: OFF';
    toggleSoundBtn.querySelector('.icon').textContent = '🔇';
  }
  logEvent('click', 'button#toggle-sound-btn', `Som alternado para: ${sfx.enabled ? 'Ligado' : 'Desligado'}`);
});

// Abrir e fechar a gaveta do console deslizante
toggleConsoleBtn.addEventListener('click', () => {
  consoleDrawerEl.classList.toggle('open');
  sfx.clickPop();
});

closeConsoleBtn.addEventListener('click', () => {
  consoleDrawerEl.classList.remove('open');
  sfx.clickPop();
});

// Limpar o histórico de logs do console
clearLogsBtn.addEventListener('click', () => {
  logsContainerEl.innerHTML = '<div class="empty-log-msg">Logs limpos. Interaja com as estações para gerar novos eventos!</div>';
  sfx.clickPop();
});

// Filtros do Console: Itera sobre cada botão de filtro (chip) e adiciona um ouvinte
filterChips.forEach(chip => {
  chip.addEventListener('click', () => {
    // Remove a classe 'active' de todos e adiciona apenas no que foi clicado
    filterChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    // Lê o atributo data-filter definido no HTML
    currentFilter = chip.getAttribute('data-filter');
    const allEntries = logsContainerEl.querySelectorAll('.log-entry');

    // Exibe ou oculta cada linha de log conforme o filtro selecionado
    allEntries.forEach(entry => {
      const evType = entry.getAttribute('data-event');
      if (currentFilter === 'all' || currentFilter === evType) {
        entry.style.display = 'flex';
      } else {
        entry.style.display = 'none';
      }
    });
    sfx.clickPop();
  });
});

// Fechar o modal de celebração final
closeModalBtn.addEventListener('click', () => {
  celebrationModalEl.classList.add('hidden');
  sfx.clickPop();
});

/**
 * 📚 CONCEITO DIDÁTICO: O EVENTO 'DOMContentLoaded'
 * ------------------------------------------------------------------------------
 * Disparado no objeto `window` ou `document` quando todo o documento HTML foi 
 * completamente analisado (parsed) e a árvore DOM está pronta para ser manipulada 
 * com segurança pelo JavaScript.
 */
window.addEventListener('DOMContentLoaded', () => {
  logEvent('init', 'window', 'Arcade de Eventos JavaScript carregado e pronto para interação!');
});
