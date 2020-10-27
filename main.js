'use strict';

/* operator functions */
function add(a, b) {
  return a + b;
}

function sub(a, b) {
  return a - b;
}

function mul(a, b) {
  return a * b;
}

function div(a, b) {
  return a / b;
}

function operate(op, a, b) {
  switch(op){
    case 'add':
      return add(a,b);
    case 'subtract':
      return sub(a,b);
    case 'multiply':
      return mul(a,b);
    case 'divide':
      return div(a,b);
    default:
      console.log(`operator ${op} not recognized`);
  }
  return 0;
}

/* calculator display functions */
const appendToDisplay = (char, display)=> {
  display.textContent += char;
  formatDisplay(display.textContent, display);
}
const clearDisplay = (display) => {
  display.textContent = '0';
  formatDisplay(display.textContent, display);
}
const setDisplay = (value, display) => {
  display.textContent = value;
  formatDisplay(display.textContent, display);
}
const formatDisplay = (displayText, display) => {
  if (displayText.length > 13) 
  {
    display.classList.add("small-display");
  }
  else 
  {
    display.classList.remove("small-display");
  }
}


let firstValue = null;
let operator = '';
let prevInputType = '';
const display = document.getElementById("display");
const buttons = document.getElementById("buttons");

//event delegation on all buttons: two cases 1) number 2) operator
buttons.addEventListener('click', e => {
  const currentDisplay = display.textContent;
  const input = e.target.id;

  // a number is pressed, or a decimal point
  if (e.target.classList.contains('number')) 
  {    
    //start a new number from 0 or after operator is pressed
    if (currentDisplay == '0' || prevInputType == 'operator')
    {
      if (input == '.')
        setDisplay('0.', display);
      else
        setDisplay(input, display);
    }
    // or else, add to the number input
    else 
    {
      if(input != '.' || !(currentDisplay.includes('.')))
        appendToDisplay(input, display);
    }
    // set input type to number and remove highlighting from opertor buttons
    prevInputType = 'number';
    removePressed();
  }
  // operator button is pressed: 1) clear 
  //                             2) eq
  //                             3) negage or percent operators
  //                             4) +, -, /, *  binary operators 
  else 
  {
    // 1) clear button is pressed 
    if (input == 'clear') 
    {
      clearDisplay(display);
      //if the last input was a number, clear that number and 
      //go back to the last operator pressed state, allows user to continue last operation
      if (prevInputType == 'number' && operator && operator != 'eq') 
      {
        document.getElementById(operator).classList.add("pressed");
      }
      // if clear is pressed a second consecutive time, also clear the last operator
      // and the previous saved value (ie delete previous operation)
      if (prevInputType == 'clear' || prevInputType == 'operator')  
      {
        firstValue = null;
        operator = '';
        removePressed();
      }
      prevInputType = 'clear';
    }
    else 
    {
      const currentValue = parseFloat(currentDisplay);

      // 2) equal button is pressed 
      if (input == 'eq')
      {
        // if previous input was not a number or if operator is not set
        // do not do operation
        if(prevInputType == 'number' && operator) 
        {
          if (operator == 'divide' && currentValue == 0)
          {
            setDisplay('error!', display);
          }
          else 
          {
            firstValue = operate(operator, firstValue, currentValue);
            setDisplay(firstValue, display);
          }
        }
        prevInputType = 'operator';
      }
      else
      {
        // 3)  negate and percent 
        if (input == 'neg') 
        {
          firstValue = currentValue * -1.0;
          setDisplay(firstValue, display);
        } else if (input == 'percent')
        {
          firstValue = currentValue * 0.01;
          setDisplay(firstValue, display);
        }

        // 4) +, -, /, *
        else {
          if (prevInputType == 'number') 
          {
            // case: the second value after operator has been entered
            //       second operator is pressed but not saved 
            if ((firstValue || firstValue === 0) && operator)
            {
              // use the old operator value 
              if (operator == 'divide' && currentValue == 0)
              {
                setDisplay('error!', display);
              }
              else {
                firstValue = operate(operator, firstValue, currentValue);
                setDisplay(firstValue, display);
              }
            }
            // case: first value has not been set at this point, set the first value
            else {
              firstValue = currentValue;
            }
          }
          operator = input;
          prevInputType = 'operator';
          removePressed();
          e.target.classList.add("pressed");
        }
      }
    
    }
  }
});

const removePressed = () => {
  const pressedBtns = document.getElementsByClassName("pressed");

  if (pressedBtns) {
    for(let button of pressedBtns) {
      button.classList.remove("pressed");
    }
  }
}