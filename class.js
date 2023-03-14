class Vec2 {
    constructor(_x=0, _y=0) {
        this.x = _x
        this.y = _y
    }

    toString() {
        return `${this.x},${this.y}`
    }

    static fromString(string) {
        return new Vec2(...string.split(',').map(parseFloat))
    }

    mag() {
        return (this.x**2 + this.y**2)**0.5
    }

    norm(s=1) {
        let invMag = 1/this.mag()
        return new Vec2(this.x*invMag*s, this.y*invMag*s)
    }

    dot (o) {
        return this.x*o.x + this.y*o.y
    }

    lerp(b, t) {
        return this.add((b.sub(this)).muls(t))
    }

    add(o) {return new Vec2(this.x + o.x, this.y + o.y)}
    sub(o) {return new Vec2(this.x - o.x, this.y - o.y)}
    mul(o) {return new Vec2(this.x * o.x, this.y * o.y)}
    div(o) {return new Vec2(this.x / o.x, this.y / o.y)}
    muls(s) {return new Vec2(this.x * s, this.y * s)}
    divs(s) {return new Vec2(this.x / s, this.y / s)}

    madd(o) {this.x += o.x; this.y += o.y}
    msub(o) {this.x -= o.x; this.y -= o.y}
    mmul(o) {this.x *= o.x; this.y *= o.y}
    mdiv(o) {this.x /= o.x; this.y /= o.y}
    mmuls(s) {this.x *= s; this.y *= s}
    mdivs(s) {this.x /= s; this.y /= s}
}

class JJS_Object {
    constructor(_parent) {
        this.parent = _parent
        this.children = []
        this.parent.children.push(this)
        this.sceneMenuCollapsed = false
        this.Name = "New Object"

        this.inspectorElements = [
            "Name"
        ]

        this.components = []
    }

    destroy() {
        this.parent.children.splice(this.parent.children.indexOf(this), 1)
        this.parent = undefined

        for (const comp of this.components) {
            comp.objects.splice(comp.objects.indexOf(this), 1)
        }
    }

    addComponent(component) {
        if (this[component.parsedValue.name]) {
            console.warn(`Component with name ${component.parsedValue.name} already exsists on this object!`)
            return
        }

        let a = new (component.parsedValue)()

        a.JJS_Name = component.parsedValue.name
        a.object = this

        component.objects.push(this)

        this[component.parsedValue.name] = a
        this.components.push(component)
    }

    removeComponent(component) {
        if (!this[component.parsedValue.name]) {
            console.warn(`Component with name ${component.parsedValue.name} doesn't exsist on this object!`)
            return
        }

        component.objects.splice(component.objects.indexOf(this), 1)
        delete this[component.parsedValue.name]
        this.components.splice(this.components.indexOf(component), 1)
    }

    getDecendents() {
        let out = []

        function a(children) {
            for (const child of children) {
                out.push(child)
                a(child.children)
            }
        }

        a(this.children)

        return out
    }

    isDecendentOf(object) {
        let cur = this

        while (cur.parent) {
            cur = cur.parent

            if (cur == object) {
                return true
            }
        }

        return false
    }

    getParents() {
        let cur = this
        let out = []

        while (cur != workspace) {
            cur = cur.parent
            out.push(cur)
        }

        return out
    }

    isParentOf(object) {
        for (const obj of object.getDecendents()) {
            if (obj == object) return true
        }
        return false
    }

    findFirstChild(childName) {
        for (const child of this.children) {
            if (child.Name == childName) return child 
        }
    }

    findFirstDecendent(decendentName) {
        for (const descendent of this.getDecendents()) {
            if (descendent.Name == decendentName) return descendent
        }
    }
}

var game = new JJS_Object({children: []})
var workspace = new JJS_Object(game)
workspace.Name = "Workspace"