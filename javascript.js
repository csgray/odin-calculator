// Constants
const DISPLAY_LENGTH = 8; // TI-108 can display eight digits
const OVERFLOW = parseInt("9".repeat(DISPLAY_LENGTH));

// Shared elements
const displayText = document.getElementById("number");
const memoryIndicator = document.getElementById("memory");
const errorIndicator = document.getElementById("error");

// State
let isOn = false;
let numberA = 0;
let numberB = "";
let operand = "";
let memory = 0;
let newNumber = false;
let isError = false;
// Previous operation for equals button function
let lastNumberB = "";
let lastOperand = "";
// Tracking multiple button pushes for clear and memory
let lastButton = "";

// Basic arithmetic functions
function add(a, b) { return a + b };
function subtract(a, b) { return a - b };
function multiply(a, b) { return a * b };
function divide(a, b) { return a / b };

function operate(operand, a, b) {
    // Disable calculator when error state exists.
    // Do not operate if called without an operand, which happens when the
    // equals button is pushed without numberB and without lastOperand.
    if (isError || !operand) return;

    let total = 0;
    a = parseFloat(a);
    b = parseFloat(b);

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

    if (Math.abs(total) > OVERFLOW) {
        console.log(`Overflow: ${total}`)
        isError = true;
        showError();
        displayText.textContent = (OVERFLOW * Math.sign(total)).toString();
        return;
    }

    console.log(`Before rounding: ${total}`);
    numberA = roundFractional(total);
    lastNumberB = b;
    numberB = "";
    lastOperand = operand;
    operand = "";
    displayText.textContent = numberA;
}

// Display functions
function checkDisplayOverflow() {
    return displayText.textContent.length >= DISPLAY_LENGTH;
}

function updateDisplay(symbol) {
    displayText.textContent += symbol;
}

function clearDisplay() {
    displayText.textContent = "";
}

function showError() {
    errorIndicator.textContent = "E";
}

function clearError() {
    errorIndicator.textContent = "";
}

function roundFractional(num) {
    // Make room for the leading zero with small numbers
    if (Math.abs(num) < 1) {
        // parseFloat removes trailing zeroes
        return parseFloat(num.toPrecision(DISPLAY_LENGTH - 1));
    } else {
        return parseFloat(num.toPrecision(DISPLAY_LENGTH));
    }
}

// Digits
function pushDigit() {
    // Disable calculator when powered off or error state exists
    if (!isOn || isError) return;

    // Create a new number when numberA is already populated
    if (newNumber) {
        clearDisplay();
        updateDisplay("0");
        newNumber = false;
    }

    // Do not add additional digits when display is full
    if (checkDisplayOverflow()) return;

    symbol = this.textContent;

    // Don't create leading zeroes unless it's a decimal
    if (displayText.textContent === "0" && symbol !== ".") clearDisplay();
    // Only allow one decimal point
    if (symbol === "." && displayText.textContent.indexOf(".") > -1) return;

    updateDisplay(symbol);
    (operand === "") ? numberA += symbol : numberB += symbol;
}

const digits = document.querySelectorAll(".digit");
digits.forEach(function (digit) {
    digit.addEventListener("click", pushDigit);
});

// Operands: +, -, x, /
function pushOperand() {
    // Disable calculator when powered off or error state exists
    if (!isOn || isError) return;

    console.log(this.textContent);

    // Execute the staged operand if there is already a second number
    if (numberB) operate(operand, numberA, numberB);

    operand = this.id;
    newNumber = true;
    lastButton = this.id;
}

const operands = document.querySelectorAll(".operand");
operands.forEach(function (operand) {
    operand.addEventListener("click", pushOperand);
});

// =
function pushEquals() {
    // Disable calculator when powered off or error state exists
    if (!isOn || isError) return;

    console.log(this.textContent);
    // Do nothing if a number is missing.
    // Needs to check for empty string as "0" is falsy.
    if (!operand) return;
    else if (numberB === "") operate(lastOperand, numberA, lastNumberB);
    else operate(operand, numberA, numberB);

    newNumber = true;
    lastButton = this.id;
}

const equals = document.getElementById("equals");
equals.addEventListener("click", pushEquals);

// ON/C
function powerOn() {
    console.log("POWER ON")
    isOn = true;
    updateDisplay("0");
}

function clearCurrentNumber() {
    console.log("CLEAR CURRENT")
    clearDisplay();
    updateDisplay("0");
    (operand === "") ? numberA = 0 : numberB = "";
}

function clearState() {
    console.log("CLEAR STATE")

    numberA = 0;
    numberB = "";
    operand = "";
    memory = 0;
    newNumber = false;
    isError = false;
    lastNumberB = "";
    lastOperand = "";

    clearError();
    clearDisplay();
    updateDisplay("0");
}

function pushClear() {
    if (!isOn) powerOn();
    else if (lastButton === "clear") clearState();
    else clearCurrentNumber();
    lastButton = this.id;
}

const clearButton = document.getElementById("clear");
clearButton.addEventListener("click", pushClear);
