const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const cX = innerWidth * 0.5;
const cY = innerHeight * 0.5;

const omega = 1;
const r = 100;

const p = { x: -100, y: -100, z: 100 };

const v_0 = 5;

let t = 0;

const { pow, cos, sin, PI, sqrt, abs } = Math;

const v_t = (t) =>
  (pow(r * cos(omega * t) - p.x, 2) +
    pow(r * sin(omega * t) - p.y, 2) +
    pow(p.z, 2)) /
  t;

const bisect = (f, tlow, thigh, targetv, precision = 0.1, maxIter = 100) => {
  let d = Infinity;
  let iter = 0;
  let v = 0;
  while (d > precision && iter < maxIter) {
    iter++;
    v = f((tlow + thigh) * 0.5);

    console.log(
      "bisect",
      tlow,
      "<",
      (tlow + thigh) * 0.5,
      "<",
      thigh,
      " f:",
      v
    );

    //console.log(v, (tlow + thigh) * 0.5);
    if (v > targetv) {
      tlow = (tlow + thigh) * 0.5;
    } else if (v < targetv) {
      thigh = (tlow + thigh) * 0.5;
    } else {
      console.log("err");
    }
    if (abs(tlow - thigh) < 1) {
      console.log("converged", v);
      return tlow;
    }
  }
  console.log(
    v,
    d,
    "<",
    precision,
    " || ",
    iter,
    ">",
    maxIter,
    "---->",
    tlow,
    thigh
  );
  return tlow;
};

let stop = false;

let t_sich = bisect(v_t, 0, 10, v_0);
draw(100);
// setInterval(() => {
//   t = t + 0.01;
//   if (!stop) draw(t);
// }, 100);

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
