# ⚡ JS Event Arcade — Laboratório Interativo de Eventos JavaScript

> **Projeto Sala de Aula Invertida**  
> Um sistema interativo, gamificado e visualmente envolvente desenvolvido para ensinar e praticar os principais eventos da linguagem JavaScript no navegador.

---

## 🎮 Visão Geral do Projeto

O **JS Event Arcade** transforma o aprendizado de eventos JavaScript em uma experiência prática estilo fliperama/laboratório gamer. Cada evento possui uma estação interativa dedicada com feedbacks visuais, efeitos sonoros sintetizados nativos (sem arquivos externos) e monitoramento em tempo real.

---

## 🧪 Estações & Eventos Abordados

| # | Evento | Estação Interativa | O que acontece na prática? |
|---|--------|--------------------|----------------------------|
| 1 | **`click`** | 💥 **Estourador de Balões** | O usuário clica para inflar o balão. A cada clique ele cresce até atingir o limite e estourar com efeito de partículas! |
| 2 | **`mouseover` & `mouseout`** | 🐱 **O Gatinho Mágico** | Ao passar o mouse por cima (`mouseover`), o gatinho acorda e ronrona. Ao afastar o mouse (`mouseout`), ele volta a dormir tranquilamente. |
| 3 | **`input`** | 🤖 **Robô Transmissor** | Dispara **instantaneamente a cada caractere** digitado ou apagado, transmitindo a mensagem para a tela do robô e contando letras/palavras. |
| 4 | **`change`** | 🧪 **Caldeirão Alquímico** | Dispara quando a escolha é **confirmada** (ao selecionar um elixir diferente no `<select>` ou ao soltar o slider de intensidade). |
| 5 | **`keydown`** | 🎹 **Pista de Dança & Sintetizador** | Qualquer tecla pressionada no teclado físico emite notas musicais com a Web Audio API, ilumina o teclado virtual e faz o dançarino se mover. |
| 6 | **`dblclick`** | 🥚 **O Ovo do Dragão Lendário** | Um clique simples apenas faz o ovo tremer. É necessário um **duplo clique rápido** para quebrar a casca e chocar o dragãozinho! |
| 7 | **`focus` & `blur`** | 🔦 **O Guardião dos Holofotes** | Ao clicar no campo de texto (`focus`), os holofotes se acendem e o guardião fica alerta. Ao clicar fora (`blur`), as luzes se apagam. |
| 8 | **`submit`** | 🚀 **Centro de Lançamento Espacial** | Ao enviar o formulário, o método `e.preventDefault()` bloqueia o recarregamento da página e aciona a decolagem do foguete orbital! |

---

## ✨ Recursos Especiais

1. **Monitor de Eventos em Tempo Real (Console Drawer)**:
   - Registra todos os eventos disparados com carimbo de hora (`HH:MM:SS.mmm`), elemento alvo e parâmetros detalhados (ex: tecla pressionada, valor digitado, coordenadas).
   - Possui filtro dinâmico por tipo de evento e botão para limpar logs.

2. **Áudio 100% Nativo (Web Audio API)**:
   - Sintetizador de frequências sonoras geradas em código.
   - Não depende de arquivos MP3 ou de internet para tocar os efeitos de clique, miado, digitação, decolagem e notas musicais.
   - Botão para ativar/desativar o som a qualquer momento.

3. **Gamificação com Barra de Conquistas**:
   - Conforme o aluno experimenta cada evento, a respectiva insígnia é desbloqueada no cabeçalho.
   - Ao acionar todos os eventos, uma tela de comemoração especial é exibida!

4. **Design Moderno e Responsivo**:
   - Paleta estilo Cyber-Dark com acentos neon distintos para cada evento.
   - Efeitos de glassmorphism (vidro fosco), animações fluídas em CSS puro e compatível com telas de computadores, tablets e smartphones.

---

## 🚀 Como Executar o Projeto

1. Não é necessário instalar nenhum pacote nem rodar servidores complexos.
2. Basta abrir o arquivo [`index.html`](file:///c:/Users/SN00173742/Desktop/Projeto%20Sala%20de%20Aula%20Invertida/eventos/index.html) diretamente no seu navegador preferido (Google Chrome, Microsoft Edge, Firefox, etc.).
3. Se desejar usar com o Live Server do VS Code, clique com o botão direito em `index.html` e selecione **"Open with Live Server"**.

---

## 📁 Estrutura dos Arquivos

```text
eventos/
├── index.html   # Estrutura semântica e estações de cada evento
├── style.css    # Estilização moderna, neon glows, animações e layout responsivo
├── script.js    # Lógica de captura de eventos, sintetizador de som e logger
└── README.md    # Documentação pedagógica do projeto
```

