// Shared elements
const displayText = document.getElementById("display");

// Shared variables
let numberA = "";
let numberB = "";
let operand = "";

// Basic arithmetic functions
function add(a, b) { return a + b };
function subtract(a, b) { return a - b };
function multiply(a, b) { return a * b };
function divide(a, b) { return a / b };

function operate(operand, a, b) {
    let total = 0;
    a = parseInt(a);
    b = parseInt(b);

    console.log(`A: ${a}`);
    console.log(`B: ${b}`);
    switch (operand) {
        case "add":
            total = add(a, b);
            break;
        case "subtract":
            total = subtract(a, b);
            break;
        case "multiply":
            total = multiply(a, b);
            break;
        case "divide":
            total = divide(a, b);
            break;
        default:
            throw SyntaxError(`Invalid operand: ${operand}`);
    }

    console.log(total);
    numberA = total;
    numberB = "";
    if (operand)
        displayText.textContent = numberA;
}

function checkDisplayOverflow() {
    return displayText.textContent.length >= 12;
}

function display(symbol) {
    displayText.textContent += symbol;
}

function displayDigit() {
    if (checkDisplayOverflow()) return;

    symbol = this.textContent;
    display(symbol);
    (operand === "") ? numberA += symbol : numberB += symbol;
}

const digits = document.querySelectorAll(".digit");
digits.forEach(function (digit) {
    digit.addEventListener("click", displayDigit);
});

function displayOperand() {
    if (checkDisplayOverflow()) return;

    symbol = this.textContent;
    console.log(symbol);
    display(this.textContent);
    (operand === "") ? operand = this.id : operate(operand, numberA, numberB);
}

const operands = document.querySelectorAll(".operand");
operands.forEach(function (operand) {
    operand.addEventListener("click", displayOperand);
});
