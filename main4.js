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
const { max, min, random, trunc, PI, pow, sqrt, round, cos, sin, tan, abs } =
  Math;
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
const omega = 50;
const v = 150;
const p = { x: 00, y: 200, z: 200 };

ctx.fillStyle = "black";
ctx.fillRect(0, 0, 100000, 100000);

canvas.width = innerWidth;
canvas.height = innerHeight;

const cX = innerWidth * 0.5;
const cY = innerHeight * 0.5;

const normalize = (p) => sqrt(p.x ** 2 + p.y ** 2 + p.z ** 2);

let t = (normalize(p) - r) / v;

const newton = (f, f_, x_0, eps, maxIter) => {
  let x = x_0;
  for (let it = 0; it < maxIter; it++) {
    x = x - f(x) / f_(x);
    if (abs(x) < eps) return x;
  }
  return undefined;
};

const approZero = (f, t_min, t_max) =>
  useM(
    [t_min, t_max, f(t_min), f(t_max)],
    (x1, x2, y1, y2) => x1 - (y1 * (x2 - x1)) / (y2 - y1)
  );

const inside = (min, x, max) => min <= x && x <= max;

const flutter = (f, t_min, t_max, min_res, results = []) => {
  for (let t = t_min; t < t_max; t += min_res) {
    const t1 = t;
    const t2 = min(t_max, t1 + min_res);
    const t_res = use(approZero(f, t1, t2), (res) =>
      inside(t1, res, t2) ? res : undefined
    );
    if (t_res !== undefined) results.push(t_res);
  }
  return results;
};

const flutterFirst = (f, t_min, t_max, min_res) => {
  for (let t = t_min; t < t_max; t += min_res) {
    const t1 = t;
    const t2 = min(t_max, t1 + min_res);
    const t_res = use(approZero(f, t1, t2), (res) =>
      inside(t1, res, t2) ? res : undefined
    );
    if (t_res !== undefined) return t_res;
  }

  return undefined;
};

const f = (t_R) =>
  sqrt(
    pow(r * cos(omega * t_R) - p.x, 2) +
      pow(r * sin(omega * t_R) - p.y, 2) +
      pow(p.z, 2)
  ) -
  v * t_R;

const d = sqrt(p.x ** 2 + p.y ** 2 + p.z ** 2);

const s_min = abs(d - r);
const t_min = s_min / v;

const s_max = d + r;
const t_max = s_max / v;

console.log(flutter(f, t_min, t_max, 1 / omega));
draw(flutter(f, t_min, t_max, 1 / omega)[0]);

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
