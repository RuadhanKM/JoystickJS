function toBinary(string) {
    const codeUnits = Uint16Array.from({ length: string.length }, (element, index) => 
        string.charCodeAt(index)
    );
    const charCodes = new Uint8Array(codeUnits.buffer);

    let result = "";
    charCodes.forEach((char) => {
        result += String.fromCharCode(char);
    });
    return result;
}

function fromBinary(binary) {
    const bytes = Uint8Array.from({ length: binary.length }, (element, index) =>
        binary.charCodeAt(index)
    );
    const charCodes = new Uint16Array(bytes.buffer);

    let result = "";
    charCodes.forEach((char) => {
        result += String.fromCharCode(char);
    });
    return result;
}

function JJStypeof(obj) {
    if (obj instanceof Vec2) {
        return "Vec2"
    }
    if (obj instanceof JJS_Cam) {
        return "Cam"
    }
    if (obj instanceof JJS_Folder) {
        return "Folder"
    }
    if (obj instanceof JJS_Group) {
        return "Group"
    }
    if (obj instanceof JJS_Rect) {
        return "Rect"
    }
    if (obj instanceof JJS_Object) {
        return "Object"
    }
    return typeof obj
}

function JJSFromString(string) {
    switch (string) {
        case "Vec2":
            return Vec2
        case "Cam":
            return JJS_Cam
        case "Rect":
            return JJS_Rect
        case "Object":
            return JJS_Object
        case "Group":
            return JJS_Group
        case "Folder":
            return JJS_Folder
        case "string":
            return String
        case "number":
            return Number
        case "boolean":
            return Boolean
    }
}