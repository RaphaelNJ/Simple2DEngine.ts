import * as math from "mathjs";
export type Color = {
    r?: number,
    g?: number,
    b?: number,
    a: number
};
export type Point = {
    x: number;
    y: number;
};
export type TextureCoords = {
    u: number;
    v: number;
};

export class Engine {
    c: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    imageData: ImageData;
    width: number;
    height: number;
    pixelSize: number;
    backgroundColor: Color;
    images: { [key: string]: { image: HTMLImageElement, imageData: ImageData, loaded: boolean } } = {};
    isLoading: boolean = true;
    isDrawingFps: boolean;
    mousePos: Point = { x: 0, y: 0 };
    cursorSensivity: number;
    pressedKeys: { [key: string]: boolean } = {};
    constructor(c: HTMLCanvasElement, gameLoop: Function, width: number, height: number, pixelSize: number, imagesToLoad: { [key: string]: string } = {}, backgroundColor: Color | undefined = undefined) {
        this.isLoading = true;
        this.c = c;
        this.ctx = this.c.getContext("2d")!;
        this.isDrawingFps = true;
        this.imageData = this.ctx.createImageData(this.c.width, this.c.height);
        this.width = width;
        this.height = height;
        this.pixelSize = pixelSize;
        this.mousePos = { x: 0, y: 0 };
        this.cursorSensivity = 0.1;
        if (backgroundColor != undefined) {
            this.backgroundColor = backgroundColor;
        } else {
            this.backgroundColor = { r: 59, g: 59, b: 110, a: 255 } as Color
        }
        c.width = width;
        c.height = height;
        c.style.width = width * pixelSize + "px";
        c.style.height = height * pixelSize + "px";
        c.style.imageRendering = "pixelated";

        Object.keys(imagesToLoad).forEach((key) => {
            const image = new Image();
            image.src = imagesToLoad[key];
            image.onload = () => {
                // Create an offscreen canvas to draw the image
                const offscreenCanvas = document.createElement('canvas');
                offscreenCanvas.width = image.width;
                offscreenCanvas.height = image.height;
                const offscreenCtx = offscreenCanvas.getContext('2d');
                if (!offscreenCtx) {
                    console.error('Failed to create offscreen canvas context.');
                    return;
                }
                offscreenCtx.drawImage(image, 0, 0);

                // Get the image data
                const imageData = offscreenCtx.getImageData(0, 0, image.width, image.height);
                this.images[key] = {
                    image: image,
                    imageData: imageData,
                    loaded: true,
                }
                if (Object.keys(this.images).length == Object.keys(imagesToLoad).length) {
                    this.isLoading = false;
                }
            }
        })

        document.addEventListener("keydown", (e) => {
            this.pressedKeys[e.key] = true;
        });
        document.addEventListener("keyup", (e) => {
            this.pressedKeys[e.key] = false;
        })
        this.SetBackground(this.backgroundColor);

        c.addEventListener("click", async () => {
            await c.requestPointerLock();
        });
        c.addEventListener("mousemove", (e) => {
            if (document.pointerLockElement != c) {
                return
            }

            this.mousePos.x += e.movementX * this.cursorSensivity
            this.mousePos.y += e.movementY * this.cursorSensivity
        })
        let deltaTime: number;
        let oldTimeStamp: number;
        let fps: number;

        window.requestAnimationFrame((timeStamp) => {
            mainLoop(timeStamp);
        });

        const mainLoop = (timeStamp: number): void => {
            deltaTime = (timeStamp - oldTimeStamp) / 1000;
            oldTimeStamp = timeStamp;
            fps = Math.round(1 / deltaTime);
            this.GetScreenGrid();

            gameLoop(deltaTime, fps, this);

            this.DrawScreen()

            if (this.isDrawingFps) { this.drawFps(fps) }
            window.requestAnimationFrame((timeStamp) => {
                mainLoop(timeStamp);
            });
        };
    }
    updateScreenSize(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.c.width = width;
        this.c.height = height;
        this.c.style.width = width * this.pixelSize + "px";
        this.c.style.height = height * this.pixelSize + "px";
        this.GetScreenGrid()
    }
    updatePixelSize(pixelSize: number) {
        this.pixelSize = pixelSize;
        this.c.style.width = this.width * pixelSize + "px";
        this.c.style.height = this.height * pixelSize + "px";
    }
    GetScreenGrid() {
        this.imageData = this.ctx.createImageData(this.width, this.height);
    }
    DrawPixel(x: number, y: number, color: Color) {
        x = Math.round(x);
        y = Math.round(y);
        if (!(x >= 0 && x < this.width && y >= 0 && y < this.height)) {
            return;
        }
        const index = y * this.c.width * 4 + x * 4;

        if (color.a >= 255) {
            this.imageData.data[index] = color.r || 0;
            this.imageData.data[index + 1] = color.g || 0;
            this.imageData.data[index + 2] = color.b || 0;
            this.imageData.data[index + 3] = color.a || 0;
        } else {
            const srcAlpha = color.a / 255;
            const dstAlpha = this.imageData.data[index + 3] / 255;
            const newAlpha = srcAlpha + dstAlpha * (1 - srcAlpha);
            this.imageData.data[index] = ((color.r || 0) * srcAlpha + this.imageData.data[index] * dstAlpha * (1 - srcAlpha)) / newAlpha;
            this.imageData.data[index + 1] = ((color.g || 0) * srcAlpha + this.imageData.data[index + 1] * dstAlpha * (1 - srcAlpha)) / newAlpha;
            this.imageData.data[index + 2] = ((color.b || 0) * srcAlpha + this.imageData.data[index + 2] * dstAlpha * (1 - srcAlpha)) / newAlpha;
            this.imageData.data[index + 3] = newAlpha * 255;
        }
    }
    DrawLine(startx: number, starty: number, endx: number, endy: number, color: Color) {
        startx = Math.round(startx);
        starty = Math.round(starty);
        endx = Math.round(endx);
        endy = Math.round(endy);

        const deltaX = Math.abs(endx - startx);
        const deltaY = Math.abs(endy - starty);

        const signX = startx < endx ? 1 : -1;
        const signY = starty < endy ? 1 : -1;

        let error = deltaX - deltaY;

        let currentX = startx;
        let currentY = starty;
        while (true) {
            this.DrawPixel(currentX, currentY, color);

            if (currentX === endx && currentY === endy) {
                break;
            }

            const error2 = error * 2;

            if (error2 > -deltaY) {
                error -= deltaY;
                currentX += signX;
            }

            if (error2 < deltaX) {
                error += deltaX;
                currentY += signY;
            }
        }
    }
    DrawShape(points: Point[], color: Color) {
        if (points.length < 2) {
            return;
        }

        for (let i = 0; i < points.length - 1; i++) {
            this.DrawLine(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y, color);
        }

        // Connect the last point to the first point
        this.DrawLine(points[points.length - 1].x, points[points.length - 1].y, points[0].x, points[0].y, color);
    }
    DrawFilledShape(points: Point[], color: Color) {
        if (points.length < 2) {
            return;
        }

        // Find the minY and maxY of the points
        let minY = points[0].y;
        let maxY = points[0].y;

        for (const point of points) {
            minY = Math.min(minY, point.y);
            maxY = Math.max(maxY, point.y);
        }

        // Scanline fill algorithm
        for (let y = minY; y <= maxY; y++) {
            let intersections: number[] = [];

            // Calculate intersections with the scanline
            for (let i = 0; i < points.length; i++) {
                const p1 = points[i];
                const p2 = points[(i + 1) % points.length];

                if ((p1.y < y && p2.y >= y) || (p2.y < y && p1.y >= y)) {
                    const intersectionX = p1.x + (y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y);
                    intersections.push(intersectionX);
                }
            }

            // Sort intersections by x
            intersections.sort((a, b) => a - b);

            // Fill the pixels between each pair of intersections
            for (let i = 0; i < intersections.length; i += 2) {
                const x1 = Math.ceil(intersections[i]);
                const x2 = Math.floor(intersections[i + 1]);

                for (let x = x1; x <= x2; x++) {
                    this.DrawPixel(x, y - 1, color);
                }
            }
        }
    }
    DrawRectangle(x1: number, y1: number, matrix: Array<Array<number>>, color: Color) {
        this.DrawFilledShape([
            { x: x1 + math.multiply(matrix, [[0], [0]])[0][0], y: y1 + math.multiply(matrix, [[0], [0]])[1][0] },
            { x: x1 + math.multiply(matrix, [[0], [1]])[0][0], y: y1 + math.multiply(matrix, [[0], [1]])[1][0] },
            { x: x1 + math.multiply(matrix, [[1], [1]])[0][0], y: y1 + math.multiply(matrix, [[1], [1]])[1][0] },
            { x: x1 + math.multiply(matrix, [[1], [0]])[0][0], y: y1 + math.multiply(matrix, [[1], [0]])[1][0] },
        ], color)

    }
    DrawTexturedRectangle(
        x1: number,
        y1: number,
        image: string,
        optional: {
            matrix?: number[][],
            sizeX?: number,
            sizeY?: number,
            u?: number,
            v?: number
        }
    ) {
        optional.matrix = optional.matrix == undefined ? [[1, 0], [0, 1]] : optional.matrix;
        optional.sizeX = optional.sizeX == undefined ? 1 : optional.sizeX;
        optional.sizeY = optional.sizeY == undefined ? 1 : optional.sizeY;
        optional.u = optional.u == undefined ? 0 : optional.u;
        optional.v = optional.v == undefined ? 0 : optional.v;

        const imageWidth = Math.round(this.images[image].image.width) - 1;
        const imageHeight = Math.round(this.images[image].image.height) - 1;

        let points: Point[] = [
            { x: math.multiply(optional.matrix, [[0], [0]])[0][0], y: math.multiply(optional.matrix, [[0], [0]])[1][0] },
            { x: math.multiply(optional.matrix, [[0], [1]])[0][0], y: math.multiply(optional.matrix, [[0], [1]])[1][0] },
            { x: math.multiply(optional.matrix, [[1], [1]])[0][0], y: math.multiply(optional.matrix, [[1], [1]])[1][0] },
            { x: math.multiply(optional.matrix, [[1], [0]])[0][0], y: math.multiply(optional.matrix, [[1], [0]])[1][0] },
        ]


        if (points.length < 2) {
            return;
        }

        // Find the minY and maxY of the points
        let minY = points[0].y;
        let maxY = points[0].y;

        for (const point of points) {
            minY = Math.min(minY, point.y);
            maxY = Math.max(maxY, point.y);
        }

        // Scanline fill algorithm
        for (let y = minY; y <= maxY; y++) {
            let intersections: number[] = [];

            // Calculate intersections with the scanline
            for (let i = 0; i < points.length; i++) {
                const p1 = points[i];
                const p2 = points[(i + 1) % points.length];

                if ((p1.y < y && p2.y >= y) || (p2.y < y && p1.y >= y)) {
                    const intersectionX = p1.x + (y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y);
                    intersections.push(intersectionX);
                }
            }

            // Sort intersections by x
            intersections.sort((a, b) => a - b);

            // Fill the pixels between each pair of intersections
            for (let i = 0; i < intersections.length; i += 2) {
                const x_1 = Math.ceil(intersections[i]);
                const x2 = Math.floor(intersections[i + 1]);

                for (let x = x_1; x <= x2; x++) {
                    const A = [[x], [y]];
                    const B = optional.matrix;

                    const B_inv = math.inv(B);
                    const C = math.multiply(B_inv, A);
                    this.DrawPixel(x1 + x, y1 + y - 1, this.getImagePixel(image,
                        Math.round(C[0][0] * imageWidth * optional.sizeX) + optional.u,
                        Math.round(C[1][0] * imageHeight * optional.sizeY) + optional.v));
                }
            }
        }
    }
    getImagePixel(image: string, x: number, y: number): Color {
        const imageData = this.images[image].imageData;
        const width = this.images[image].image.width;
        const height = this.images[image].image.height;
        const index = (x % width) * 4 + (y % height) * width * 4;
        return {
            r: imageData.data[Math.abs(index)],
            g: imageData.data[Math.abs(index + 1)],
            b: imageData.data[Math.abs(index + 2)],
            a: imageData.data[Math.abs(index + 3)]
        };
    }
    DrawScreen() {
        this.ctx.putImageData(this.imageData, 0, 0);
    }
    SetBackground(color: Color) {
        this.c.style.backgroundColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    }
    drawFps(fps: number) {
        this.ctx.fillStyle = "white";
        this.ctx.font = "12px ＭＳ Ｐゴシック";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("" + String(fps).padStart(3, '0') + " FPS", 5, 14);
    }
}