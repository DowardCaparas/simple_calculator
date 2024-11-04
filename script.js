const userInput = document.getElementById("user_input");
const previousValue = document.getElementById("previous_value");
const numbers = document.getElementById("numbers");
const operators = document.getElementById("operators");
const clearBackspaceEqual = document.getElementById("clear_backspace_equal");

const arrayNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const arrayOperators = ["x", "/", "+", "-"];
const arrayActions = ["C", "←", "="];

let firstValue = null;
let currentOperator = "";

// Create number buttons
arrayNumbers.forEach((element) => {
  const number = document.createElement("button");
  number.classList.add("number_button");
  number.innerText = element;

  number.addEventListener("click", () => {
    userInput.textContent += element;
  });

  numbers.appendChild(number);
});

// Create operator buttons
arrayOperators.forEach((element) => {
  const operator = document.createElement("button");
  operator.classList.add("operator_button");
  operator.innerText = element;

  operator.addEventListener("click", () => {
    if (userInput.textContent === "") return; // Prevent adding operator if input is empty
    currentOperator = element;
    firstValue = userInput.textContent;

    userInput.textContent = `${firstValue} ${currentOperator}`;
  });

  operators.appendChild(operator);
});

// Create buttons clear, backspace, and equal
arrayActions.forEach((element) => {
  const action = document.createElement("button");
  action.classList.add("action_button");
  action.innerText = element;

  if (element === "C") {
    action.addEventListener("click", () => {
      userInput.textContent = "";
      previousValue.textContent = "";
    });
  }

  if (element === "←") {
    action.addEventListener("click", () => {
      userInput.textContent = userInput.textContent.slice(0, -1);
    });
  }

  if (element === "=") {
    action.addEventListener("click", () => {
      computation();
    });
  }

  clearBackspaceEqual.appendChild(action);
});

// Create a dot button
const dot = document.createElement("button");
dot.classList.add("dot");
dot.innerText = ".";

dot.addEventListener("click", () => {
  userInput.textContent += ".";
});

numbers.appendChild(dot);

// ===================================================================================

const computation = () => {
  const expression = userInput.textContent;
  let result;

  try {
    userInput.textContent = ""; //Clear first the text before displaying the result
    result = evaluateExpression(expression);
    previousValue.textContent = expression + " = " + result; // Show full expression with result
    userInput.textContent = result;
  } catch (error) {
    userInput.textContent = "Error";
  }

  firstValue = null;
  currentOperator = "";
};

const evaluateExpression = (expr) => {
  expr = expr.replace(/\s+/g, "");
  const tokens = expr.match(/(\d+\.?\d*|[+\-*/x])/g); // 'x' for multiplication

  if (!tokens) throw new Error("Invalid Expression");

  const output = [];
  const operators = [];
  const precedence = { "+": 1, "-": 1, x: 2, "/": 2 };

  tokens.forEach((token) => {
    if (!isNaN(token)) {
      output.push(parseFloat(token));
    } else {
      while (
        operators.length &&
        precedence[operators[operators.length - 1]] >= precedence[token]
      ) {
        output.push(operators.pop());
      }
      operators.push(token);
    }
  });

  while (operators.length) {
    output.push(operators.pop());
  }

  const evalStack = [];

  output.forEach((token) => {
    if (typeof token === "number") {
      evalStack.push(token);
    } else {
      const b = evalStack.pop();
      const a = evalStack.pop();
      switch (token) {
        case "+":
          evalStack.push(a + b);
          break;
        case "-":
          evalStack.push(a - b);
          break;
        case "x":
          evalStack.push(a * b);
          break;
        case "/":
          if (b === 0) throw new Error("Division by zero");
          evalStack.push(a / b);
          break;
      }
    }
  });

  return evalStack.pop();
};
