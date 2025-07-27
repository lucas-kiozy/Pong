// ====== Configurações Gerais ======
const RAQUETE_W = 13;
const RAQUETE_H = 86;
const BOLA_SIZE = 18;
const BOLA_VEL_BASE = 7.34;
const FATOR_AUMENTO = 1.06;
const PONTUACAO_FINAL = 5;
const GAME_VERSION = "v1.0.0";

// ====== Dificuldades ======
const DIFICULDADES = [
  { nome: "Fácil", velocidade: 3 },
  { nome: "Normal", velocidade: 6 },
  { nome: "Difícil", velocidade: 10 },
];

// ====== Assets ======
let fundo, fundoMenu, imgBarraJogador, imgBarraComputador, imgBola;
let bounceSound, finishSound;

// ====== Estado ======
let estadoJogo = "menu"; // "menu", "dificuldade", "jogando", "fim"
let dificuldadeSelecionada = 1; // 0: Fácil, 1: Normal, 2: Difícil
let placarJogador = 0, placarComputador = 0;
let bola, jogador, computador;
let bolaAngulo = 0;
let jogoFinalizado = false;
let vencedor = "";

// ====== Pré-carregamento de recursos ======
function preload() {
  fundo = loadImage("Sprites/fundo1.png");
  fundoMenu = loadImage("Sprites/fundo2.png");
  imgBarraJogador = loadImage("Sprites/barra01.png");
  imgBarraComputador = loadImage("Sprites/barra02.png");
  imgBola = loadImage("Sprites/bola.png");
  bounceSound = loadSound("Sounds/bounce.wav");
  finishSound = loadSound("Sounds/finish.wav");
}

// ====== Setup ======
function setup() {
  createCanvas(800, 500);
  textFont("monospace");
  resetJogo();
}

// ====== Reset jogo e round ======
function resetJogo() {
  placarJogador = 0;
  placarComputador = 0;
  jogoFinalizado = false;
  vencedor = "";
  resetarBola();
  jogador = {
    x: 32,
    y: height / 2 - RAQUETE_H / 2,
    w: RAQUETE_W,
    h: RAQUETE_H,
  };
  computador = {
    x: width - 32 - RAQUETE_W,
    y: height / 2 - RAQUETE_H / 2,
    w: RAQUETE_W,
    h: RAQUETE_H,
  };
}

// ====== Draw ======
function draw() {
  background(0);
  if (estadoJogo === "menu") {
    desenharMenu();
  } else if (estadoJogo === "dificuldade") {
    desenharSelecaoDificuldade();
  } else if (estadoJogo === "jogando" || estadoJogo === "fim") {
    desenharJogo();
  }
  desenharVersao();
}

// ====== Menus ======
function desenharMenu() {
  desenharFundoMenu();
  // Título estilizado
  textAlign(CENTER, CENTER);
  textSize(94);
  fill(255, 255, 255, 230);
  stroke(60, 180, 255, 130);
  strokeWeight(7);
  text("Pong Espacial", width / 2, height / 2 - 60);
  strokeWeight(0);
  noStroke();
  desenharBotao(width / 2 - 100, height / 2 + 10, 200, 60, "Novo jogo");
}

function desenharSelecaoDificuldade() {
  desenharFundoMenu();
  textAlign(CENTER, CENTER);
  textSize(42);
  fill(255, 255, 255, 230);
  stroke(120, 220, 255, 100);
  strokeWeight(5);
  text("Selecione a dificuldade", width / 2, height / 2 - 80);
  strokeWeight(0);

  for (let i = 0; i < DIFICULDADES.length; i++) {
    let y = height / 2 + i * 70;
    desenharBotao(
      width / 2 - 100,
      y,
      200,
      50,
      DIFICULDADES[i].nome,
      dificuldadeSelecionada === i
    );
  }
}

function desenharFundoMenu() {
  let s = min(fundoMenu.width, fundoMenu.height);
  let sx = (fundoMenu.width - s) / 2;
  let sy = (fundoMenu.height - s) / 2;
  image(fundoMenu, 0, 0, width, height, sx, sy, s, s);
  fill(10, 20, 40, 120);
  rect(0, 0, width, height); // Leve escurecimento para destaque do texto
}

// ====== Jogo ======
function desenharJogo() {
  let s = min(fundo.width, fundo.height);
  let sx = (fundo.width - s) / 2;
  let sy = (fundo.height - s) / 2;
  image(fundo, 0, 0, width, height, sx, sy, s, s);

  if (jogoFinalizado) {
    fill(40, 0, 80, 200);
    rect(0, 0, width, height);
    textSize(54);
    textAlign(CENTER, CENTER);
    fill(240, 220, 255);
    text(vencedor + " venceu!", width / 2, height / 2 - 40);
    textSize(32);
    fill(220, 220, 250);
    text(
      "Placar final: " + placarJogador + " x " + placarComputador,
      width / 2,
      height / 2 + 16
    );
    desenharBotao(width / 2 - 80, height / 2 + 80, 160, 45, "Menu");
    return;
  }

  let velocidadeAtual = sqrt(bola.vx * bola.vx + bola.vy * bola.vy);
  bolaAngulo += velocidadeAtual * 0.015;

  bola.x += bola.vx;
  bola.y += bola.vy;

  if (bola.y < 0 || bola.y + BOLA_SIZE > height) {
    bola.vy *= -1;
    bola.y = constrain(bola.y, 0, height - BOLA_SIZE);
  }

  jogador.y = constrain(mouseY - jogador.h / 2, 0, height - jogador.h);
  moverComputador();

  image(imgBarraJogador, jogador.x, jogador.y, jogador.w, jogador.h);
  image(imgBarraComputador, computador.x, computador.y, computador.w, computador.h);

  push();
  translate(bola.x + BOLA_SIZE / 2, bola.y + BOLA_SIZE / 2);
  rotate(bolaAngulo);
  imageMode(CENTER);
  image(imgBola, 0, 0, BOLA_SIZE, BOLA_SIZE);
  pop();

  // Colisões e placar
  if (bola.x < -BOLA_SIZE) {
    placarComputador++;
    if (placarComputador < PONTUACAO_FINAL) narrarPlacar();
    checaFinal();
    if (!jogoFinalizado) resetarBola(-1);
    return;
  }
  if (bola.x > width) {
    placarJogador++;
    if (placarJogador < PONTUACAO_FINAL) narrarPlacar();
    checaFinal();
    if (!jogoFinalizado) resetarBola(1);
    return;
  }

  if (colide(jogador, bola) && bola.vx < 0) {
    bola.x = jogador.x + jogador.w + 3;
    bola.vel *= FATOR_AUMENTO;
    let angulo = calculaAngulo(jogador, bola);
    bola.vx = abs(bola.vel * cos(angulo));
    bola.vy = bola.vel * sin(angulo);
    if (bounceSound.isLoaded()) bounceSound.play();
  } else if (colide(computador, bola) && bola.vx > 0) {
    bola.x = computador.x - BOLA_SIZE - 3;
    bola.vel *= FATOR_AUMENTO;
    let angulo = calculaAngulo(computador, bola);
    bola.vx = -abs(bola.vel * cos(angulo));
    bola.vy = bola.vel * sin(angulo);
    if (bounceSound.isLoaded()) bounceSound.play();
  }

  textSize(46);
  textAlign(CENTER, TOP);
  fill(200, 230, 255);
  text(placarJogador, width / 2 - 60, 10);
  text(placarComputador, width / 2 + 60, 10);
}

// ====== Utilitários ======
function desenharBotao(x, y, w, h, label, destaque = false) {
  push();
  rectMode(CORNER);
  textAlign(CENTER, CENTER);
  noStroke();
  fill(destaque ? "#448cff" : "#1a2533cc");
  rect(x, y, w, h, 14);
  fill(destaque ? "#fff" : "#eaf6ff");
  textSize(26);
  text(label, x + w / 2, y + h / 2 + 2);
  pop();
}

function desenharVersao() {
  fill(200, 200, 200, 110);
  textAlign(RIGHT, BOTTOM);
  textSize(14);
  text(GAME_VERSION, width - 10, height - 6);
}

// ====== Mouse ======
function mousePressed() {
  if (estadoJogo === "menu") {
    if (mouseSobreBotao(width / 2 - 100, height / 2 + 10, 200, 60)) {
      estadoJogo = "dificuldade";
    }
  } else if (estadoJogo === "dificuldade") {
    for (let i = 0; i < DIFICULDADES.length; i++) {
      let y = height / 2 + i * 70;
      if (mouseSobreBotao(width / 2 - 100, y, 200, 50)) {
        dificuldadeSelecionada = i;
        resetJogo();
        estadoJogo = "jogando";
        break;
      }
    }
  } else if (estadoJogo === "fim") {
    if (mouseSobreBotao(width / 2 - 80, height / 2 + 80, 160, 45)) {
      estadoJogo = "menu";
      resetJogo();
    }
  }
}

function mouseSobreBotao(x, y, w, h) {
  return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
}

// ====== Lógica do jogo ======
function resetarBola(sentido = 0) {
  let dir = sentido === 0 ? random([1, -1]) : sentido;
  let angulo = random(-PI / 4, PI / 4);
  bola = {
    x: width / 2 - BOLA_SIZE / 2,
    y: random(60, height - 60),
    vel: BOLA_VEL_BASE,
    vx: BOLA_VEL_BASE * cos(angulo) * dir,
    vy: BOLA_VEL_BASE * sin(angulo),
  };
  bolaAngulo = 0;
}

function colide(raquete, bola) {
  return (
    bola.x < raquete.x + raquete.w &&
    bola.x + BOLA_SIZE > raquete.x &&
    bola.y < raquete.y + raquete.h &&
    bola.y + BOLA_SIZE > raquete.y
  );
}

function calculaAngulo(raquete, bola) {
  let centroRaquete = raquete.y + raquete.h / 2;
  let centroBola = bola.y + BOLA_SIZE / 2;
  let distancia = (centroBola - centroRaquete) / (raquete.h / 2);
  distancia = constrain(distancia, -1, 1);
  return distancia * (PI / 3);
}

function moverComputador() {
  let velComp = DIFICULDADES[dificuldadeSelecionada].velocidade;
  if (bola.vx > 0) {
    let centroBola = bola.y + BOLA_SIZE / 2;
    let centroRaquete = computador.y + computador.h / 2;
    if (abs(centroBola - centroRaquete) > velComp) {
      if (centroBola > centroRaquete) {
        computador.y += velComp;
      } else {
        computador.y -= velComp;
      }
      computador.y = constrain(computador.y, 0, height - computador.h);
    }
  } else {
    let centroTela = height / 2 - computador.h / 2;
    if (abs(computador.y - centroTela) > 2) {
      computador.y += computador.y < centroTela ? 2 : -2;
      computador.y = constrain(computador.y, 0, height - computador.h);
    }
  }
}

// ====== Fim de jogo & narração ======
function checaFinal() {
  if (placarJogador >= PONTUACAO_FINAL && !jogoFinalizado) {
    jogoFinalizado = true;
    vencedor = "Jogador";
    estadoJogo = "fim";
    if (finishSound.isLoaded()) {
      finishSound.play();
      finishSound.onended(() => narrarVencedor());
    }
  }
  if (placarComputador >= PONTUACAO_FINAL && !jogoFinalizado) {
    jogoFinalizado = true;
    vencedor = "Computador";
    estadoJogo = "fim";
    if (finishSound.isLoaded()) {
      finishSound.play();
      finishSound.onended(() => narrarVencedor());
    }
  }
}

function narrarPlacar() {
  let mensagem = "";
  if (placarJogador === placarComputador) {
    mensagem = `${placarJogador} a ${placarComputador}.`;
  } else if (placarJogador > placarComputador) {
    mensagem = `${placarJogador} a ${placarComputador}`;
  } else if (placarComputador > placarJogador) {
    mensagem = `${placarJogador} a ${placarComputador}`;
  }
  let utter = new window.SpeechSynthesisUtterance(mensagem);
  utter.lang = "pt-BR";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

function narrarVencedor() {
  let mensagem = "";
  if (placarJogador > placarComputador) {
    mensagem = `Jogador venceu por ${placarJogador} a ${placarComputador}.`;
  } else if (placarComputador > placarJogador) {
    mensagem = `Computador venceu por ${placarComputador} a ${placarJogador}.`;
  }
  let utter = new window.SpeechSynthesisUtterance(mensagem);
  utter.lang = "pt-BR";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}
