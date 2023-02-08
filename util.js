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

function stringToVal(str, type) {
    switch (type) {
        case "Vec2":
            return Vec2.fromString(str)
        case "number":
            return parseFloat(str)
        case "string":
            return str
        case "boolean":
            return str == "true"
    }
}

function isColor(strColor) {
    const s = new Option().style
    s.color = strColor
    return s.color !== ''
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function upload() {
    var input = document.createElement('input');
    input.type = 'file'

    input.onchange = e => {
        var file = e.target.files[0]

        var reader = new FileReader()
        reader.readAsText(file,'UTF-8')

        reader.onload = readerEvent => {
            var content = readerEvent.target.result
            deserializeGameState(content)
        }
    }

    input.click();
}