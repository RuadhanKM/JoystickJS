const componentTransform = {
    name: "Transform",
    Pos: new Vec2(),
    Size: new Vec2(),
    Rot: 0,
    inspector: [
        "Pos",
        "Size",
        "Rot"
    ]
}

const componentRenderer = {
    name: "Renderer",
    Color: "rgba(255,255,255,1)",
    inspector: [
        "Color"
    ]
}

const componentCamera = {
    name: "Camera",
    renderToScreen: false,
    inspector: [
        "renderToScreen"
    ]
}

var defaultComponents = [
    componentTransform,
    componentRenderer,
    componentCamera
]