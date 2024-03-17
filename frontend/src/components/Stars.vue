<template>
    <div>
        <canvas ref="canvas"></canvas>
        <a class="youtube-link" </a>
    </div>
</template>

<script>
export default {
    mounted() {
        this.canvas = this.$refs.canvas;
        this.ctx = this.canvas.getContext("2d");
        this.init();
    },
    methods: {
        init() {
            this.resizeReset();
            this.animationLoop();
            window.addEventListener("resize", this.resizeReset);
            window.addEventListener("mousemove", this.mousemove);
            window.addEventListener("mouseout", this.mouseout);
        },
        resizeReset() {
            this.w = this.canvas.width = window.innerWidth;
            this.h = this.canvas.height = window.innerHeight;
        },
        mousemove(e) {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        },
        mouseout() {
            this.mouse.x = undefined;
            this.mouse.y = undefined;
        },
        animationLoop() {
            if (this.mouse.x != undefined && this.mouse.y != undefined) {
                this.hue += 2;
                this.particles.push(new this.Particle(this.mouse.x, this.mouse.y));
            }

            this.ctx.clearRect(0, 0, this.w, this.h);
            this.ctx.globalCompositeOperation = 'lighter';

            this.drawScene();
            this.arrayCleanup();
            requestAnimationFrame(this.animationLoop);
        },
        arrayCleanup() {
            let dump = [];
            this.particles.map((particle) => {
                if (particle.radius > 0) {
                    dump.push(particle);
                }
            });
            this.particles = dump;
        },
        drawScene() {
            this.particles.map((particle) => {
                particle.update();
                particle.draw();
            })
        }
    },
    data() {
        return {
            canvas: null,
            ctx: null,
            w: 0,
            h: 0,
            particles: [],
            mouse: {
                x: undefined,
                y: undefined
            },
            hue: 0
        }
    },
    created() {
        this.Particle = class {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.radius = 5;
                this.size = 0;
                this.rotate = 0;
                this.hue = this.hue % 360;
                this.alpha = 0.5;
                this.setPoint();
            }
            setPoint() {
                let r, x, y;
                this.point = [];
                for (let a = 0; a < 360; a += 36) {
                    let d = ((a / 36) % 2 === 0) ? this.size : this.size / 2;
                    r = (Math.PI / 180) * (a + this.rotate);
                    x = this.x + d * Math.sin(r);
                    y = this.y + d * Math.cos(r);
                    this.point.push({ x: x, y: y, r: this.radius });
                }
            }
            draw() {
                if (this.radius <= 0) return;
                this.point.map((p) => {
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    this.ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, ${this.alpha})`;
                    this.ctx.fill();
                    this.ctx.closePath();
                });

                this.ctx.beginPath();
                for (let i = 0; i < this.point.length; i++) {
                    if (i === 0) {
                        this.ctx.moveTo(this.point[i].x, this.point[i].y);
                    } else {
                        this.ctx.lineTo(this.point[i].x, this.point[i].y);
                    }
                }
                this.ctx.closePath();
                this.ctx.strokeStyle = `hsla(${this.hue}, 100%, 50%, ${this.alpha})`;
                this.ctx.stroke();
            }
            update() {
                this.setPoint();
                this.radius -= .05;
                this.size += .5;
                this.rotate -= 1;
                this.alpha = (this.radius * 0.5 < 0.5) ? this.radius * 0.5 : 0.5;
            }
        };
    }
}
</script>

<style>
body {
    padding: 0;
    margin: 0;
    height: 100vh;
    background-color: #222;
}

canvas {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}

.youtube-link {
    position: fixed;
    left: 20px;
    bottom: 20px;
    color: #fff;
    text-decoration: none;
    font-size: 12px;
}
</style>