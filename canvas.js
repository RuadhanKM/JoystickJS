const canvas = document.getElementById("c")
const ctx = canvas.getContext("2d")
ctx.fillRect(0, 0, canvas.width, canvas.height)

requestAnimationFrame(editorLoop)

var tick = 0
var playing = false

var lastGameState

var events = []

function addEvent(event, func) {
    canvas.addEventListener(event, func)
    events.push([event, func])
}

var editorKeys = {}
canvas.addEventListener("keydown", e => editorKeys[e.key] = true)
canvas.addEventListener("keyup", e => editorKeys[e.key] = false)

var editorPos = new Vec2()
var editorZoom = 1

function renderScreen() {
    ctx.resetTransform()
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (const cam of game.getDecendents()) {
        if (cam.Camera || !playing) {
            let _canv = document.createElement("canvas")
            _canv.width = cam?.Transform?.Size?.x || 100
            _canv.height = cam?.Transform?.Size?.y || 100
            let _ctx = _canv.getContext("2d")
            
            _ctx.resetTransform()
            _ctx.fillStyle = playing ? cam.Camera.backgroundColor : "black"
            _ctx.fillRect(0, 0, _canv.width, _canv.height)

            if (!playing) {
                _ctx = ctx
                _canv = canvas   
            }
            for (const obj of game.getDecendents().sort((a, b) => (b.Transform?.Depth || 1) - (a.Transform?.Depth || 1))) {
                for (const comp of obj.components) {
                    if (obj[comp.parsedValue.name]?.render) {
                        _ctx.resetTransform()
                        _ctx.translate(_canv.width/2, _canv.height/2)
                        
                        if ((obj?.Transform?.Depth || 1) <= 0) continue
                        _ctx.scale(1/(obj?.Transform?.Depth || 1), 1/(obj?.Transform?.Depth || 1))

                        if (playing) {
                            _ctx.translate(-cam?.Transform?.Pos?.x || 0, cam?.Transform?.Pos?.y || 0)
                            _ctx.rotate(-cam?.Transform?.Rot || 0)
                        } else {
                            _ctx.scale(editorZoom, editorZoom)
                            _ctx.translate(editorPos.x, editorPos.y)
                        }

                        _ctx.scale(1, -1)

                        try {
                            obj[comp.parsedValue.name].render?.(_ctx)
                        } catch (e) {
                            console.error(`Error in component "${comp.parsedValue.name}" on object "${obj.Name}" during "render()"`, e)
                            playing = true
                            playClick()
                        }
                    }
                }
            }

            if (cam?.Camera?.renderToScreen && playing) {
                ctx.drawImage(_canv, 0, 0, _canv.width, _canv.height, 0, 0, canvas.width, canvas.height)
            }
        }
        if (!playing) break
    }
}

function playClick() {
    playing = !playing
    document.getElementById("play-button").className = playing ? "error bi bi-stop-fill" : "success bi bi-play-fill"
    document.getElementById("play-button").blur()
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
            try {
                obj[comp.parsedValue.name].start?.()
            } catch (e) {
                console.error(`Error in component "${comp.parsedValue.name}" on object "${obj.Name}" during "start()"`, e)
                playing = true
                playClick()
            }
        }
    }

    requestAnimationFrame(gameLoop)
}

function stop() {
    ctx.resetTransform()
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (const event of events) {
        canvas.removeEventListener(event[0], event[1])
    }

    deserializeGameState(lastGameState)
    requestAnimationFrame(editorLoop)
}

function editorLoop() {    
    editorPos.y += (editorKeys.w || 0) * 10 / editorZoom
    editorPos.x += (editorKeys.a || 0) * 10 / editorZoom
    editorPos.y -= (editorKeys.s || 0) * 10 / editorZoom
    editorPos.x -= (editorKeys.d || 0) * 10 / editorZoom
    editorZoom = Math.min(Math.max(editorZoom + ((editorKeys['='] || 0)*editorZoom/100) - ((editorKeys['-'] || 0)*editorZoom/100), 0.01), 1000)

    renderScreen()

    for (const obj of game.getDecendents()) {
        for (const comp of obj.components) {
            if (obj[comp.parsedValue.name]?.editorRender) {
                ctx.resetTransform()
                
                ctx.translate(canvas.width/2, canvas.height/2)
                ctx.scale(editorZoom, -editorZoom)
                ctx.translate(editorPos.x, -editorPos.y)
                
                try {
                    obj[comp.parsedValue.name].editorRender?.()
                } catch (e) {
                    console.error(`Error in component "${comp.parsedValue.name}" on object "${obj.Name}" during "editorRender()"`, e)
                    playing = true
                    playClick()
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
            try {
                obj[comp.parsedValue.name].update?.()
            } catch (e) {
                console.error(`Error in component "${comp.parsedValue.name}" on object "${obj.Name}" during "update()"`, e)
                playing = true
                playClick()
            }
            if (tick % 50 == 0) {
                updateInspector()
                updateSceneList()
            }
        }
    }

    renderScreen()

    playing ? requestAnimationFrame(gameLoop) : stop()
}