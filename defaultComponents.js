function addDefaultComponent(value) {
    let a = {value: value, parsedValue: eval("(" + value + ")"), error: false, objects: []}

    rawComponents.push(a)

    return a
}

const componentTransform = addDefaultComponent(
`class Transform {
    constructor() {
        this.PosOffset = new Vec2()
        this.Size = new Vec2()
        this.RotOffset = 0

        this.inspector = [
            "PosOffset",
            "Size",
            "RotOffset"
        ]
    }
    get Pos() {
        if (this.object.parent.Transform) {
            let r = this.object.parent.Transform.Rot
            let pMag = this.PosOffset.mag()
            let rOffset = new Vec2((Math.cos(r*0.01745))*pMag-this.PosOffset.x, (Math.sin(r*0.01745))*pMag-this.PosOffset.y)

            return this.PosOffset
                .add(this.object.parent.Transform.Pos)
                .add(rOffset) 
        }
        else 
            return this.PosOffset
    }
    set Pos(v) {
        this.PosOffset = v
    }
    
    get Rot() {
        if (this.object.parent.Transform) 
            return this.RotOffset + this.object.parent.Transform.Rot; 
        else 
            return this.RotOffset
    }
    set Rot(v) {
        this.RotOffset = v
    }
    
    setCtxTransform(c) {
        let p = this.Pos

        c.translate(
            p.x,
            p.y
        )
        c.rotate(this.Rot*0.01745)
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
    render(ctx) {
        this.object?.Transform?.setCtxTransform?.(ctx)

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
        this.backgroundColor = "#000000"

        this.inspector = [
            "renderToScreen",
            "backgroundColor"
        ]
    }
    editorRender() {
        this.object?.Transform?.setCtxTransform?.(ctx)

        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2/editorZoom
        
        ctx.strokeRect(
            -this.object?.Transform?.Size?.x/2 || 0,
            -this.object?.Transform?.Size?.y/2 || 0,
            this.object?.Transform?.Size?.x || 0,
            this.object?.Transform?.Size?.y || 0
        )
    }
}`)

addDefaultComponent(
`class PlayerController {
	constructor() {
		this.Acceleration = 0.3
        this.MaxSpeed = 4
        this.Deceleration = 0.3
        this.TopDown = true
        this.Gravity = 0.2
        this.JumpPower = 5
        this.HoldJump = true

        this.Vel = new Vec2()

        this.Keys = {}

        this.inspector = [
            "Acceleration",
            "MaxSpeed",
            "Deceleration",
            "TopDown",
            "Gravity",
            "JumpPower",
            "HoldJump"
        ]
	}
	start() {
		addEvent("keydown", e => {
            this.Keys[e.key] = true
            
            if (e.key == ' ' && !this.TopDown && this.object?.AABBCollider?.Grounded && !this.HoldJump) {
                this.Vel.y += this.JumpPower
            }
        })
        addEvent("keyup", e => {
            this.Keys[e.key] = false
        })
	}
	update() {
        if (this.Keys['d']) {
            this.Vel.x += this.Acceleration
        }
        if (this.Keys['a']) {
            this.Vel.x -= this.Acceleration
        }

		if (this.TopDown) {
            if (this.Keys['w']) {
                this.Vel.y += this.Acceleration
            }
            if (this.Keys['s']) {
                this.Vel.y -= this.Acceleration
            }
        } else {
            this.Vel.y -= this.Gravity
            
            
            if (this.Keys[' '] && this.object?.AABBCollider?.Grounded && this.HoldJump) {
                this.Vel.y += this.JumpPower
            }
        }

        if (!(this.Keys['a'] || this.Keys['d'])) {
            if (Math.abs(this.Vel.x) < this.Deceleration) {
                this.Vel.x = 0
            } else {
                this.Vel.x -= this.Deceleration * Math.sign(this.Vel.x)
            }
        }
        if (!(this.Keys['w'] || this.Keys['s']) && this.TopDown) {
            if (Math.abs(this.Vel.y) < this.Deceleration) {
                this.Vel.y = 0
            } else {
                this.Vel.y -= this.Deceleration * Math.sign(this.Vel.y)
            }
        }

        if (Math.abs(this.Vel.x) > this.MaxSpeed) this.Vel.x = this.MaxSpeed * Math.sign(this.Vel.x)
        if (Math.abs(this.Vel.y) > this.MaxSpeed && this.TopDown) this.Vel.y = this.MaxSpeed * Math.sign(this.Vel.y)

        this.object.Transform.Pos.madd(this.Vel)
	}
}`)

addDefaultComponent(
`class AABBCollider {
	constructor() {
		this.Size = new Vec2(20, 20)
        this.Static = false
        this.Grounded = false
        
        this.inspector = [
            "Size",
            "Static"
        ]
	}
	start() {
		
	}
	update() {
        this.Grounded = false
        if (this.Static) return

		for (const obj of game.getDecendents()) {
            if (obj == this.object) continue
            if (!obj.AABBCollider || !obj.Transform || !this.object.Transform) continue

            let t = this.object.Transform
            let o = obj.Transform

            let tp = t.Pos
            let op = o.Pos

            if (
                tp.x + this.Size.x/2 > op.x - obj.AABBCollider.Size.x/2 &&
                tp.x - this.Size.x/2 < op.x + obj.AABBCollider.Size.x/2 &&
                tp.y + this.Size.y/2 > op.y - obj.AABBCollider.Size.y/2 &&
                tp.y - this.Size.y/2 < op.y + obj.AABBCollider.Size.y/2
            ) {
                let tDis = Math.abs((tp.y - this.Size.y/2) - (op.y + obj.AABBCollider.Size.y/2))
                let bDis = Math.abs((tp.y + this.Size.y/2) - (op.y - obj.AABBCollider.Size.y/2))
                let lDis = Math.abs((tp.x + this.Size.x/2) - (op.x - obj.AABBCollider.Size.x/2))
                let rDis = Math.abs((tp.x - this.Size.x/2) - (op.x + obj.AABBCollider.Size.x/2))

                let min = Math.min(tDis, bDis, lDis, rDis)

                if (min == tDis) {
                    if (obj.AABBCollider.Static) {
                        if (this.object.PlayerController) this.object.PlayerController.Vel.y = 0
                        tp.y = op.y+obj.AABBCollider.Size.y/2+this.Size.y/2

                        this.Grounded = true
                    } else {
                        tp.y += min/2
                        op.y -= min/2
                    }
                } else if (min == bDis) {
                    if (obj.AABBCollider.Static) {
                        if (this.object.PlayerController) this.object.PlayerController.Vel.y = 0
                        tp.y = op.y-obj.AABBCollider.Size.y/2-this.Size.y/2
                    } else {
                        tp.y -= min/2
                        op.y += min/2
                    }
                } else if (min == lDis) {
                    if (obj.AABBCollider.Static) {
                        if (this.object.PlayerController) this.object.PlayerController.Vel.x = 0
                        tp.x = op.x-obj.AABBCollider.Size.x/2-this.Size.x/2
                    } else {
                        tp.x -= min/2
                        op.x += min/2
                    }
                } else if (min == rDis) {
                    if (obj.AABBCollider.Static) {
                        if (this.object.PlayerController) this.object.PlayerController.Vel.x = 0
                        tp.x = op.x+obj.AABBCollider.Size.x/2+this.Size.x/2
                    } else {
                        tp.x += min/2
                        op.x -= min/2
                    }
                }
            }
        }
	}
    editorRender() {
        this.object?.Transform?.setCtxTransform?.(ctx)
        ctx.rotate(-(this.object?.Transform?.Rot || 0))

        ctx.strokeStyle = "#00FF00"
        ctx.lineWidth = 2/editorZoom

        ctx.strokeRect(
            -this.Size.x/2,
            -this.Size.y/2,
            this.Size.x,
            this.Size.y
        )
    }
}`)