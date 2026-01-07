import * as Operators from "./operators.js";

const tell = console.log;

const input = document.getElementById("inputField");
const table = document.getElementById("truthTable");

var settings = {
    // show subexpressions/steps in the table
    displaySubexpressions: false,
    // use verbose operator names (AND, OR, NOT)
    verboseOperators: false,
    // allow implicit AND (AB = A * B)
    implicitAND: false,
}

function tokenize(expr) {
    let tokens = expr.split('').filter(t => t != ' ');
    return tokens
}

function getBinary(n, length) {
    let bin = n.toString(2);
    if (length) {
        while (bin.length < length) {
            bin = "0" + bin;
        }
    }
    return bin;
}

const reservedTokens = []

function validateVariableName(name) {
    return /^[A-Za-z]+$/.test(name) && !reservedTokens.includes(name);
}

var variables = [];

function setVariableValue(name, value) {
    let variable = variables.find(v => v.name === name);
    if (variable) {
        variable.valueObject.value = value;
    }
}

function go() {
    let inputValue = input.value;

    // hide table if no input
    if (inputValue == "") {
        table.hidden = true;
        return;
    }
    table.hidden = false;

    let tokens = tokenize(inputValue);

    // parse for unique variables
    variables = [...new Set(
        tokens.filter(validateVariableName)
    )].map(v => ({
        name: v,
        valueObject: new Operators.Variable(v)
    }));

    let headers = variables.map(v => (v.name));
    headers.push(inputValue)

    // clear table
    table.innerHTML = '';

    // create header row
    let headerRow = table.insertRow();
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
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
    let expression = parseExpression(tokens)

    // evaluate expression for each row
    for (
        let i = 0;
        i < Math.pow(2, variables.length);
        i++
    ) {
        let binary = getBinary(i, variables.length);
        variables.forEach((v, j) => {
            let value = (binary[j] === "1");
            setVariableValue(v.name, value);
        });
        let cell = table.rows[i + 1].insertCell();
        cell.innerText = (expression.getValue() ? "1" : "0");
        cell.className = `cell-${cell.innerText}`;
    }
}

const operatorTokens = {
    or: [
        "|",
    ],
    and: [
        "&",
    ],
    not: [
        "!",
    ]
}

function getTokenOperator(token) {
    for (const [operatorName, tokens] of Object.entries(operatorTokens)) {
        if (tokens.includes(token)) {
            return operatorName;
        }
    }
    return null;
}

function convertExpressionToTree(tokens) {
    const stack = [];
    let current = [];

    tokens.forEach(token => {
        if (token === '(') {
            stack.push(current);
            current = [];
        } else if (token === ')') {
            const last = stack.pop();
            last.push(current);
            current = last;
        } else {
            current.push(token);
        }
    });

    return current.length === 1 ? current[0] : current;
}

function parseExpression(tokens) {
    const tree = convertExpressionToTree(tokens);

    let operator;

    tree.forEach((token, i) => {

        let previousToken = tree[i - 1];
        let previousVar;

        if (variables.some(v => v.name === previousToken)) {
            // token is variable
            previousVar = variables.find(v => v.name === previousToken).valueObject;
        } else if (Array.isArray(previousToken)) {
            // token is subexpression
            previousVar = parseExpression(previousToken);
        }

        let nextToken = tree[i + 1];
        let nextVar;

        if (variables.some(v => v.name === nextToken)) {
            // token is variable
            nextVar = variables.find(v => v.name === nextToken).valueObject;
        } else if (Array.isArray(nextToken)) {
            // token is subexpression
            nextVar = parseExpression(nextToken);
        }

        switch (getTokenOperator(token)) {
            case "or":
                operator = new Operators.Or(previousVar, nextVar);
                break;
            case "and":
                operator = new Operators.And(previousVar, nextVar);
                break;
            case "not":
                operator = new Operators.Not(nextVar);
                break;
            default:
                break;
        }
    })

    return operator;
}

input.addEventListener("input", go)

go();