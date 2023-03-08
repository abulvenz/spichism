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
const { random, trunc, PI, pow, sqrt, round, cos, sin, tan } = Math;
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
const v = 1;
const p = { x: 200, y: 200, z: 200 };

const newton = (t_R) => {
  const f_ =
    (omega * r * (p.x * sin(omega * t_R) - p.y * cos(omega * t_R))) /
      sqrt(
        pow(p.x - r * cos(omega * t_R), 2) +
          pow(p.y - r * sin(omega * t_R), 2) +
          pow(p.z, 2)
      ) -
    v;

  // console.log("1", pow(r * cos(omega * t_R) - p.x, 2))
  // console.log("2", pow(r * sin(omega * t_R) - p.y, 2))
  // console.log("3", pow(p.z, 2));
  // console.log("4", pow(v * t_R, 2));

  const f =
    sqrt(
      pow(r * cos(omega * t_R) - p.x, 2) +
        pow(r * sin(omega * t_R) - p.y, 2) +
        pow(p.z, 2)
    ) -
    v * t_R;

  const value = t_R - f / f_;
  // console.log("f", f);
  // console.log("f_", f_);
  // console.log("value", value);
  return value;
};

const normalize = (p) => sqrt(p.x * p.x + p.y * p.y + p.z * p.z);

let t = (normalize(p) - r) / v;

range(100).map((i) => {
  console.log(t);
  t = newton(t);

  console.log();
});

ctx.fillStyle = "black";
ctx.fillRect(0, 0, 100000, 100000);

const rX = (phi) =>
  matrix([
    [1, 0, 0, 0],
    [0, cos(phi), sin(phi), 0],
    [0, -sin(phi), cos(phi), 0],
    [0, 0, 0, 1],
  ]);

const rY = (phi) =>
  matrix([
    [cos(phi), 0, sin(phi), 0],
    [0, 1, 0, 0],
    [-sin(phi), 0, cos(phi), 0],
    [0, 0, 0, 1],
  ]);

const rZ = (phi) =>
  matrix([
    [cos(phi), sin(phi), 0, 0],
    [-sin(phi), cos(phi), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ]);

const tr2 = (x, y, z) =>
  matrix([
    [1, 0, 0, x],
    [0, 1, 0, y],
    [0, 0, 1, z],
    [0, 0, 0, 1],
  ]);
const tr = (x, y, z) =>
  matrix([
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [x, y, z, 1],
  ]);

const deg2rad = (deg) => (deg / 180) * PI;

const pr = (fov, ar, near, far) =>
  use(cot(deg2rad(fov) / 2), (h) =>
    use(h / ar, (w) =>
      matrix([
        [w, 0, 0, 0],
        [0, h, 0, 0],
        [0, 0, far / (near - far), -1],
        [0, 0, (near * far) / (near - far), 0],
      ])
    )
  );

const calcView = ({ lat, lng, r }) => {
  const cameraPosition = matrix([
    r * cos(deg2rad(lat)) * cos(deg2rad(lng)),
    r * cos(deg2rad(lat)) * sin(deg2rad(lng)),
    r * sin(deg2rad(lat)),
  ]);

  const cameraTarget = matrix([0, 0, 0]);

  const cameraUpVector = matrix([0, 1, 0]);

  const norm_ = (v) =>
    use(norm(v), (n) =>
      matrix([v.get([0]) / n, v.get([1]) / n, v.get([2]) / n])
    );

  const zAxis = norm_(subtract(cameraPosition, cameraTarget));
  const xAxis = norm_(cross(cameraUpVector, zAxis));
  const yAxis = cross(zAxis, xAxis);

  const view = matrix([
    [xAxis.get([0]), yAxis.get([0]), zAxis.get([0]), 0],
    [xAxis.get([1]), yAxis.get([1]), zAxis.get([1]), 0],
    [xAxis.get([2]), yAxis.get([2]), zAxis.get([2]), 0],
    [
      -dot(xAxis, cameraPosition),
      -dot(yAxis, cameraPosition),
      -dot(zAxis, cameraPosition),
      1,
    ],
  ]);

  return view;
};

let spectator = {
  lat: 0,
  lng: 0,
  r: 10,
};

let view = calcView(spectator);
console.log(view);
const points = [
  matrix([-0.5, -0.5, -0.5, -0.5]),
  matrix([0.5, -0.5, -0.5, -0.5]),
  matrix([-0.5, 0.5, -0.5, -0.5]),
  matrix([0.5, 0.5, -0.5, -0.5]),

  matrix([-0.5, -0.5, 0.5, -0.5]),
  matrix([0.5, -0.5, 0.5, -0.5]),
  matrix([-0.5, 0.5, 0.5, -0.5]),
  matrix([0.5, 0.5, 0.5, -0.5]),
];

const drawPoint = (x, y, ctx) => {
  const radius = 3;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = "green";
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#003300";
  ctx.stroke();
};

const draw = (ctx) => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 100000, 100000);

  const width = ctx.canvas.clientWidth * 0.5;
  const height = ctx.canvas.clientHeight * 0.5;

  const iview = view;
  //  const iview = inv(view);
  const toView = (p) => multiply(iview, p);

  const persp = pr(60, width / height, 0, 20);
  const perspectively = (p) => multiply(persp, p);

  const inView = (p) =>
    use(p.get([0]), (x) =>
      use(p.get([1]), (y) =>
        use(
          p.get([2]),
          (z) => x > -1 && x < 1 && y > -1 && y < 1 && z > 0 && z < 1
        )
      )
    );

  const toScreen = (p) => [
    p.get([0]) * width + width,
    p.get([1]) * height + height,
  ];

  //  console.log(ctx.getContextAttributes());

  const scr = points
    .map((p, i) => console.log("bare", i, JSON.stringify(p._data)) || p)
    .map(toView)
    .map((p, i) => console.log("view", i, JSON.stringify(p._data)) || p)
    .map(perspectively)
    .map((p, i) => console.log("pers", i, JSON.stringify(p._data)) || p)
    .filter(inView)
    .map((p, i) => console.log("left", i, JSON.stringify(p._data)) || p)
    .sort((a, b) => a.get([2]) - b.get([2]))
    .map(toScreen);
  scr.forEach((p) => {
    drawPoint(p[0], p[1], ctx);
  });
};

window.addEventListener("keydown", (e) => {
  let s = 10;
  switch (e.key) {
    case "ArrowUp":
      spectator.lat += s;
      break;
    case "ArrowDown":
      spectator.lat -= s;
      break;
    case "ArrowLeft":
      spectator.lng += s;
      break;
    case "ArrowRight":
      spectator.lng -= s;
      break;
    case "+":
      spectator.r -= s / 10;
      break;
    case "-":
      spectator.r += s / 10;
      break;
    default:
      console.log(e);
  }
  view = calcView(spectator);
  console.log(view);
  draw(ctx);
  m.redraw();
});

draw(ctx);

m.mount(document.getElementById("controls"), {
  view: (vnode) => [
    button({ onclick: (e) => console.log(fields) }, "step"),
    button({ onclick: (e) => draw(ctx, fields) }, "draw"),
    div(JSON.stringify(view._data)),
  ],
});
