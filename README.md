Arquivo criado para desenvolvimento do curso da Alura (https://cursos.alura.com.br/course/chatgpt-javascript-construa-jogo-pong)
Jogo desenvolvido com ajuda do ChatGPT 4.1.

# Pong Game 🎮

> Versão moderna do clássico Pong single player, desenvolvida em JavaScript usando a biblioteca [p5.js](https://p5js.org/) com interface de seleção de dificuldade, sprites customizados, efeitos sonoros, narração de placar e tela de menu estilizada.

---

## 🚀 Demonstração

Clique para jogar online: https://lucas-kiozy.github.io/Pong/


---

## 🖥️ Tecnologias & Bibliotecas

- **JavaScript (ES6)**
- **p5.js** — [p5js.org](https://p5js.org/) (para lógica, desenho, interação)
- **p5.sound** — [p5js.org/reference/#/libraries/p5.sound](https://p5js.org/reference/#/libraries/p5.sound) (para sons e música)
- **HTML5** e **CSS3** básicos (estrutura e customização)
- Sprites customizados e arquivos de som (`/Sprites` e `/Sounds`)

---

## 🎨 Features

- **Jogo clássico Pong**: single player contra computador
- **Menu inicial** e seleção de dificuldade (Fácil, Normal, Difícil)
- **Sprites e sons customizados** (fundo, raquetes, bola)
- **Narração automática do placar** (Web Speech API)
- **Finalização com mensagem e som**
- **Controle via mouse** (movimente a raquete para cima/baixo)
- **Responsividade visual** para PC/notebook

---

## 📁 Estrutura do Projeto

Pong/
├── index.html
├── sketch.js
├── style.css
├── /Sprites/
│ ├── fundo1.png
│ ├── fundo2.png
│ ├── barra01.png
│ ├── barra02.png
│ └── bola.png
├── /Sounds/
│ ├── bounce.wav
│ └── finish.wav
└── README.md

---

## ⚡ Como rodar o projeto localmente

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/lucas-kiozy/Pong.git
   cd Pong
2. Baixe as bibliotecas p5.js e p5.sound.js
(ou use o CDN — já incluso no exemplo do index.html)

3. Abra o arquivo index.html em seu navegador

  Clique duas vezes no arquivo index.html
  OU
  Rode um servidor local (recomendado para som funcionar corretamente):

# Com Python 3.x
python -m http.server 8000
# Depois acesse: http://localhost:8000/

Ou use extensões como "Live Server" no VS Code.

4. Jogue!

  Use o mouse para controlar sua raquete.
  Escolha a dificuldade e divirta-se!

📦 Dependências
p5.js

p5.sound.js

Ambos já referenciados via CDN no index.html. Não precisa instalar nada via NPM.

💡 Personalização
Para trocar sprites ou sons, substitua os arquivos na pasta /Sprites ou /Sounds.

Para editar o placar final para vitória, altere a constante PONTUACAO_FINAL no início do arquivo sketch.js.

Se quiser mudar as dificuldades, altere o array DIFICULDADES.

📝 Créditos e Licença
Desenvolvido por Lucas Silva — projeto para estudo e portfólio.
Sinta-se livre para sugerir melhorias ou abrir PRs!
