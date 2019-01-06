window.addEventListener('load', function () {
    const game = new Game(document.getElementById('mainCanvas'));
    game.start();
}, false);


class Game {
    constructor(canvasNode) {
        this.canvas = canvasNode;
        this.context = canvasNode.getContext('2d');
        this.height = canvasNode.height;
        this.width = canvasNode.width;
        this.lastTimestamp = performance.now();
        this.frameStep = 1 / 120;
        this.gameWorld = new GameWorld(this);
        this.inputController = {
            'left': 0,
            'right': 0,
        };
        this.inputMapper = {
            'LEFT': 'left',
            'RIGHT': 'right',
            'A': 'left',
            'D': 'right'
        };
        this.inputKey = {
            '37': 'LEFT',
            '39': 'RIGHT',
            '65': 'A',
            '68': 'D',
        }
    }
    start() {
        this.bindInputs();
        // window.requestAnimationFrame(this.gameLoopMinimumStep.bind(this));
        window.requestAnimationFrame(this.gameLoop.bind(this));
    }
    gameLoopMinimumStep(timestamp) {
        let deltaTime = Math.min(1, (timestamp - this.lastTimestamp) / 1000);
        this.lastTimestamp = timestamp;
        this.handleInput();
        while (deltaTime > this.frameStep) {
            deltaTime -= this.frameStep;
            this.update(this.frameStep);
        }
        this.update(deltaTime);
        this.render();
        window.requestAnimationFrame(this.gameLoopMinimumStep.bind(this));
    }
    gameLoop(timestamp) {
        let deltaTime = Math.min(1, (timestamp - this.lastTimestamp) / 1000);
        this.lastTimestamp = timestamp;
        this.handleInput();
        this.update(deltaTime);
        this.render();
        window.requestAnimationFrame(this.gameLoop.bind(this));
    }
    handleInput() {
        this.gameWorld.player.dx = this.inputController.right - this.inputController.left;
    }
    update(dt) {
        this.gameWorld.update(dt);
    }
    render() {
        this.context.fillStyle = '#3f3f3f';
        this.context.fillRect(0, 0, this.width, this.height);
        this.gameWorld.render(this.context);
    }
    bindInputs() {
        document.addEventListener('keydown', (e) => { return this.onkey(e, e.keyCode, 1); }, false);
        document.addEventListener('keyup', (e) => { return this.onkey(e, e.keyCode, 0); }, false);
    }
    onkey(event, keyCode, pressed) {
        //event.preventDefault();
        if (!this.inputKey.hasOwnProperty(keyCode)) //only listen to mapped keys ingore everything else
            return;
        this.inputController[this.inputMapper[this.inputKey[keyCode]]] = pressed;
    }
}

class GameWorld {
    constructor(game) {
        this.game = game;
        this.bounds = {
            x: 300,
            y: 0,
            w: 300,
            h: 600
        };
        this.playerLine = 450;

        this.player = new Player(450, this.playerLine, 50, 50, this);

        this.fallBoxes = [];
        this.maxFallBox = 10;
        this.startLineNextBox = 100

        this.prepareLevel();
    }
    update(dt) {
        this.player.update(dt);
        const firstBox = this.fallBoxes[0];
        for (let ind = 0; ind < this.fallBoxes.length; ind++) {
            this.fallBoxes[ind].update(dt);
        }
        for (let ind = 1; ind < this.fallBoxes.length; ind++) {
            if (this.fallBoxes[ind].dy === 0 && this.fallBoxes[ind - 1].y > (this.bounds.y + this.startLineNextBox)) {
                this.fallBoxes[ind].dy = 1;
                break;
            }
        }
        const playerHitbox = this.player.getHitbox();
        let anyCollision = false;
        for (let ind = 0; ind < this.fallBoxes.length; ind++) {
            if (this.fallBoxes[ind].isColliding(playerHitbox)) {
                anyCollision = true;
            }
        }
        if (anyCollision) {
            this.player.getHit();
        } else {
            this.player.recover();
        }
    }
    render(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h);

        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.moveTo(this.bounds.x, this.playerLine);
        ctx.lineTo(this.bounds.x + this.bounds.w, this.playerLine);
        ctx.stroke();
        ctx.closePath();

        for (let ind = 0; ind < this.fallBoxes.length; ind++) {
            this.fallBoxes[ind].render(ctx);
        }
        this.player.render(ctx);
    }
    getLimits() {
        return {
            'left': this.bounds.x,
            'right': this.bounds.x + this.bounds.w,
            'up': this.bounds.y,
            'down': this.bounds.y + this.bounds.h,

        };
    }
    prepareLevel() {

        const startPointY = this.bounds.y - 200;
        for (let index = 0; index < this.maxFallBox; index++) {
            let startPointX = this.bounds.x + Math.random() * (this.bounds.w - 25) + 25;
            this.fallBoxes[index] = new FallingBox(startPointX, startPointY, 25, 50, this);
        }
        this.fallBoxes[0].dy = 1;
    }
}

class Entity {
    constructor(x, y, width, height, gameWorld) {
        this.gameWorld = gameWorld;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = 'black';
        this.dx = 0;
        this.dy = 0;
        this.speed = 1;
    }
    update(dt) {
        this.x += this.dx * dt * this.speed;
        this.y += this.dy * dt * this.speed;
    }
    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

        // DEBUG BOUNDING BOX
        // ctx.fillStyle = 'black';
        // ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2,4,4);
        // ctx.fillRect(this.x - this.width / 2 +this.width, this.y - this.height / 2 + this.height,4,4);
        // ctx.fillRect(this.x - this.width / 2 +this.width, this.y - this.height / 2,4,4);
        // ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2+ this.height,4,4);
    }
    getHitbox() {
        return {
            'x': this.x - this.width / 2,
            'y': this.y - this.height / 2,
            'width': this.width,
            'height': this.height,
        }
    }
    isColliding(otherHitbox) {
        let boundsX = this.x - this.width / 2;
        let boundsY = this.y - this.height / 2;
        return boundsX + this.width >= otherHitbox.x && boundsX <= otherHitbox.x + otherHitbox.width &&
            boundsY + this.height >= otherHitbox.y && boundsY <= otherHitbox.y + otherHitbox.height;
    }
}

class Player extends Entity {
    constructor(x, y, w, h, gameWorld) {
        super(x, y, w, h, gameWorld);
        this.color = 'blue';
        this.speed = 1000;
        this.isColliding = false;
        this.recentlyHit = false;
        this.cooldownTime = 0;
        this.hitCooldownTimer = 1;
        this.state = "NORMAL";
    }
    update(dt) {
        this.x += this.dx * dt * this.speed;
        const limits = this.gameWorld.getLimits();
        if (this.x - this.width / 2 < limits.left) {
            this.x = limits.left + this.width / 2;
        }
        if (this.x + this.width / 2 > limits.right) {
            this.x = limits.right - this.width / 2;
        }
        // if (this.isColliding && this.cooldownTime === 0) {
        //     this.cooldownTime = this.hitCooldownTimer;
        //     this.color = 'rgb(' + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ')';
        // }
        // if (this.cooldownTime > 0) {
        //     this.cooldownTime -= dt;
        // } else {
        //     this.cooldownTime = 0;
        // }
    }
    getHit() {
        if (this.state !== "NORMAL") {
            return;
        }
        this.state = "HURT";
        this.color = 'rgb(' + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ')';
    }
    recover() {
        if (this.state === "NORMAL") {
            return;
        }
        this.state = "NORMAL";
        this.color = 'rgb(0,0,255)';
    }
}

class FallingBox extends Entity {
    constructor(x, y, w, h, gameWorld) {
        super(x, y, w, h, gameWorld);
        this.color = 'red';
        this.speed = 500;
        this.offScreenOffset = 300;
    }
    update(dt) {
        Entity.prototype.update.call(this, dt);
        const limits = this.gameWorld.getLimits();
        if (this.y + this.height / 2 > limits.down + this.offScreenOffset) {
            this.y = limits.up - this.width / 2 - this.offScreenOffset;
            this.x = limits.left + Math.random() * (limits.right - limits.left - this.width / 2) + this.width / 2;
        }

    }
}