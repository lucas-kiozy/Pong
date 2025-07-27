let bola;
let jogador;
let computador;
let placarJogador = 0;
let placarComputador = 0;

const RAQUETE_W = 13;
const RAQUETE_H = 86;
const BOLA_SIZE = 18;

const BOLA_VEL_BASE = 7.34;
const FATOR_AUMENTO = 1.06;

const PONTUACAO_FINAL = 5;

let fundo;
let imgBarraJogador, imgBarraComputador, imgBola;
let bolaAngulo = 0;

let bounceSound, finishSound;
let jogoFinalizado = false;
let vencedor = "";

function preload() {
  fundo = loadImage("Sprites/fundo2.png");
  imgBarraJogador = loadImage("Sprites/barra01.png");
  imgBarraComputador = loadImage("Sprites/barra02.png");
  imgBola = loadImage("Sprites/bola.png");
  bounceSound = loadSound("Sounds/bounce.wav");
  finishSound = loadSound("Sounds/finish.wav");
}

function setup() {
  createCanvas(800, 500);
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
  textFont("monospace");
}

function narrarPlacar() {
  let mensagem = "";
  if (placarJogador === placarComputador) {
    mensagem = `${placarJogador} iguais.`;
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

function draw() {
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
  image(
    imgBarraComputador,
    computador.x,
    computador.y,
    computador.w,
    computador.h
  );

  push();
  translate(bola.x + BOLA_SIZE / 2, bola.y + BOLA_SIZE / 2);
  rotate(bolaAngulo);
  imageMode(CENTER);
  image(imgBola, 0, 0, BOLA_SIZE, BOLA_SIZE);
  pop();

  // Checa gol do computador (bola saiu à esquerda)
  if (bola.x < -BOLA_SIZE) {
    placarComputador++;
    if (placarComputador < PONTUACAO_FINAL) narrarPlacar();
    checaFinal();
    if (!jogoFinalizado) resetarBola(-1);
    return;
  }

  // Checa gol do jogador (bola saiu à direita)
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

function checaFinal() {
  if (placarJogador >= PONTUACAO_FINAL && !jogoFinalizado) {
    jogoFinalizado = true;
    vencedor = "Jogador";
    if (finishSound.isLoaded()) {
      finishSound.play();
      finishSound.onended(() => narrarPlacar());
    }
  }
  if (placarComputador >= PONTUACAO_FINAL && !jogoFinalizado) {
    jogoFinalizado = true;
    vencedor = "Computador";
    if (finishSound.isLoaded()) {
      finishSound.play();
      finishSound.onended(() => narrarPlacar());
    }
  }
}

function resetarBola(sentido = 0) {
  let dir;
  if (sentido === 0) {
    dir = random([1, -1]);
  } else {
    dir = sentido;
  }
  let angulo = random(-PI / 4, PI / 4);
  let vel = BOLA_VEL_BASE;
  bola = {
    x: width / 2 - BOLA_SIZE / 2,
    y: random(60, height - 60),
    vel: vel,
    vx: vel * cos(angulo) * dir,
    vy: vel * sin(angulo),
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
  if (bola.vx > 0) {
    let centroBola = bola.y + BOLA_SIZE / 2;
    let centroRaquete = computador.y + computador.h / 2;
    let velocidade = 6;
    if (abs(centroBola - centroRaquete) > velocidade) {
      if (centroBola > centroRaquete) {
        computador.y += velocidade;
      } else {
        computador.y -= velocidade;
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
