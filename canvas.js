const canvas = document.getElementById("c")
const ctx = canvas.getContext("2d")
ctx.fillRect(0, 0, canvas.width, canvas.height)

requestAnimationFrame(editorLoop)

var tick = 0
var playing = false

var lastGameState

var events = []

function addEvent(event, func) {
    document.addEventListener(event, func)
    events.push([event, func])
}

function renderScreen() {
    ctx.resetTransform()
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (const obj of game.getDecendents()) {
        for (const comp of obj.components) {
            if (obj[comp.parsedValue.name].render) {
                ctx.resetTransform()
                ctx.translate(canvas.width/2, canvas.height/2)
                ctx.scale(1, -1)

                try {
                    obj[comp.parsedValue.name].render()
                } catch (e) {
                    console.error(e)
                }
            }
        }
    }
}

function playClick() {
    playing = !playing
    document.getElementById("play-button").className = playing ? "error bi bi-stop-fill" : "success bi bi-play-fill"
}

function start() {
    ctx.resetTransform()
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    tick = 0
    playing = true
    lastGameState = serializeGameState()

    if (inCodeMode) toggleCodeMode()

    for (const obj of game.getDecendents()) {
        for (const comp of obj.components) {
            obj[comp.parsedValue.name].start?.()
        }
    }

    requestAnimationFrame(gameLoop)
}

function stop() {
    ctx.resetTransform()
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (const event of events) {
        document.removeEventListener(event[0], event[1])
    }

    deserializeGameState(lastGameState)
    requestAnimationFrame(editorLoop)
}

function editorLoop() {
    renderScreen()

    for (const obj of game.getDecendents()) {
        for (const comp of obj.components) {
            if (obj[comp.parsedValue.name].editorRender) {
                ctx.resetTransform()
                ctx.translate(canvas.width/2, canvas.height/2)
                ctx.scale(1, -1)
                try {
                    obj[comp.parsedValue.name].editorRender()
                } catch (e) {
                    console.error(e)
                }
            }
        }
    }

    !playing ? requestAnimationFrame(editorLoop) : start()
}

function gameLoop() {
    tick++

    for (const obj of game.getDecendents()) {
        for (const comp of obj.components) {
            obj[comp.parsedValue.name].update?.()
            if (tick % 10 == 0) {
                updateInspector()
                updateSceneList()
            }
        }
    }

    renderScreen()

    playing ? requestAnimationFrame(gameLoop) : stop()
}