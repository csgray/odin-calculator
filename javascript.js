// Shared elements
const displayText = document.getElementById("display");

// State
let numberA = "";
let numberB = "";
let operand = "";
let newNumber = false;

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
    console.log(operand);

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
    operand = "";
    displayText.textContent = numberA;
}

// Display functions
function checkDisplayOverflow() {
    return displayText.textContent.length >= 12;
}

function display(symbol) {
    displayText.textContent += symbol;
}

function clearDisplay() {
    displayText.textContent = "";
}

// Buttons
function displayDigit() {
    if (checkDisplayOverflow()) return;

    if (newNumber) {
        clearDisplay();
        newNumber = false;
    }

    symbol = this.textContent;
    display(symbol);
    (operand === "") ? numberA += symbol : numberB += symbol;
}

const digits = document.querySelectorAll(".digit");
digits.forEach(function (digit) {
    digit.addEventListener("click", displayDigit);
});

function displayOperand() {
    console.log(this.textContent);
    (numberB === "") ? operand = this.id : operate(operand, numberA, numberB);
    newNumber = true;
}

const operands = document.querySelectorAll(".operand");
operands.forEach(function (operand) {
    operand.addEventListener("click", displayOperand);
});
