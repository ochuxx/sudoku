const tableBody = document.querySelector("#tableBody");
const validValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const arrows = [["ArrowUp", "row", "-"], ["ArrowDown", "row", "+"], ["ArrowLeft", "column", "-"], ["ArrowRight", "column", "+"]];
let incrementId = 0;

//--Crear inputs con sus random values--
for (let i = 0; i < 9; i++) {
    let boxId;

    if (i >= 0 && i <= 2) {
        boxId = 1;
    }
    if (i >= 3 && i <= 5) {
        boxId = 4;
    }
    if (i >= 6 && i <= 8) {
        boxId = 7;
    }

    let tr = document.createElement("tr");
    let thickBorder = "0.3rem solid black";

    for (let j = 0; j < 9; j++) {
        incrementId++;
        let td = document.createElement("td");
        let inputNumber = document.createElement("input");
        td.className = "input-container";
        inputNumber.type = "text";
        inputNumber.id = `cell${incrementId}`;
        inputNumber.setAttribute("row", i + 1);
        inputNumber.setAttribute("column", j + 1);
        inputNumber.setAttribute("box", boxId);
        inputNumber.readOnly = true;
        //Agregando bordes gruesos para visualización
        if (j == 0 || j == 3 || j == 6) {
            td.style.borderLeft = thickBorder;
        }
        if (i == 0 || i == 3 || i == 6) {
            td.style.borderTop = thickBorder;
        }
        if (j == 8) {
            td.style.borderRight = thickBorder;
        }
        if (i == 8) {
            td.style.borderBottom = thickBorder;
        }
        //Ajustando id de caja
        if (j == 2 || j == 5) {
            boxId ++;
        }
        td.append(inputNumber);
        tr.append(td);
    }

    tableBody.append(tr);
}

const tds = document.querySelectorAll(".input-container");
const inputs = document.querySelectorAll(".input-container input");
let currentInput = inputs[0];

//Quitar valores de algunas celdas para resolverlos
function deleteSomeValues() {
    var numValues = 81 - 25;
    for (let i = 0; i < numValues; i++) {
        let input = inputs[Math.floor(Math.random() * inputs.length)];
        if (input.value != "") {
            input.value = "";
            input.readOnly = false;
            continue;
        }
        i--;
    }
}

//---Agregar números aleatorios en celdas---
function setRandomValues() {
    var options = [];
    var doSudokuAgain = false;

    //Borrar valores de input antes de hacer cambios
    inputs.forEach(element => {
        element.value = "";
    })

    //Comparar demás valores con el input actual para evitar repetir el valor
    function comparateValues(nodes, mainNode) {
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].value == mainNode.value && nodes[i].id != mainNode.id) {
                options.splice(options.indexOf(mainNode.value), 1);
                mainNode.value = options[Math.floor(Math.random() * options.length)];
                return false;
            }
        }
        return true;
    }

    function detectRepeat(node) {
        let column = node.attributes["column"].value;
        let row = node.attributes["row"].value;
        let box = node.attributes["box"].value;
        let rows = document.querySelectorAll(`[row="${row}"]`);
        let columns = document.querySelectorAll(`[column="${column}"]`);
        let boxes = document.querySelectorAll(`[box="${box}"]`);

        //Comparar si el número puesto aleatoriamente ya existe en la fila, columna o casilla
        let approveRow = comparateValues(rows, node);
        if (!approveRow) {
            return false;
        }
        let approveColumn = comparateValues(columns, node);
        if (!approveColumn) {
            return false;
        }
        let approveBox = comparateValues(boxes, node);
        if (!approveBox) {
            return false;
        }

        return true;
    }

    inputs.forEach(element => {
        options = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
        let canpass = false;
        let valueSelected = options[Math.floor(Math.random() * options.length)];
        element.value = valueSelected;
        for (let i = 0; i < 9; i++) {
            canpass = detectRepeat(element);
            if (canpass) {
                break;
            }
        }

        if (options == false) {
            doSudokuAgain = true;
        }
    })

    if (doSudokuAgain) {
        return setRandomValues();
    }

    return deleteSomeValues();
}

//--Quitar y poner foco en x celda--
function controlFocus(node) {
    inputs.forEach(element => {
        element.offsetParent.style.outline = "none";
    })

    node.style.outline = "0.22rem solid blue";
}

//--Animación al seleccionar celda y validación--
inputs.forEach(element => {
    element.addEventListener("focus", e => {
        controlFocus(e.target.offsetParent);
        currentInput = e.target;
    })

    element.addEventListener("keypress", e => {
        e.preventDefault();
        if (e.target.readOnly) {
            return;
        }

        validValues.forEach(number => {
            if (e.key == number) {
                element.value = number;
                return;
            }
        })
    })
})

window.addEventListener("keydown", e => {
    //---Moverse con las flechas del teclado--
    arrows.forEach(values => {
        if (values[0] == e.key) {
            e.preventDefault();
            let newAttributeValue;
            let selected;
            let node;
            let currentAttributeValue = Number(currentInput.attributes[values[1]].value);

            if (values[2] == "+") {
                newAttributeValue = currentAttributeValue + 1;
            } else {
                newAttributeValue = currentAttributeValue - 1;
            }

            if (newAttributeValue > 9 || newAttributeValue < 1) {
                return;
            }

            if (values[1] == "row") {
                selected = `[row="${newAttributeValue}"][column="${currentInput.attributes["column"].value}"]`;
            } else {
                selected = `[row="${currentInput.attributes["row"].value}"][column="${newAttributeValue}"]`;
            }

            node = document.querySelector(selected);
            node.focus();
        }
    })
})

inputs[0].focus();
setRandomValues();