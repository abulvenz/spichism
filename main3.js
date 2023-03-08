import math, {
  matrix,
  identity,
  multiply,
  inv,
  subtract,
  norm,
  cross,
  dot,
  unit,
} from "mathjs";
import m from "mithril";
import tagl from "tagl-mithril";

const { h1, button, div } = tagl(m);
const { random, trunc, PI, pow, sqrt, round, cos, sin, tan, abs } = Math;
const cot = (x) => tan(x);
const use = (v, fn) => fn(v);
const useM = (v, fn) => fn(...v);

const range = (N, S = 0, r = []) => (S === N ? r : range(N, S + 1, [...r, S]));

const randomElement = (arr = []) => arr[Math.trunc(Math.random() * arr.length)];

const canvas = document.getElementById("canvas");

const controlsHeight = 100;

canvas.width = innerWidth;
canvas.height = innerHeight - controlsHeight;

const ctx = canvas.getContext("2d");

const r = 100;
const omega = 1;
const v = 5;
const p = { x: 00, y: 200, z: 200 };

const newton = (t_R) => {
  const f_ =
    2 *
      omega *
      r *
      ((r * cos(omega * t_R) - p.x) * -sin(omega * t_R) +
        (r * sin(omega * t_R) - p.y) * cos(omega * t_R)) +
    2 * v * t_R;

  // console.log("1", pow(r * cos(omega * t_R) - p.x, 2))
  // console.log("2", pow(r * sin(omega * t_R) - p.y, 2))
  // console.log("3", pow(p.z, 2));
  // console.log("4", pow(v * t_R, 2));

  const f =
    pow(r * cos(omega * t_R) - p.x, 2) +
    pow(r * sin(omega * t_R) - p.y, 2) +
    pow(p.z, 2) -
    v ** 2 * t_R ** 2;

  const value = t_R - f / f_;
  // console.log("f", f);
  // console.log("f_", f_);
  // console.log("value", value);
  return value;
};

const normalize = (p) => sqrt(p.x ** 2 + p.y ** 2 + p.z ** 2);

let t = (normalize(p) - r) / v;

let lastT = t;

let i = 0;

while (i++ < 1000) {
  console.log(t);
  t = newton(t);
  if (abs(t - lastT) < 1e-5) {
    console.log("Converged after", i);
    break;
  }
  lastT = t;

  console.log();
}

ctx.fillStyle = "black";
ctx.fillRect(0, 0, 100000, 100000);

canvas.width = innerWidth;
canvas.height = innerHeight;

const cX = innerWidth * 0.5;
const cY = innerHeight * 0.5;

draw(t);

function draw(t) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, innerWidth, innerHeight);

  ctx.strokeStyle = "white";
  drawPlanetPath(t);

  ctx.beginPath();
  const planetX = r * cos(omega * t);
  const planetY = r * sin(omega * t);
  const planetZ = 0;
  ctx.arc(planetX + cX, planetY + cY, 3, 0, 2 * PI);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(p.x + cX, p.y + cY);
  ctx.lineTo(planetX + cX, planetY + cY);
  ctx.stroke();

  /** Reale Länge Planet - Startpunkt */
  const d = sqrt(pow(planetX - p.x, 2) + pow(planetY - p.y, 2) + pow(p.z, 2));
  /** Projezierte Länge */
  const d_ = pow(planetX - p.x, 2) + pow(planetY - p.y, 2);

  const v_0 = v;

  console.log("d", d);
  console.log(t, d - v_0 * t);

  if (abs(d - v_0 * t) < 1) {
    stop = true;
  }

  ctx.strokeStyle = "blue";

  const vX = (planetX - p.x) / d;
  const vY = (planetY - p.y) / d;
  const vZ = (planetZ - p.z) / d;

  console.log("Probe", sqrt(vX * vX + vY * vY + vZ * vZ));

  ctx.beginPath();
  ctx.moveTo(p.x + cX, p.y + cY);
  ctx.lineTo(p.x + cX + vX * v_0 * t, p.y + cY + vY * v_0 * t);
  ctx.stroke();

  ctx.strokeStyle = "green";
  ctx.beginPath();
  ctx.arc(planetX + cX, planetY + cY, 3, 0, 2 * PI);
  ctx.stroke();
}

function drawPlanetPath(t) {
  ctx.beginPath();
  ctx.arc(cX, cY, r, 0, omega * t);
  ctx.stroke();
}
