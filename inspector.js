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
    else if (typeof namespace[element] == "boolean") {
        let checkBox = document.createElement("input")
        checkBox.type = "checkbox"

        checkBox.value = namespace[element]

        checkBox.addEventListener("change", () => {
            namespace[element] = checkBox.value
        })

        inspectorEntry.appendChild(checkBox)
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