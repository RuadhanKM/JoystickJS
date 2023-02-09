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
        content: `New Rect`,
        events: {
            click: () => addSceneObject(new JJS_Rect(selectedScenesMenuObject))
        }
    },
    {
        content: `New Cam`,
        events: {
            click: () => addSceneObject(new JJS_Cam(selectedScenesMenuObject))
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

function addSceneObject(object) {
    if (object instanceof JJS_Cam) {
        object.addComponent(componentTransform)
        object.addComponent(componentCamera)
    }
    else if (object instanceof JJS_Group) {
        object.addComponent(componentTransform)
    }
    else if (object instanceof JJS_Rect) {
        object.addComponent(componentTransform)
        object.addComponent(componentRenderer)

        object.Transform.Size = new Vec2(20, 20)
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