const componentTransform = {
    name: "Transform",
    body: {
        pos: new Vec2(),
        size: new Vec2(),
        rot: 0
    },
    inspector: [
        {
            type: "vector",
            title: "Position",
            value: "pos"
        },
        {
            type: "vector",
            title: "Size",
            value: "size"
        },
        {
            type: "num",
            title: "Rotation",
            value: "rot"
        }
    ]
}