class Vec2 {
    constructor(_x=0, _y=0) {
        this.x = _x
        this.y = _y
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
        this.name = "New Object"

        this.inspectorElements = [
            {
                type: "text",
                title: "Name",
                value: "name"
            }
        ]

        this.components = []
    }

    addComponent(component) {
        this[component.name] = component.body
        this.components.push(component)
    }

    getDecendents() {
        let out = []

        function a(children) {
            depth++
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
            if (child.name == childName) return child
        }
    }
}

const game = new JJS_Object({children: []})
const workspace = new JJS_Object(game)

workspace.inspectorElements[0].readonly = true

workspace.name = "Workspace"

class JJS_Folder extends JJS_Object {
    constructor(_parent=workspace) {
        super(_parent)
        this.class = OBJECT_TYPE_FOLDER
        this.name = "New Folder"
    }
}

class JJS_Group extends JJS_Object {
    constructor(_parent=workspace) {
        super(_parent)
        this.class = OBJECT_TYPE_GROUP
        this.name = "New Group"
    }
}

class JJS_Rect extends JJS_Object {
    constructor(_pos, _size, _parent=workspace) {
        super(_parent)
        this.class = OBJECT_TYPE_RECT
        this.name = "New Rect"
    }
}

class JJS_Sprite extends JJS_Rect {
    constructor(_pos, _size, _img, _parent=workspace) {
        super(_pos, _size, _parent)
        this.img = _img
        this.class = OBJECT_TYPE_SPRITE
        this.name = "New Sprite"

        this.inspectorElements.push({
            type: "text",
            title: "Sprite URL",
            value: "img"
        })
    }
}

class JJS_Cam extends JJS_Rect {
    constructor(_pos, _size, _parent=workspace) {
        super(_pos, _size, _parent)
        this.class = OBJECT_TYPE_CAM
        this.name = "New Cam"
    }
}