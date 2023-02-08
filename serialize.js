function serializeGameState() {
    let out = ""

    out += rawComponents.map(x => btoa(toBinary(x.value))).join(" ")

    out += "\n"

    let id = 0
    let serObjs = []

    function a(obj) {
        for (const child of obj.children) {
            let tempObjOut = ""

            id++
            child.id = id
 
            tempObjOut += id + "@" + JJStypeof(child) + "@" + btoa(toBinary(child.Name)) + "@" + (child == selectedScenesMenuObject) + "@" + child.sceneMenuCollapsed + "@" + child.parent.id + "@"

            let tempComps = []
            for (const comp of child.components) {
                let tempCompsOut = ""

                tempCompsOut += btoa(toBinary(comp.JJS_Name)) + "<"

                tempCompsOut += (comp?.inspector || []).map(insp => btoa(toBinary(insp)) + "#" + btoa(toBinary(comp[insp].toString()))).join(".")

                tempComps.push(tempCompsOut)
            }
            tempObjOut += tempComps.join(">")

            serObjs.push(tempObjOut)

            a(child)
        }
    }
    
    game.id = 0
    a(game)

    out += serObjs.join(" ")

    return out
}

function deserializeGameState(gameState) {
    let out = new JJS_Object({children: []})
    out.id = 0
    let outRawComps = {}

    let split0 = gameState.split("\n")
    let compSplit = split0[0].split(" ")
    let objSplit = split0[1].split(" ")

    for (const compStr of compSplit) {
        let value = fromBinary(atob(compStr))
        let parsedValue = eval(`(${value})`)

        outRawComps[parsedValue.name] = {value: value, parsedValue: parsedValue, error: false}
    }

    let idObjects = {0: out}

    for (const obj of objSplit) {
        let objData1 = obj.split("@")

        let id = objData1[0]
        let objType = objData1[1]
        let name = fromBinary(atob(objData1[2]))
        let sceneSelected = objData1[3] == "true"
        let sceneMenuCollapsed = objData1[4]
        let parentId = objData1[5]
        let comps = objData1[6].split(">")

        let objInst = new (JJSFromString(objType))({children: []})
        objInst.Name = name
        objInst.sceneMenuCollapsed = sceneMenuCollapsed == "true"
        objInst.id = id
        objInst.parent = idObjects[parentId]
        objInst.parent.children.push(objInst)

        if (sceneSelected) selectedScenesMenuObject = objInst

        idObjects[id] = objInst

        for (const comp of comps) {
            let compData1 = comp.split("<")

            if (!compData1[0]) continue 

            let compClass = outRawComps[fromBinary(atob(compData1[0]))].parsedValue

            objInst.addComponent(compClass)

            if (!compData1[1]) continue

            let insps = compData1[1].split(".")

            for (const insp of insps) {
                let inspData1 = insp.split("#")
                let inspName = fromBinary(atob(inspData1[0]))

                objInst[compClass.name][inspName] = stringToVal(fromBinary(atob(inspData1[1])), JJStypeof(objInst[compClass.name][inspName]))
            }
        }
    }

    game = out
    workspace = game.children[0]
    rawComponents = Object.values(outRawComps)

    updateComponents()
    updateInspector()
    updateSceneList()
}