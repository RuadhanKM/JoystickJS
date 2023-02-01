const canvas = document.getElementById("c")
const ctx = canvas.getContext("2d")
ctx.fillRect(0, 0, 1280, 720)

const sceneMenuItems = [
    {
        content: `New Folder`,
        events: {
            click: () => addSceneObject(new JJS_Folder(selectedScenesMenuObject))
        }
      },
    {
        content: `New Group`,
        events: {
            click: () => addSceneObject(new JJS_Group(selectedScenesMenuObject))
        }
      },
    {
        content: `New Sprite`,
        events: {
            click: () => addSceneObject(new JJS_Sprite(new Vec2(), new Vec2(10, 10), "", selectedScenesMenuObject))
        }
    },
    {
        content: `New Rect`,
        events: {
            click: () => addSceneObject(new JJS_Rect(new Vec2(), new Vec2(10, 10), selectedScenesMenuObject))
        }
    },
    {
        content: `New Cam`,
        events: {
            click: () => addSceneObject(new JJS_Cam(new Vec2(), new Vec2(1280, 720), selectedScenesMenuObject))
        }
    },
]

const componentMenuItems = [
    {
        content: `New Component`, 
        events: {
            click: createComponent
        }
    }
]

const componentSelectMenuItems = [
    {
        content: `Rename`,
        events: {

        }
    },
    {
        content: `Add to selected object`,
        events: {
            click: () => {if (!(selectedComponentObject && selectedScenesMenuObject)) return; selectedScenesMenuObject.addComponent(eval(selectedComponentObject.value)); updateInspector()}
        }
    }
]

const cam = new JJS_Cam(new Vec2(), new Vec2(1280, 720))
cam.addComponent(componentTransform)

function addSceneObject(object) {
    object.addComponent(componentTransform)
    updateSceneList()
}

var selectedScenesMenu
var selectedScenesMenuObject

function addInspectorEntry(element, namespace, toAdd) {
    let inspectorEntry = document.createElement("div")
    let inspectorTitle = document.createElement("span")

    inspectorEntry.className = "inspector-entry"
    inspectorTitle.className = "inspector-title"

    inspectorTitle.innerText = element.title

    inspectorEntry.appendChild(inspectorTitle)

    if (element.type == "text") {
        let inspectorTextbox = document.createElement("input")
        inspectorTextbox.type = "text"
        inspectorTextbox.disabled = element.readonly

        inspectorTextbox.value = namespace[element.value]

        inspectorTextbox.addEventListener("change", () => {
            namespace[element.value] = inspectorTextbox.value
        })

        inspectorEntry.appendChild(inspectorTextbox)
    }
    else if (element.type == "vector") {
        let boxWrapper = document.createElement("span")
        let boxX = document.createElement("input")
        let boxY = document.createElement("input")

        boxWrapper.className = "inspector-vector-wrapper"

        boxX.value = namespace[element.value].x
        boxY.value = namespace[element.value].y

        boxX.type = "text"
        boxY.type = "text"

        boxWrapper.appendChild(boxX)
        boxWrapper.appendChild(boxY)

        boxX.addEventListener("change", () => {
            namespace[element.value].x = parseFloat(boxX.value) || 0
        })

        boxY.addEventListener("change", () => {
            namespace[element.value].y = parseFloat(boxY.value) || 0
        })

        inspectorEntry.appendChild(boxWrapper)
    }
    else if (element.type == "num") {
        let numBox = document.createElement("input")
        numBox.type = "text"

        numBox.value = namespace[element.value]

        numBox.addEventListener("change", () => {
            namespace[element.value] = parseFloat(numBox.value) || 0
        })

        inspectorEntry.appendChild(numBox)
    }
    else if (element.type == "color") {
        let colorInput = document.createElement("input")
        colorInput.type = "color"
        
        colorInput.value = namespace[element.value]

        colorInput.addEventListener("change", () => {
            namespace[element.value] = colorInput.value
        })

        inspectorEntry.appendChild(colorInput)
    }

    toAdd.appendChild(inspectorEntry)
}

function updateInspector() {
    document.getElementById("main-inspector").innerHTML = '<span class="window-title">Inspector</span>'

    for (const element of selectedScenesMenuObject.inspectorElements) {
        addInspectorEntry(element, selectedScenesMenuObject, document.getElementById("main-inspector"))
    }

    for (const component of selectedScenesMenuObject.components) {
        let inspectorComponentWrapper = document.createElement("div")
        inspectorComponentWrapper.className = "inspector-entry"
        
        let inspectorComponentWrapperTitle = document.createElement("span")
        inspectorComponentWrapperTitle.innerText = component.name
        
        inspectorComponentWrapper.appendChild(inspectorComponentWrapperTitle)
        document.getElementById("main-inspector").appendChild(inspectorComponentWrapper)

        if (!component.inspector) continue

        for (const element of component.inspector) {
            addInspectorEntry(element, component.body, inspectorComponentWrapper)
        }
    }
}

function updateSceneList() {
    let main_scenes = document.getElementById("main-scenes-wrapper")
    main_scenes.innerHTML = ''

    let depth = -1

    function a(obj) {
        depth++

        for (const object of obj.children) {
            let sceneEntry = document.createElement("span")
            sceneEntry.innerHTML = ("   ".repeat(depth))
            
            let collapseButton

            if (object.children.length > 0) {
                collapseButton = document.createElement("span")
                collapseButton.className = object.sceneMenuCollapsed ? "bi bi-caret-up-fill" : "bi bi-caret-down-fill"

                collapseButton.innerHTML = " "

                collapseButton.addEventListener("click", () => {
                    object.sceneMenuCollapsed = !object.sceneMenuCollapsed
                    updateSceneList()
                })

                sceneEntry.appendChild(collapseButton)
            }

            let sceneEntryText = document.createElement("span")
            sceneEntryText.innerText = object.name
            sceneEntryText.id = "sceneEntryText"

            sceneEntry.appendChild(sceneEntryText)

            sceneEntry.className = "scene-entry"

            sceneEntry.onJJSContext = () => {
                if (selectedScenesMenu) {
                    selectedScenesMenu.style.backgroundColor = ""
                }

                selectedScenesMenuObject = object
                selectedScenesMenu = sceneEntry

                updateInspector()

                sceneEntry.style.backgroundColor = "rgba(64, 64, 255, 80%)"
            }

            sceneEntry.addEventListener("click", () => {
                if (selectedScenesMenu) {
                    selectedScenesMenu.style.backgroundColor = ""
                }

                selectedScenesMenuObject = object
                selectedScenesMenu = sceneEntry

                updateInspector()

                sceneEntry.style.backgroundColor = "rgba(64, 64, 255, 80%)"
            })

            main_scenes.appendChild(sceneEntry)

            if (!object.sceneMenuCollapsed) {
                a(object)

                depth--
            }
        }
    }

    a(game)

    const sceneEntryMenu = new ContextMenu({
        target: ".scene-entry",
        menuItems: sceneMenuItems
    })

    sceneEntryMenu.init()
}

new ContextMenu({
    target: "#components-wrapper",
    menuItems: componentMenuItems
}).init()

const rawComponents = []
var selectedComponent
var selectedComponentObject

function updateComponents() {
    document.getElementById("components-wrapper").innerHTML = ""

    for (const component of rawComponents) {
        let componentWrapper = document.createElement("div")
        let componentIcon = document.createElement("h1")
        let componentTitle = document.createElement("div")

        componentWrapper.className = "component"

        componentWrapper.appendChild(componentIcon)
        componentWrapper.appendChild(componentTitle)

        componentTitle.innerText = component.name
        componentIcon.className = "bi bi-file-earmark-code"

        componentWrapper.addEventListener("click", () => {
            if (selectedComponent) {
                selectedComponent.style.backgroundColor = ""
            }

            selectedComponent = componentWrapper
            selectedComponentObject = component

            window.editor.getModel().setValue(component.value)

            componentWrapper.style.backgroundColor = "rgba(64, 64, 255, 80%)"            
        })

        componentWrapper.onJJSContext = () => {
            if (selectedComponent) {
                selectedComponent.style.backgroundColor = ""
            }

            window.editor.getModel().setValue(component.value)

            selectedComponent = componentWrapper
            selectedComponentObject = component

            componentWrapper.style.backgroundColor = "rgba(64, 64, 255, 80%)"  
        }

        document.getElementById("components-wrapper").appendChild(componentWrapper)
    }

    new ContextMenu({
        target: ".component",
        menuItems: componentSelectMenuItems
    }).init()
}

function createComponent() {
    rawComponents.push({name: "New Component", value: '({\n\tname: "MyComponent",\n\tbody: {\n\t\tstart() {\n\t\t\t\n\t\t},\n\t\tupdate() {\n\t\t\t\n\t\t}\n\t}\n})'})
    updateComponents()
}

var inCodeMode = false

function toggleCodeMode() {
    inCodeMode = !inCodeMode && selectedComponentObject

    document.getElementById("c").style.display = inCodeMode ? "none" : "unset"
    document.getElementById("codespace").style.display = inCodeMode ? "unset" : "none"
}

updateSceneList()

require.config({ paths: { vs: 'monaco-editor/min/vs' } });
require(['vs/editor/editor.main'], function () {
    document.getElementById("c").style.display = "none"

    window.editor = monaco.editor.create(document.getElementById('codespace'), {
        value: '({\n\tname: "MyComponent",\n\tbody: {\n\t\tstart() {\n\t\t\t\n\t\t},\n\t\tupdate() {\n\t\t\t\n\t\t}\n\t}\n})',
        language: 'javascript',
        theme: 'vs-dark',
        automaticLayout: true
    });

    window.editor.getModel().onDidChangeContent(() => {
        selectedComponentObject.value =  window.editor.getValue()
    })

    document.getElementById('codespace').style.display = "none"
    document.getElementById("c").style.display = "unset"
});