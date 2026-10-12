const display = document.getElementById("display");
let currentInput = "0";

const updateDisplay = () => {
  display.value = currentInput;
};

const sanitizeExpression = (value) => value.replace(/[^0-9+\-*/.]/g, "");

const calculate = () => {
  const expression = sanitizeExpression(currentInput);
  if (!expression) {
    currentInput = "0";
    updateDisplay();
    return;
  }

  try {
    const result = Function(`"use strict"; return (${expression})`)();
    currentInput = Number.isFinite(result) ? String(result) : "Error";
  } catch {
    currentInput = "Error";
  }

  updateDisplay();
};

document.querySelector(".keys").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const value = button.dataset.value;

  if (action === "clear") {
    currentInput = "0";
  } else if (action === "number") {
    if (currentInput === "0" || currentInput === "Error") {
      currentInput = value;
    } else {
      currentInput += value;
    }
  } else if (action === "decimal") {
    const lastNumber = currentInput.split(/[+\-*/]/).pop();
    if (!lastNumber.includes(".")) {
      currentInput += value;
    }
  } else if (action === "operator") {
    if (currentInput === "Error") {
      currentInput = "0";
    }
    if (/[+\-*/]$/.test(currentInput)) {
      currentInput = `${currentInput.slice(0, -1)}${value}`;
    } else {
      currentInput += value;
    }
  } else if (action === "equals") {
    calculate();
    return;
  }

  updateDisplay();
});
