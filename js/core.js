const existsIn = (char, list) => list.findIndex(v => v === char) !== -1;

const operationClean = (s, operator_inverse, operators_list) => {
  s = s.replace(/\s+/g, "");
  let outputStr = "";
  let i = 0;

  while (i < s.length) {
    let skip = 0;
    if (!existsIn(s[i], operators_list)) outputStr += s[i];
    else {
      for (let j = i + 1; s.length; j++) {
        if (s[i] === s[j]) skip++;
        else break;
      }
      if (skip % 2 === 0) outputStr += s[i];
      else {
        let inverse = operator_inverse[s[i]];
        if (!inverse) {
          throw new Error(
            `[InverseNotFoundError] the operator ${s[
              i
            ]} does not have an inverse`
          );
        } else {
          outputStr += inverse;
        }
      }
    }
    i += skip + 1;
  }
  return outputStr;
};

const operationToList = s => {
  s = s.replace(/\s+/g, "");

  const operators = ["+", "-", "/", "*"];
  const numbers = [..."1234567890."];
  Object.freeze(operators);
  Object.freeze(numbers);

  const outputList = [];
  let i = 0;
  let c = "";
  while (i < s.length) {
    c = s[i];
    if (existsIn(c, operators)) {
      outputList.push(c);
      i++;
      continue;
    }

    if (existsIn(c, numbers)) {
      outputList.push(c);
      for (let j = i + 1; j < s.length; j++) {
        if (existsIn(s[j], numbers)) {
          const lastIndex = outputList[outputList.length - 1];
          outputList[lastIndex] += s[j];
          i++;
        } else break;
      }
      i++;
    } else {
      outputList.push(c);
      i++;
    }
  }
  return outputList;
};

const postfix = s => {
  const stack = [];
  const operations = [];
  const operators = { "+": 1, "-": 1, "/": 0, "*": 0 };
  const OPERATORS_INVERSE = { "+": "+", "-": "+" };
  OPENPARENTHESIS = "(";
  CLOSEPARENTHESIS = ")";

  s = operationClean(s, OPERATORS_INVERSE, Object.keys(operators));
  s = operationToList(s);
  operatorsSymbols = Object.keys(operators);
  let val;
  while (stack.length > 0 || s.length > 0) {
    if (s.length > 0) {
      val = s.splice(0, 1)[0];
    } else {
      for (let i = 0; i < stack.length; i++) {
        operations.push(stack.pop());
      }
      continue;
    }

    if (existsIn(val, operatorsSymbols)) {
      if (stack.length > 0) {
        let top = stack.pop();
        if (top !== OPENPARENTHESIS) {
          let topPriority = operators[top];
          let valPriority = operators[val];
          if (topPriority <= valPriority) {
            operations.push(top);
            stack.push(val);
            continue;
          } else {
            stack.push(top);
            stack.push(val);
            continue;
          }
        } else {
          stack.push(top);
          stack.push(val);
          continue;
        }
      } else {
        stack.push(val);
        continue;
      }
    } else if (val === OPENPARENTHESIS) {
      stack.push(val);
      continue;
    } else if (val === CLOSEPARENTHESIS) {
      while (stack.length > 0) {
        let top = stack.pop();
        if (top === OPENPARENTHESIS) break;
        operations.push(top);
      }
      continue;
    } else {
      operations.push(val);
    }
  }
  return operations;
};

class BinaryOperator {
  constructor(name, symbol, fn) {
    this.name = name;
    this.symbol = symbol;
    this.fn = fn;
  }

  apply(left, right) {
    return this.fn(left, right);
  }

  toString() {
    retun`[BinaryOperator] symbol : '${this.symbol}'`;
  }

  equals(other) {
    if (typeof other === "string") {
      return self.symbol === other;
    }
    if (other instanceof BinaryOperator) {
      return self.symbol === other.symbol;
    }

    throw new Error(
      "[CompareError] Comparison can only be perfomed on `string` and `BinaryOperator`"
    );
  }
}

const postfixRead = (s) => {
  const stack = [];
  let ADD = ["add", "+", (x, y) => x + y];
  let SUB = ["sub", "-", (x, y) => x - y];
  let DIV = ["div", "/", (x, y) => x / y];
  let MUL = ["mul", "*", (x, y) => x * y];

  let operators = [ADD, SUB, DIV, MUL];
  operators = operators.map(op => new BinaryOperator(...op));
  operators = operators.reduce((acc, op) => {
    acc[op.symbol] = op;
    return acc;
  }, {});

  const numberPattern = /^[0-9]+$/;
  while (s.length > 0) {
    let val = s.splice(0, 1)[0];
    if (val.match(numberPattern) !== null) {
      stack.push(parseFloat(val));
    } else {
      let operator = operators[val];
      if (!!operator) {
        let right = null;
        let left = null;
        right = stack.pop() ?? 0;
        left = stack.pop() ?? 0;
        stack.push(operator.apply(left, right));
        continue
      }
    }
  }
  return stack.pop();
};


// Tests 
const TEST_EXPRESSION = [
    '1 + 1',
    '(5 * 4 + 3 * 2)',
    '-----1+2-----6'
];
for (let expression of TEST_EXPRESSION) {
  let ret = null;
  let jsEval = null;
  try {
    ret = postfixRead(postfix(expression));
    jsEval = eval(expression);
    console.log('expression : ', expression);
    console.log('ret : ', ret, ' javascript_eval : ', jsEval);
  } catch (SyntaxError) {
    console.log('[EvalFailure] expression : ', expression);
    console.log('[INFO] custom eval : ', ret);
  } 
    
}


var calculator_eval = (expression) => postfixRead(postfix(expression));