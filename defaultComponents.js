function addDefaultComponent(value) {
    let a = {value: value, parsedValue: eval("(" + value + ")"), error: false, objects: []}

    rawComponents.push(a)

    return a
}

const componentTransform = addDefaultComponent(
`class Transform {
    constructor() {
        this.Pos = new Vec2()
        this.Size = new Vec2()
        this.Rot = 0

        this.inspector = [
            "Pos",
            "Size",
            "Rot"
        ]
    }
}`)

const componentRenderer = addDefaultComponent(
`class Renderer {
    constructor() {
        this.Color = "#FFFFFF"

        this.inspector = [
            "Color"
        ]
    }
    render() {
        ctx.translate(
            (this.object?.Transform?.Pos?.x || 0), 
            (this.object?.Transform?.Pos?.y || 0)
        )
        ctx.rotate(this.object?.Transform?.Rot || 0)

        ctx.fillStyle = this.Color

        ctx.fillRect(
            -(this.object?.Transform?.Size?.x/2 || 0),
            -(this.object?.Transform?.Size?.y/2 || 0),
            (this.object?.Transform?.Size?.x || 0),
            (this.object?.Transform?.Size?.y || 0),
        )
    }
}`)

const componentCamera = addDefaultComponent(
`class Camera {
    constructor() {
        this.renderToScreen = false

        this.inspector = [
            "renderToScreen"
        ]
    }
}`)