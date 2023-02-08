function addDefaultComponent(value) {
    let a = {value: value, parsedValue: eval("(" + value + ")"), error: false}

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
        this.Color = "rgba(255, 255, 255, 1)"

        this.inspector = [
            "Color"
        ]
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