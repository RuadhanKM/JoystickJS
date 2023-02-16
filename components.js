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
            click: () => {if (!(selectedComponentObject && selectedScenesMenuObject)) return; selectedScenesMenuObject.addComponent(selectedComponentObject); updateInspector()}
        }
    },
    {
        content: `Delete`,
        events: {
            click: () => {
                while (selectedComponentObject.objects.length > 0) {
                    selectedComponentObject.objects[0].removeComponent(selectedComponentObject)
                }

                rawComponents.splice(rawComponents.indexOf(selectedComponentObject), 1)

                updateComponents()
                updateInspector()
            }
        }
    }
]

new ContextMenu({
    target: "#components-wrapper",
    menuItems: componentMenuItems
}).init()

var rawComponents = []
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

            selectedComponent = componentWrapper
            selectedComponentObject = component
            
            window.editor.getModel().setValue(component.value)

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
    rawComponents.push({value: 'class MyComponent {\n\tconstructor() {\n\t\t\n\t}\n\tstart() {\n\t\t\n\t}\n\tupdate() {\n\t\t\n\t}\n}', parsedValue: class MyComponent {constructor(){}start(){}update(){}}, error: false, objects: []})
    updateComponents()
}

var inCodeMode = false

function toggleCodeMode() {
    inCodeMode = !inCodeMode && selectedComponentObject && !playing

    document.getElementById("c").style.display = inCodeMode ? "none" : "unset"
    document.getElementById("codespace").style.display = inCodeMode ? "unset" : "none"
}

require.config({ paths: { vs: 'monaco-editor/min/vs' } });
require(['vs/editor/editor.main'], function () {
    document.getElementById("c").style.display = "none"

    window.editor = monaco.editor.create(document.getElementById('codespace'), {
        language: 'javascript',
        theme: 'vs-dark',
        automaticLayout: true
    });

    window.editor.getModel().onDidChangeContent(() => {
        if (!selectedComponentObject) return

        selectedComponentObject.value = window.editor.getValue()
        selectedComponentObject.error = false

        try {
            selectedComponentObject.parsedValue = eval("(" + selectedComponentObject.value + ")")
            new (selectedComponentObject.parsedValue)()

            for (const obj of selectedComponentObject.objects) {
                let a = new (selectedComponentObject.parsedValue)()

                a.JJS_Name = selectedComponentObject.parsedValue.name
                a.object = obj

                for (const insp of a.inspector) {
                    if (obj[selectedComponentObject.parsedValue.name][insp] != undefined && JJStypeof(obj[selectedComponentObject.parsedValue.name][insp]) == JJStypeof(a[insp])) {
                        a[insp] = obj[selectedComponentObject.parsedValue.name][insp]
                    }
                }

                obj[selectedComponentObject.parsedValue.name] = a
            }
        } catch {
            selectedComponentObject.error = true
        }

        updateComponents()
        updateInspector()
    })

    document.getElementById('codespace').style.display = "none"
    document.getElementById("c").style.display = "unset"
});