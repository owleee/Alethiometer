import * as Operators from "./operators.js";

const input = document.getElementById("inputField");
const table = document.getElementById("truthTable");

const go = () => {
    let inputValue = input.value;

    // hide table if no input
    if (inputValue == "") {
        table.hidden = true;
        return;
    }
    table.hidden = false;

    // parse for unique variables
    let vars = [...new Set(inputValue.replace(/[^A-Za-z]/g, '').split(''))];
    console.log(vars);

    // clear table
    table.innerHTML = '';

    vars.push("A u B")

    // create header row
    let headerRow = table.insertRow();
    vars.forEach(v => {
        const th = document.createElement("th");
        th.textContent = v;
        headerRow.appendChild(th);
    })

    // create binary rows
    let numRows = Math.pow(2, vars.length);
    for (let i = 0; i < numRows; i++) {
        let row = table.insertRow();
        vars.forEach((v, j) => {
            let cell = row.insertCell();
            let val = (i >> (vars.length - j - 1)) & 1;
            cell.innerText = val;
            cell.className = `cell-${val}`;
        });
    }
}

input.addEventListener("input", go)

go();
