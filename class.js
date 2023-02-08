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

    norm() {
        let invMag = 1/this.mag()
        return new Vec2(this.x*invMag, this.y*invMag)
    }

    dot (o) {
        return this.x*o.x + this.y*o.y
    }

    add(o) {return new Vec2(this.x + o.x, this.y + o.y)}
    sub(o) {return new Vec2(this.x - o.x, this.y - o.y)}
    mul(o) {return new Vec2(this.x * o.x, this.y * o.y)}
    div(o) {return new Vec2(this.x / o.x, this.y / o.y)}
    mulS(s) {return new Vec2(this.x * s, this.y * s)}
    divS(s) {return new Vec2(this.x / s, this.y / s)}
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
    }

    addComponent(component) {
        if (this[component.name]) {
            console.warn(`Component with name ${component.name} already exsists on this object!`)
            return
        }

        let a = new (component)()

        a.JJS_Name = component.name

        this[component.name] = a
        this.components.push(a)
    }

    removeComponent(component) {
        if (!this[component.JJS_Name]) {
            console.warn(`Component with name ${component.JJS_Name} doesn't exsist on this object!`)
            return
        }

        delete this[component.JJS_Name]
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

    findFirstChild(childName) {
        for (const child of this.children) {
            if (child.Name == childName) return child
        }
    }
}

var game = new JJS_Object({children: []})
var workspace = new JJS_Object(game)
workspace.Name = "Workspace"

class JJS_Folder extends JJS_Object {
    constructor(_parent=workspace) {
        super(_parent)
        this.class = OBJECT_TYPE_FOLDER
        this.Name = "New Folder"
    }
}

class JJS_Group extends JJS_Object {
    constructor(_parent=workspace) {
        super(_parent)
        this.class = OBJECT_TYPE_GROUP
        this.Name = "New Group"
    }
}

class JJS_Rect extends JJS_Object {
    constructor(_parent=workspace) {
        super(_parent)
        this.class = OBJECT_TYPE_RECT
        this.Name = "New Rect"
    }
}

class JJS_Cam extends JJS_Rect {
    constructor(_parent=workspace) {
        super(_parent)
        this.class = OBJECT_TYPE_CAM
        this.Name = "New Cam"
    }
}