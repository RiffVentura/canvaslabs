window.addEventListener('load', function () {
    canvasApp();
}, false);

function canvasApp() {
    const canvas = document.getElementById('mainCanvas');
    const context = canvas.getContext('2d');

    clearCanvas(context,canvas);
    drawScreen(context, canvas);

}


function clearCanvas(context,canvas) {
    context.fillStyle = '#d1e5e1';
    context.fillRect(0, 0, canvas.width, canvas.height);
}