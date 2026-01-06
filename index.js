import * as Operators from "./operators.js";

const tell = console.log;

const input = document.getElementById("inputField");
const table = document.getElementById("truthTable");

const tokenize = (expr) => {
    let tokens = expr.split(' ')
    return tokens
}

const getBinary = (n, length) => {
    let bin = n.toString(2);
    if (length) {
        while (bin.length < length) {
            bin = "0" + bin;
        }
    }
    return bin;
}

const go = () => {
    let inputValue = input.value;

    // hide table if no input
    if (inputValue == "") {
        table.hidden = true;
        return;
    }
    table.hidden = false;

    let tokens = tokenize(inputValue);

    // parse for unique variables
    let variables = [...new Set(tokens.filter(t => /^[A-Za-z]+$/.test(t)))].map(v => ({
        name: v,
        value: new Operators.Variable(v)
    }));

    console.log(variables)

    // clear table
    table.innerHTML = '';

    // create header row
    let headerRow = table.insertRow();
    variables.forEach(v => {
        const th = document.createElement("th");
        th.textContent = v.name;
        headerRow.appendChild(th);
    })

    // create binary rows
    let numRows = Math.pow(2, variables.length);
    for (let i = 0; i < numRows; i++) {
        let row = table.insertRow();
        variables.forEach((v, j) => {
            let cell = row.insertCell();
            let binary = getBinary(i, variables.length)[j];
            cell.innerText = binary;
            cell.className = `cell-${binary}`;
        });
    }

    parseExpression(inputValue);
}

const parseExpression = (expr) => {
    let tokens = tokenize(expr);

    let operator;

    tokens.forEach((t, i, a) => {
        switch (t) {
            case "+":
                operator = new Operators.Or(
                    a[i - 1],
                    a[i + 1]
                )

            default:
                break;
        }
    })

    console.log(operator)
}

input.addEventListener("input", go)

go();
