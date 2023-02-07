const canvas = document.getElementById("c")
const ctx = canvas.getContext("2d")
ctx.fillRect(0, 0, 1280, 720)

var tick = 0
var playing = false

function playClick() {
    playing ? stop() : start()
}

function start() {
    tick = 0
    playing = true

    if (inCodeMode) toggleCodeMode()

    for (const obj of game.getDecendents()) {
        for (const comp of obj.components) {
            comp.start?.()
        }
    }

    requestAnimationFrame(loop)
}

function stop() {
    playing = false
}

function loop() {
    tick++

    for (const obj of game.getDecendents()) {
        for (const comp of obj.components) {
            comp.update?.()
        }
    }

    if (playing) requestAnimationFrame(loop)
}