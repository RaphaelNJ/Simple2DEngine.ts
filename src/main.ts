import * as math from "mathjs";
import * as engine from "./engine/engine";
import arrow from '/arrow.png';
import typescript from '/typescript.png';
import gradient from '/gradient.png';
import vite from '/vite.png';

let t_size = 800;
let t = Array(t_size).fill({ x: 0, y: 0 });
let r = 0;
new engine.Engine(<HTMLCanvasElement>document.getElementById("canvas"), (delta: number, fps: number, engineInstance: engine.Engine) => {
  r = (r + 1) % t_size;
  if (engineInstance.isLoading) {
    return;
  }
  let date_now = Date.now();
  let ang = date_now / 8;
  let matrix = [
    [Math.cos((ang * Math.PI) / 180), -Math.sin((ang * Math.PI) / 180)],
    [Math.sin((ang * Math.PI) / 180), Math.cos((ang * Math.PI) / 180)],
  ];
  let gt = [
    [20, 0],
    [0, 20],
  ];

  ang = date_now / 8;
  matrix = [
    [Math.cos((ang * Math.PI) / 180), -Math.sin((ang * Math.PI) / 180)],
    [Math.sin((ang * Math.PI) / 180), Math.cos((ang * Math.PI) / 180)],
  ];
  gt = [
    [50, 0],
    [0, 50],
  ];
  engineInstance.DrawTexturedRectangle(120, 100, "gradient", {
    matrix: math.multiply(gt, matrix),
  });
  //return;

  ang = -date_now / 12;
  matrix = [
    [Math.cos((ang * Math.PI) / 180), -Math.sin((ang * Math.PI) / 180)],
    [Math.sin((ang * Math.PI) / 180), Math.cos((ang * Math.PI) / 180)],
  ];
  gt = [
    [70, 0],
    [0, 20],
  ];

  engineInstance.DrawTexturedRectangle(200, 200, "typescript", {
    matrix: math.multiply(gt, matrix),
  });
  //return;

  engineInstance.DrawTexturedRectangle(100, 300, "vite", {
     matrix: math.multiply(gt, matrix),
  });

  let speedx = 150 * 3;
  let speedy = 200 * 3;
  let ampx = 100;
  let ampy = 100;
  let sx = 350;
  let sy = 150;

  ang = -date_now / 12;
  matrix = [
    [Math.cos((ang * Math.PI) / 180), -Math.sin((ang * Math.PI) / 180)],
    [Math.sin((ang * Math.PI) / 180), Math.cos((ang * Math.PI) / 180)],
  ];
  gt = [
    [70, 50],
    [0, 80],
  ];

  t[r] = { x: sx + Math.sin(date_now / speedx) * ampx, y: sy + Math.sin(date_now / speedy) * ampy };

  t.forEach((e) => {
    engineInstance.DrawPixel(e.x, e.y, { a: 255 });
  });

  engineInstance.DrawLine(sx + ampx, sy + ampy, sx - ampx, sy + ampy, { a: 255, r: 255 });
  engineInstance.DrawLine(sx - ampx, sy + ampy, sx - ampx, sy - ampy, { a: 255, r: 255 });

  engineInstance.DrawLine(
    sx + Math.sin(date_now / speedx) * ampx,
    sy + Math.sin(date_now / speedy) * ampy,
    sx - ampx,
    sy + Math.sin(date_now / speedy) * ampy,
    { a: 255, b: 255 }
  );
  engineInstance.DrawLine(
    sx + Math.sin(date_now / speedx) * ampx,
    sy + ampy,
    sx + Math.sin(date_now / speedx) * ampx,
    sy + Math.sin(date_now / speedy) * ampy,
    { a: 255, b: 255 }
  );

  engineInstance.DrawFilledShape(
    [
      { x: sx + Math.sin(date_now / speedx) * ampx + 2, y: sy + Math.sin(date_now / speedy) * ampy + 2 },
      { x: sx + Math.sin(date_now / speedx) * ampx + 2, y: sy + Math.sin(date_now / speedy) * ampy - 2 },
      { x: sx + Math.sin(date_now / speedx) * ampx - 2, y: sy + Math.sin(date_now / speedy) * ampy - 2 },
      { x: sx + Math.sin(date_now / speedx) * ampx - 2, y: sy + Math.sin(date_now / speedy) * ampy + 2 },
    ],
    { a: 255 }
  );
},
  160 * 3,
  120 * 3,
  2,
  { arrow, vite, gradient, typescript }
);
