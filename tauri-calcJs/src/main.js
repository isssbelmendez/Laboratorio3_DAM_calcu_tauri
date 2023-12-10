const { invoke } = window.__TAURI__.tauri;

class Calculadora {
  constructor(valorPrevioTextElement, valorActualTextElement) {
      this.valorPrevioTextElement = valorPrevioTextElement
      this.valorActualTextElement = valorActualTextElement
      this.borrarTodo()
  }

  borrarTodo() {
      this.valorActual = ''
      this.valorPrevio = ''
      this.operacion = undefined
  }

  borrar() {
      this.valorActual = this.valorActual.toString().slice(0, -1)
  }

  agregarNumero(numero) {
      //this.valorActual = numero
      if (numero === '.' && this.valorActual.includes('.')) return
      if(this.valorActual.length < 11){
          this.valorActual = this.valorActual.toString() + numero.toString()
      }
  }

  elejirOperacion(operacion) {
      if (this.valorActual === '') return
      if (this.valorPrevio !== '') {
          this.calcular()
      }
      this.operacion = operacion
      this.valorPrevio = this.valorActual
      this.valorActual = ''
  }
    
     // Método para calcular el porcentaje del valor actual
calcularPorcentaje() {
  // Verificar si el valor actual es un número
  const valor = parseFloat(this.valorActual);
  if (isNaN(valor)) return; // Si no es un número, no realizar el cálculo
  // Calcular el porcentaje (dividir el valor actual por 100)
  const resultado = valor / 100;
  // Actualizar el valor actual con el resultado del porcentaje
  this.valorActual = resultado.toString();
  // Actualizar la pantalla para reflejar el resultado
  this.actualizarPantalla();
}
  

  calcular() {
      let resultado
      const valor_1 = parseFloat(this.valorPrevio)
      const valor_2 = parseFloat(this.valorActual)
      if (isNaN(valor_1) || isNaN(valor_2)) return
      switch (this.operacion) {
          case '+':
              resultado = valor_1 + valor_2
              break
          case '-':
              resultado = valor_1 - valor_2
              break
          case 'x':
              resultado = valor_1 * valor_2
              break
          case '÷':
              resultado = valor_1 / valor_2
              break
          default:
              return
      }

      this.valorActual = resultado.toPrecision(8) // Redondea a 8 dígitos
      this.operacion = undefined // Restablece la operación
      this.valorPrevio = '' //Limpia el valorPrevio
  }

  obtenerNumero(numero) {
      const cadena = numero.toString()
      const enteros = parseFloat(cadena.split('.')[0])
      const decimales = cadena.split('.')[1]
      let mostrarEnteros
      if (isNaN(enteros)) {
          mostrarEnteros = ''
      } else {
          mostrarEnteros = enteros.toLocaleString('en', { maximumFractionDigits: 0 })
      }

      if (decimales != null) {
          return `${mostrarEnteros}.${decimales}`
      } else {
          return mostrarEnteros
      }
  }

  actualizarPantalla() {
      this.valorActualTextElement.innerText = this.obtenerNumero(this.valorActual)
      if (this.operacion != null) {
          this.valorPrevioTextElement.innerText = `${this.obtenerNumero(this.valorPrevio)} ${this.operacion}`
      } else {
          this.valorPrevioTextElement.innerText = ''
      }
  }
}



//Captura de datos del DOM
const numeroButtons = document.querySelectorAll('[data-numero]')
const operacionButtons = document.querySelectorAll('[data-operacion]')
const igualButton = document.querySelector('[data-igual]')
const porcentajeButton = document.querySelector('[data-porcentaje]')
const borrarButton = document.querySelector('[data-borrar]')
const borrarTodoButton = document.querySelector('[data-borrar-todo]')
const valorPrevioTextElement = document.querySelector('[data-valor-previo]')
const valorActualTextElement = document.querySelector('[data-valor-actual]')

// Instanciar un nuevo objeto de tipo calculadora
const calculator = new Calculadora(valorPrevioTextElement, valorActualTextElement)

numeroButtons.forEach(button => {
  button.addEventListener('click', () => {
      calculator.agregarNumero(button.innerText)
      calculator.actualizarPantalla()
     
  })
})

// Agregar listeners a los botones de operaciones
operacionButtons.forEach(button => {
  button.addEventListener('click', () => {
      calculator.elejirOperacion(button.innerText)
      calculator.actualizarPantalla()
  })
})
// Agregar listener al botón igual
igualButton.addEventListener('click', _button => {
  calculator.calcular()
  calculator.actualizarPantalla()

})
// Agregar listener al botón de borrar todo
borrarTodoButton.addEventListener('click', _button => {
  calculator.borrarTodo()
  calculator.actualizarPantalla()

})
// Agregar listener al botón de borrar
borrarButton.addEventListener('click', _button => {
  calculator.borrar()
  calculator.actualizarPantalla()
})

//Agregar listener al botón de porcentaje
porcentajeButton.addEventListener('click', () =>{
  calculator.calcularPorcentaje()
  calculator.actualizarPantalla()
})


/*Parcial:
1. Arreglar bug que limite los numeros en pantalla
2. Funcionabilidad de boton de porcentaje
3. Si lo que se presiona despues de igual es un numero entonces que borre el resultado anterior e inicie una nueva operacion
4. Muestre la operacion completa en el display superior
*/
