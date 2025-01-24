export const useCalculator = () => {
    const display = ref('0')
    const firstNumber = ref('')
    const operator = ref('')
    const newNumber = ref(true)
  
    const addNumber = (num: number) => {
      if (newNumber.value) {
        display.value = num.toString()
        newNumber.value = false
      } else {
        display.value = display.value + num.toString()
      }
    }
  
    const clear = () => {
      display.value = '0'
      firstNumber.value = ''
      operator.value = ''
      newNumber.value = true
    }
  
    const addOperator = (op: string) => {
      firstNumber.value = display.value
      operator.value = op
      newNumber.value = true
    }
  
    const calculate = () => {
      const num1 = parseFloat(firstNumber.value)
      const num2 = parseFloat(display.value)
      
      let result = 0
      switch(operator.value) {
        case '+': result = num1 + num2; break
        case '-': result = num1 - num2; break
        case '*': result = num1 * num2; break
        case '/': result = num1 / num2; break
      }
      
      display.value = result.toString()
      newNumber.value = true
    }
  
    return {
      display,
      addNumber,
      clear,
      addOperator,
      calculate
    }
  }