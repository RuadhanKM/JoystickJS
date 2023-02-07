function serializeGameState() {
    let out = ""

    let serComps = []
    for (const comp of rawComponents) {
        let tempCompOut = ""

        tempCompOut += btoa(toBinary(comp.value))

        tempCompOut += "@"

        if (comp.parsedValue.inspector) {
            for (const insp of comp.parsedValue.inspector) {
                if (!comp.parsedValue[insp]) continue
                tempCompOut += JJStypeof(comp.parsedValue[insp]) + "#" + btoa(toBinary(insp)) + "#" + btoa(toBinary(comp.parsedValue[insp].toString()))
            }
        }

        serComps.push(tempCompOut)
    }

    out += serComps.join(" ")

    out += "\n"

    let id = 0
    let serObjs = []

    function a(obj) {
        for (const child of obj.children) {
            let tempObjOut = ""

            id++
            child.id = id
 
            tempObjOut += id + "@" + JJStypeof(child) + "@" + child.parent.id + "@"

            for (const insp of child.inspectorElements) {
                tempObjOut += JJStypeof(child[insp]) + "#" + insp + "#" + btoa(toBinary(child[insp]))
            }
            
            tempObjOut += "@"

            for (const comp of child.components.filter(a => !defaultComponents.includes(a))) {
                tempObjOut += btoa(toBinary(comp.name)) + "#"
            }

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
        let rawValue = fromBinary(atob(compStr.split("@")[0]))
        let inspectorElements = compStr.split("@")[1].split("#")

        let value = eval(rawValue)

        value[fromBinary(atob(inspectorElements[1]))] = new JJSFromString(inspectorElements[0])()
    }

    return out
}