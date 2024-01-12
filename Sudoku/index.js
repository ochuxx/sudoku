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
    let thickBorder = "calc(var(--cells-size) * (8 / 100)) solid black";

    for (let j = 0; j < 9; j++) {
        incrementId++;
        let td = document.createElement("td");
        let inputNumber = document.createElement("input");
        td.className = "input-container";
        inputNumber.type = "text";
        inputNumber.id = `cell${incrementId}`;
        inputNumber.setAttribute("is-valid-num", "none");
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
                let numSelected = options[Math.floor(Math.random() * options.length)];
                mainNode.value = numSelected;
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

    inputs.forEach(element => {
        element.setAttribute("correct-number", element.value);
    });

    return deleteSomeValues();
}

//--Quitar y poner foco en x celda--
function controlFocus(parentNode, oldInput, newInput) {
    let focusCellColor = "#CACFD2";
    inputs.forEach(element => {
        element.offsetParent.style.outline = "none";
        element.style.backgroundColor = "white";
    })

    //Cambiar color de filas, columnas y casilla según la celda donde se encuentre
    //---Colocar colores en nuevo focus
    let rows = document.querySelectorAll(`[row='${newInput.getAttribute("row")}']`);
    let columns = document.querySelectorAll(`[column='${newInput.getAttribute("column")}']`);
    let boxes = document.querySelectorAll(`[box='${newInput.getAttribute("box")}']`);
    focusColor(rows, "rgb(214, 234, 248 )");
    focusColor(columns, "rgb(214, 234, 248 )");
    focusColor(boxes, "rgb(214, 234, 248 )");

    //Colocar indicador del focus
    parentNode.style.outline = "0.22rem solid blue";
    newInput.style.backgroundColor = focusCellColor;

    //Indicar los valores iguales en el sudoku con un background
    setTimeout(() => {
        if (newInput.value != "") {
            inputs.forEach(element => {
                if (element.value == newInput.value) {
                    element.style.backgroundColor = focusCellColor;
                }
            });
        }
    }, 5);
}

//--Colorear según el focus--
function focusColor(nodes, color) {
    nodes.forEach(element => {
        element.style.backgroundColor = color;
    })
}

//--Animación al seleccionar celda y validación--
inputs.forEach(element => {
    element.addEventListener("focus", e => {
        controlFocus(e.target.offsetParent, currentInput, e.target);
        currentInput = e.target;
    })

    element.addEventListener("keydown", e => {
        e.preventDefault();
        if (e.target.readOnly) {
            return;
        }

        if (e.key == "Backspace") {
            element.value = "";
            element.setAttribute("is-valid-num", "none");
            return;
        }

        validValues.forEach(number => {
            if (e.key == number) {
                element.value = number;

                //Verificar si el valor puesto es el correcto, según como sea cambia el estilo
                if (String(number) == element.getAttribute("correct-number")) {
                    element.setAttribute("is-valid-num", "true");
                    return;
                }

                element.setAttribute("is-valid-num", "false");
                return;
            }
        });
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