const tableBody = document.querySelector("#tableBody");
const validValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const arrows = [["ArrowUp", "row", "-"], ["ArrowDown", "row", "+"], ["ArrowLeft", "column", "-"], ["ArrowRight", "column", "+"]];

//--Crear inputs con sus random values--
for (let i = 0; i < 9; i++) {

    let tr = document.createElement("tr");
    let thickBorder = "0.3rem solid black"

    for (let j = 0; j < 9; j++) {
        let td = document.createElement("td");
        let inputNumber = document.createElement("input");
        td.className = "input-container";
        inputNumber.type = "text";
        inputNumber.setAttribute("row", i + 1);
        inputNumber.setAttribute("column", j + 1);
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
        td.append(inputNumber);
        tr.append(td);
    }

    tableBody.append(tr);
}

const tds = document.querySelectorAll(".input-container");
const inputs = document.querySelectorAll(".input-container input");
let currentInput = inputs[0];

//---Agregando números aleatorios en celdas---
function setRandomValues() {
    var options = [];

    function detectRepeat(node) {
        let column = node.attributes["column"].value;
        let row = node.attributes["row"].value;
        let rows = document.querySelectorAll(`[row="${row}"]`);
        let columns = document.querySelectorAll(`[column="${column}"]`);

        for (let i = 0; i < rows.length; i++) {
            if (rows[i].value == node.value && rows[i].attributes["column"].value != column) {
                options.splice(options.indexOf(node.value), 1);
                node.value = options[Math.floor(Math.random() * options.length)];
                i = 0;
            }
        }

        for (let i = 0; i < columns.length; i++) {
            if (columns[i].value == node.value && columns[i].attributes["row"].value != row) {
                options.splice(options.indexOf(node.value), 1);
                node.value = options[Math.floor(Math.random() * options.length)];
                i = 0;
            }
        }

        return;
    }

    inputs.forEach(element => {
        options = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
        let valueSelected = options[Math.floor(Math.random() * options.length)];
        element.value = valueSelected;
        detectRepeat(element, options);
    })

    //while (numCells > 0) {
        //let node = document.querySelector(`[row="${rowSelected}"][column="${columnSelected}"]`);
        
        //if (node.value != "") {
            //continue;
        //}

        //node.value = valueSelected;
        //numCells--;
    //}
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