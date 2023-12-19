const tableBody = document.querySelector("#tableBody");
const validValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const arrows = [["ArrowUp", "row", "-"], ["ArrowDown", "row", "+"], ["ArrowLeft", "column", "-"], ["ArrowRight", "column", "+"]];

//--Crear inputs--
for (let i = 0; i < 9; i++) {

    let tr = document.createElement("tr");

    for (let j = 0; j < 9; j++) {
        let td = document.createElement("td");
        let inputNumber = document.createElement("input");
        td.className = "input-container";
        inputNumber.type = "text";
        inputNumber.setAttribute("row", i + 1);
        inputNumber.setAttribute("column", j + 1);
        td.append(inputNumber);
        tr.append(td);
    }

    tableBody.append(tr);
}

const tds = document.querySelectorAll(".input-container");
const inputs = document.querySelectorAll(".input-container input");
let currentInput = inputs[0];

//--Quitar y poner foco en x celda--
function controlFocus(node) {
    inputs.forEach(element => {
        element.offsetParent.style.outline = "none";
    })

    node.style.outline = "0.15rem solid blue";
}

//--Animación al seleccionar celda y validación--
inputs.forEach(element => {
    element.addEventListener("focus", e => {
        controlFocus(e.target.offsetParent);
        currentInput = e.target
    })

    element.addEventListener("keypress", e => {
        e.preventDefault();
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