const sceneMenuItems = [
    {
        content: `New Folder`,
        events: {
            click: () => addSceneObject(new JJS_Object(selectedScenesMenuObject), "folder")
        }
    },
    {
        content: `New Rect`,
        events: {
            click: () => addSceneObject(new JJS_Object(selectedScenesMenuObject), "rect")
        }
    },
    {
        content: `New Cam`,
        events: {
            click: () => addSceneObject(new JJS_Object(selectedScenesMenuObject), "cam")
        }
    },
    {
        content: `Delete`,
        events: {
            click: () => {selectedScenesMenuObject.destroy(); selectedScenesMenuObject = undefined; updateSceneList(); updateInspector()}
        },
        divider: `top`
    }
]

function addSceneObject(object, type) {
    if (type == "cam") {
        object.addComponent(componentTransform)
        object.addComponent(componentCamera)
        object.Name = "New Cam"
        if (cam?.Transform?.Size) cam.Transform.Size = new Vec2(1280, 720)
    }
    else if (type == "rect") {
        object.addComponent(componentTransform)
        object.addComponent(componentRenderer)

        if (object?.Transform?.Size) object.Transform.Size = new Vec2(20, 20)
        object.Name = "New Rect"
    }
    else if (type == "folder") {
        object.Name = "New Folder"
    }
    
    updateSceneList()
}

var selectedScenesMenu
var selectedScenesMenuObject

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
            sceneEntryText.innerText = object.Name
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