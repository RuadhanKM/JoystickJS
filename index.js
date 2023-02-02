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
    {
        content: `Delete`,
        events: {
            click: () => {selectedScenesMenuObject.parent.children.splice(selectedScenesMenuObject.parent.children.indexOf(selectedScenesMenuObject), 1); selectedScenesMenu = undefined; selectedScenesMenuObject = undefined; updateSceneList(); updateInspector()}
        },
        divider: `top`
    }
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
        content: `Add to selected object`,
        events: {
            click: () => {if (!(selectedComponentObject && selectedScenesMenuObject)) return; selectedScenesMenuObject.addComponent(selectedComponentObject.parsedValue); updateInspector()}
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

    inspectorTitle.innerText = element

    inspectorEntry.appendChild(inspectorTitle)

    if (isColor(namespace[element])) {
        let colorInput = document.createElement("input")
        colorInput.type = "color"
        
        colorInput.value = namespace[element]

        colorInput.addEventListener("change", () => {
            namespace[element] = colorInput.value
        })

        inspectorEntry.appendChild(colorInput)
    }
    else if (typeof namespace[element] == "string") {
        let inspectorTextbox = document.createElement("input")
        inspectorTextbox.type = "text"
        inspectorTextbox.disabled = element.readonly

        inspectorTextbox.value = namespace[element]

        inspectorTextbox.addEventListener("change", () => {
            namespace[element] = inspectorTextbox.value
            updateSceneList()
        })

        inspectorEntry.appendChild(inspectorTextbox)
    }
    else if (namespace[element] instanceof Vec2) {
        let boxWrapper = document.createElement("span")
        let boxX = document.createElement("input")
        let boxY = document.createElement("input")

        boxWrapper.className = "inspector-vector-wrapper"

        boxX.value = namespace[element].x
        boxY.value = namespace[element].y

        boxX.type = "text"
        boxY.type = "text"

        boxWrapper.appendChild(boxX)
        boxWrapper.appendChild(boxY)

        boxX.addEventListener("change", () => {
            namespace[element].x = parseFloat(boxX.value) || 0
        })

        boxY.addEventListener("change", () => {
            namespace[element].y = parseFloat(boxY.value) || 0
        })

        inspectorEntry.appendChild(boxWrapper)
    }
    else if (typeof namespace[element] == "number") {
        let numBox = document.createElement("input")
        numBox.type = "text"

        numBox.value = namespace[element]

        numBox.addEventListener("change", () => {
            namespace[element] = parseFloat(numBox.value) || 0
        })

        inspectorEntry.appendChild(numBox)
    }

    toAdd.appendChild(inspectorEntry)
}

function updateInspector() {
    document.getElementById("inspector-wrapper").innerHTML = ''

    if (!selectedScenesMenuObject) return

    for (const element of selectedScenesMenuObject.inspectorElements) {
        addInspectorEntry(element, selectedScenesMenuObject, document.getElementById("inspector-wrapper"))
    }

    for (const component of selectedScenesMenuObject.components) {
        let inspectorComponentWrapper = document.createElement("div")
        inspectorComponentWrapper.className = "inspector-entry"
        
        let inspectorComponentWrapperTitle = document.createElement("span")
        inspectorComponentWrapperTitle.innerText = component.name
        
        inspectorComponentWrapper.appendChild(inspectorComponentWrapperTitle)
        document.getElementById("inspector-wrapper").appendChild(inspectorComponentWrapper)

        let removeComponent = document.createElement("span")
        removeComponent.className = "bi bi-trash-fill error"
        removeComponent.style.float = "right"

        removeComponent.addEventListener("click", () => {
            selectedScenesMenuObject.removeComponent(component)
            updateInspector()
        })

        inspectorComponentWrapper.appendChild(removeComponent)

        if (!component.inspector) continue

        for (const element of component.inspector) {
            addInspectorEntry(element, component, inspectorComponentWrapper)
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

            if (object == selectedScenesMenuObject) {
                selectedScenesMenu = sceneEntry
                sceneEntry.style.backgroundColor = "rgba(64, 64, 255, 80%)"
            }

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

        componentTitle.innerText = component.parsedValue.name || "Untitled"
        componentIcon.className = "bi bi-file-earmark-code"

        if (component.error) {
            componentWrapper.style.backgroundColor =  "rgba(255, 64, 64, 80%)"  
        }

        if (component == selectedComponentObject) {
            selectedComponent = componentWrapper
            componentWrapper.style.backgroundColor = component.error ? "rgba(255, 128, 255)" : "rgba(64, 64, 255, 80%)"
        }

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
    rawComponents.push({value: '({\n\tname: "MyComponent",\n\tstart() {\n\t\t\t\n\t},\n\tupdate() {\n\t\t\t\n\t}\n})', parsedValue: {name: "MyComponent", start(){}, update(){}}, error: false})
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
        language: 'javascript',
        theme: 'vs-dark',
        automaticLayout: true
    });

    window.editor.getModel().onDidChangeContent(() => {
        selectedComponentObject.value = window.editor.getValue()
        selectedComponentObject.error = false

        try {
            selectedComponentObject.parsedValue = eval(selectedComponentObject.value)
        } catch {
            selectedComponentObject.error = true
        }

        updateComponents()
        updateInspector()
    })

    document.getElementById('codespace').style.display = "none"
    document.getElementById("c").style.display = "unset"
});