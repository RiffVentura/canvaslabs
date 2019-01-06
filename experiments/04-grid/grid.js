window.addEventListener('load', function () {
    const app = new App(document.getElementById('mainCanvas'));
}, false);


class App {
    constructor(canvasNode) {
        this.canvas = canvasNode;
        this.context = canvasNode.getContext('2d');
        this.height = canvasNode.height;
        this.width = canvasNode.width;

        this.divisionLevel = 4;
        this.divisionLevelMin = 2;
        this.divisionLevelMax = 6;
        this.cellWidth = this.width / this.divisionLevel;
        this.cellHeight = this.height / this.divisionLevel;
        this.cellX = -1;
        this.cellY = -1;

        this.userScore = 0;
        this.scoreLevelUp = 5;
        this.scoreLevelDown = -5;

        this.color = "lime";

        this.bindInput();
        this.generateCell();
    }
    bindInput() {
        this.canvas.addEventListener('mousedown', (e) => {
            this.userClick(e.layerX,e.layerY);            
        }, false);
    }
    drawBlank() {
        this.context.fillStyle = 'white';
        this.context.fillRect(0, 0, this.width, this.height);
    }
    generateCell() {
        this.cellX = Math.trunc(Math.random()  * this.divisionLevel);
        this.cellY = Math.trunc(Math.random()  * this.divisionLevel);
        this.drawBlank();
        this.drawCell()
    }
    drawCell() {  
        this.context.fillStyle = this.color;
        this.context.fillRect(this.cellX * this.cellWidth, this.cellY * this.cellHeight, this.cellWidth, this.cellHeight);
    }
    userClick(x,y) {
        this.userScore += (this.cellClickCheck(x,y) ? 1 : -1);
        console.log(this.userScore);
        if(this.scoreLevelUp === this.userScore) {
            this.levelUp();
        }
        if(this.scoreLevelDown === this.userScore) {
            this.levelDown();
        }
        this.generateCell();
    }
    cellClickCheck(x,y) {
        return this.cellX * this.cellWidth <= x  && x<= this.cellX * this.cellWidth + this.cellWidth 
        && this.cellY * this.cellHeight <=y && y <= this.cellY * this.cellHeight +this.cellHeight;
    }
    levelUp() {
        console.log('division level : ' + this.divisionLevel);
        
        
        if(this.divisionLevel === this.divisionLevelMax) {
            this.userScore = this.scoreLevelUp;
            return;
        }
        this.userScore = 0;
        ++this.divisionLevel;
        this.cellWidth = this.width / this.divisionLevel;
        this.cellHeight = this.height / this.divisionLevel;
    }
    levelDown() {
        console.log('division level : ' + this.divisionLevel);
        
        if(this.divisionLevel === this.divisionLevelMin) {
            this.userScore = - this.scoreLevelDown;
            return;
        }
        this.userScore = 0;
        --this.divisionLevel;
        this.cellWidth = this.width / this.divisionLevel;
        this.cellHeight = this.height / this.divisionLevel;
    }
}
