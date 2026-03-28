const calorieCounter = document.getElementById("calorie-counter"); // Formulario principal
const budgetNumberInput = document.getElementById("budget"); // Input del presupuesto de calorías
const entryDropdown = document.getElementById("entry-dropdown"); // Dropdown para seleccionar categoría
const addEntryButton = document.getElementById("add-entry"); // Botón para agregar entrada
const clearButton = document.getElementById("clear"); // Botón para limpiar el formulario
const output = document.getElementById("output"); // Contenedor del resultado
let isError = false; // Bandera para controlar si hay un error

function cleanInputString(str) {
  // Elimina espacios y signos + y - de la cadena
  const regex = /[+-\s]/g;
  return str.replace(regex, "");
}

function isInvalidInput(str) {
  // Detecta notación científica como "10e3" — si existe, la bloquea
  const regex = /\d+e\d+/i;
  return str.match(regex);
}

function addEntry() {
  // Agrega dinámicamente campos de nombre y calorías al contenedor de la categoría seleccionada
  const targetInputContainer = document.querySelector(
    `#${entryDropdown.value} .input-container`,
  );
  const entryNumber =
    targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
  const HTMLString = `
  <label for="${entryDropdown.value}-${entryNumber}-name">Entrada ${entryNumber} Nombre</label>
  <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Nombre" />
  <label for="${entryDropdown.value}-${entryNumber}-calories">Entrada ${entryNumber} Calorías</label>
  <input
    type="number"
    min="0"
    id="${entryDropdown.value}-${entryNumber}-calories"
    placeholder="Calorías"
  />`;
  targetInputContainer.insertAdjacentHTML("beforeend", HTMLString);
}

function calculateCalories(e) {
  // Calcula las calorías restantes del día al enviar el formulario
  e.preventDefault(); // Evita que la página se recargue
  isError = false;

  // Obtiene todos los inputs numéricos de cada categoría
  const breakfastNumberInputs = document.querySelectorAll("#breakfast input[type='number']");
  const lunchNumberInputs = document.querySelectorAll("#lunch input[type='number']");
  const dinnerNumberInputs = document.querySelectorAll("#dinner input[type='number']");
  const snacksNumberInputs = document.querySelectorAll("#snacks input[type='number']");
  const exerciseNumberInputs = document.querySelectorAll("#exercise input[type='number']");

  // Suma las calorías de cada categoría
  const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
  const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
  const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
  const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
  const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
  const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

  if (isError) return; // Si hubo error en algún input, detiene la ejecución

  const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
  const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
  
  // Determina si hay superávit o déficit de calorías
  const surplusOrDeficit = remainingCalories < 0 ? "Surplus" : "Deficit";
  
  // Muestra el resultado en pantalla
  output.innerHTML = `
  <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorías ${surplusOrDeficit}</span>
  <hr>
  <p>${budgetCalories} Calorías Presupuestadas</p>
  <p>${consumedCalories} Calorías Consumidas</p>
  <p>${exerciseCalories} Calorías Quemadas</p>
  `;

  output.classList.remove("hide");
}

function getCaloriesFromInputs(list) {
  // Recorre una lista de inputs, valida y suma sus valores
  let calories = 0;

  for (const item of list) {
    const currVal = cleanInputString(item.value); // Limpia el valor del input
    const invalidInputMatch = isInvalidInput(currVal); // Verifica si es notación científica

    if (invalidInputMatch) {
      alert(`Entrada inválida: ${invalidInputMatch[0]}`);
      isError = true;
      return null; // Detiene la función si hay error
    }
    calories += Number(currVal); // Convierte a número y acumula
  }
  return calories;
}

function clearForm() {
  // Limpia todos los inputs y oculta el resultado
  const inputContainers = Array.from(
    document.querySelectorAll(".input-container"),
  );

  for (const container of inputContainers) {
    container.innerHTML = ""; // Vacía cada contenedor de entradas
  }

  budgetNumberInput.value = "";
  output.innerText = "";
  output.classList.add("hide");
}

// Event listeners
addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit", calculateCalories);
clearButton.addEventListener("click", clearForm);