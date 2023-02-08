const canvas = document.getElementById("c")
const ctx = canvas.getContext("2d")
ctx.fillRect(0, 0, 1280, 720)

var tick = 0
var playing = false

var lastGameState

function playClick() {
    playing ? (playing = false) : start()
    document.getElementById("play-button").className = playing ? "error bi bi-stop-fill" : "success bi bi-play-fill"
}

function start() {
    tick = 0
    playing = true
    lastGameState = serializeGameState()

    if (inCodeMode) toggleCodeMode()

    for (const obj of game.getDecendents()) {
        for (const comp of obj.components) {
            comp.start?.()
        }
    }

    requestAnimationFrame(loop)
}

function stop() {
    deserializeGameState(lastGameState)
}

function loop() {
    tick++

    for (const obj of game.getDecendents()) {
        for (const comp of obj.components) {
            comp.update?.()
            updateInspector()
            updateSceneList()
        }
    }

    playing ? requestAnimationFrame(loop) : stop()
}