// Constants
const DISPLAY_LENGTH = 8; // TI-108 can display eight digits
const OVERFLOW = parseInt("9".repeat(DISPLAY_LENGTH));

// Shared elements
const displayText = document.getElementById("number");
const memoryIndicator = document.getElementById("memory");
const errorIndicator = document.getElementById("error");

// Buttons
const digits = document.querySelectorAll(".digit");
const zeroButton = document.getElementById("zero");
const oneButton = document.getElementById("one");
const twoButton = document.getElementById("two");
const threeButton = document.getElementById("three");
const fourButton = document.getElementById("four");
const fiveButton = document.getElementById("five");
const sixButton = document.getElementById("six");
const sevenButton = document.getElementById("seven");
const eightButton = document.getElementById("eight");
const nineButton = document.getElementById("nine");
const decimalButton = document.getElementById("decimal");

const operands = document.querySelectorAll(".operand");
const addButton = document.getElementById("add");
const subtractButton = document.getElementById("subtract");
const multiplyButton = document.getElementById("multiply");
const divideButton = document.getElementById("divide");

const equalsButton = document.getElementById("equals");
const clearButton = document.getElementById("clear");
const negativeButton = document.getElementById("negative");

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
        isError = true;
        showError();
        displayText.textContent = (OVERFLOW * Math.sign(total)).toString();
        return;
    }

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
function pushDigit(symbol) {
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

    // Don't create leading zeroes unless it's a decimal
    if (displayText.textContent === "0" && symbol !== ".") clearDisplay();
    // Only allow one decimal point
    if (symbol === "." && displayText.textContent.indexOf(".") > -1) return;

    updateDisplay(symbol);
    (operand === "") ? numberA += symbol : numberB += symbol;
}

digits.forEach(function (digit) {
    digit.addEventListener("click", (event) => pushDigit(event.target.textContent))
});

// Operands: +, -, x, /
function pushOperand(symbol) {
    // Disable calculator when powered off or error state exists
    if (!isOn || isError) return;

    // Execute the staged operand if there is already a second number
    if (numberB) operate(operand, numberA, numberB);

    operand = symbol;
    newNumber = true;
    lastButton = symbol;
}

operands.forEach(function (o) {
    o.addEventListener("click", (event) => pushOperand(event.target.id));
});

// =
function pushEquals() {
    // Disable calculator when powered off or error state exists
    if (!isOn || isError) return;

    // Do nothing if a number is missing.
    // Needs to check for empty string as "0" is falsy.
    if (!operand) return;
    else if (numberB === "") operate(lastOperand, numberA, lastNumberB);
    else operate(operand, numberA, numberB);

    newNumber = true;
    lastButton = "equals";
}

equalsButton.addEventListener("click", pushEquals);

// ON/C
function powerOn() {
    isOn = true;
    updateDisplay("0");
}

function clearCurrentNumber() {
    clearDisplay();
    updateDisplay("0");
    (operand === "") ? numberA = 0 : numberB = "";
}

function clearState() {
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
    lastButton = "clear";
}

clearButton.addEventListener("click", pushClear);

// +/-
function pushNegativeButton() {
    if (operand === "") {
        numberA *= -1;
        displayText.textContent = numberA;
    } else {
        numberB *= -1;
        displayText.textContent = numberB;
    }
}

negativeButton.addEventListener("click", pushNegativeButton);

// Keyboard input
document.addEventListener("keydown", (event) => {
    const keyName = event.key;
    switch (keyName) {
        // Digits
        case "0":
            zeroButton.classList.add("active");
            pushDigit("0");
            break;
        case "1":
            oneButton.classList.add("active");
            pushDigit("1");
            break;
        case "2":
            twoButton.classList.add("active");
            pushDigit("2");
            break;
        case "3":
            threeButton.classList.add("active");
            pushDigit("3");
            break;
        case "4":
            fourButton.classList.add("active");
            pushDigit("4");
            break;
        case "5":
            fiveButton.classList.add("active");
            pushDigit("5");
            break;
        case "6":
            sixButton.classList.add("active");
            pushDigit("6");
            break;
        case "7":
            sevenButton.classList.add("active");
            pushDigit("7");
            break;
        case "8":
            eightButton.classList.add("active");
            pushDigit("8");
            break;
        case "9":
            nineButton.classList.add("active");
            pushDigit("9");
            break;
        case ".":
            decimalButton.classList.add("active");
            pushDigit(".");
            break;
        // Operands
        case "+":
            addButton.classList.add("active");
            pushOperand("add");
            break;
        case "-":
            subtractButton.classList.add("active");
            pushOperand("subtract");
            break;
        case "*":
            multiplyButton.classList.add("active");
            pushOperand("multiply");
            break;
        case "/":
            divideButton.classList.add("active");
            pushOperand("divide");
            break;
        case "=":
        case "Enter":
            equalsButton.classList.add("active");
            pushEquals();
            break;
        case "Backspace":
        case "Delete":
            clearButton.classList.add("active");
            pushClear();
            break;
    }
})

buttons = document.querySelectorAll(".button");
document.addEventListener("keyup", (event) => {
    buttons.forEach((b) => b.classList.remove("active"));
})
