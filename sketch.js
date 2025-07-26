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

let fundo;
let imgBarraJogador, imgBarraComputador, imgBola;
let bolaAngulo = 0;

function preload() {
  fundo = loadImage('Sprites/fundo1.png');
  imgBarraJogador = loadImage('Sprites/barra01.png');
  imgBarraComputador = loadImage('Sprites/barra02.png');
  imgBola = loadImage('Sprites/bola.png');
}

function setup() {
  createCanvas(800, 500);
  resetarBola();
  jogador = {
    x: 32,
    y: height / 2 - RAQUETE_H / 2,
    w: RAQUETE_W,
    h: RAQUETE_H
  };
  computador = {
    x: width - 32 - RAQUETE_W,
    y: height / 2 - RAQUETE_H / 2,
    w: RAQUETE_W,
    h: RAQUETE_H
  };
  textFont('monospace');
}

function draw() {
  let s = min(fundo.width, fundo.height);
  let sx = (fundo.width - s) / 2;
  let sy = (fundo.height - s) / 2;
  image(fundo, 0, 0, width, height, sx, sy, s, s);

  // Atualiza ângulo de giro da bola proporcional ao módulo da velocidade atual
  let velocidadeAtual = sqrt(bola.vx * bola.vx + bola.vy * bola.vy);
  bolaAngulo += velocidadeAtual * 0.014;

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

  if (colide(jogador, bola) && bola.vx < 0) {
    bola.x = jogador.x + jogador.w + 2;
    bola.vel *= FATOR_AUMENTO;
    let angulo = calculaAngulo(jogador, bola);
    bola.vx = abs(bola.vel * cos(angulo));
    bola.vy = bola.vel * sin(angulo);
  }

  if (colide(computador, bola) && bola.vx > 0) {
    bola.x = computador.x - BOLA_SIZE - 2;
    bola.vel *= FATOR_AUMENTO;
    let angulo = calculaAngulo(computador, bola);
    bola.vx = -abs(bola.vel * cos(angulo));
    bola.vy = bola.vel * sin(angulo);
  }

  if (bola.x < -BOLA_SIZE) {
    placarComputador++;
    resetarBola(-1);
  }

  if (bola.x > width) {
    placarJogador++;
    resetarBola(1);
  }

  textSize(46);
  textAlign(CENTER, TOP);
  fill(200, 230, 255);
  text(placarJogador, width / 2 - 60, 10);
  text(placarComputador, width / 2 + 60, 10);
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
    vy: vel * sin(angulo)
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
      computador.y += (computador.y < centroTela) ? 2 : -2;
      computador.y = constrain(computador.y, 0, height - computador.h);
    }
  }
}
