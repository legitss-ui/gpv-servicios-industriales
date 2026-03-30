const orderRegex2024 = /^2024\d{6}$/;
const productRegex = /^[a-z]{2}[\d]{2}-[a-z]{1}[\d]{3}-[a-z]{2}[\d]{1}$/i;
const validateGmail = /^[\w-\.]+@\w+\.[a-z]{2,}$/i;

function validateForm() {
  const fullName = document.getElementById("full-name").value;
  const email = document.getElementById("email").value;
  const orderNo = document.getElementById("order-no").value;
  const productCode = document.getElementById("product-code").value;
  const quantity = document.getElementById("quantity").value;

  const allGroupsComplaints = document.querySelectorAll(
    'input[name="complaint"]:checked',
  );

  const complaintDescription = document.getElementById(
    "complaint-description").value;
  const otherComplaint = document.getElementById("other-complaint").checked;
  const solutionsGroup = document.querySelectorAll(
    'input[name="solutions"]:checked',
  );
  const otherSolution = document.getElementById("other-solution").checked;
  const solutionDescription = document.querySelector(
    "#solution-description").value;

  return {
    "full-name": !!fullName,
    "order-no": orderRegex2024.test(orderNo),
    email: validateGmail.test(email),
    "product-code": productRegex.test(productCode),
    quantity: Number.isInteger(Number(quantity)) && Number(quantity) > 0,
    "complaint-description": !otherComplaint || complaintDescription.length >= 20,
    "solution-description": !otherSolution || solutionDescription.length >= 20,
    "complaints-group": allGroupsComplaints.length > 0,
    "solutions-group": solutionsGroup.length > 0,
  };
}

function isValid(validateForm) {
  let finalValidateForm = Object.values(validateForm);
  return finalValidateForm.every((value) => value);
}

const form = document.getElementById("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  return isValid(validateForm());
});

const fullNameInput = document.getElementById("full-name");

fullNameInput.addEventListener("change", () => {
  const isNotEmpty = fullNameInput.value.trim() !== "";
  fullNameInput.style.borderColor = isNotEmpty ? "green" : "red";
});

const emailInput = document.getElementById("email");
emailInput.addEventListener("change", () => {
  const isValidEmail = validateGmail.test(emailInput.value);
  emailInput.style.borderColor = isValidEmail ? "green" : "red";
});

const orderNoInput = document.getElementById("order-no");
orderNoInput.addEventListener("change", () => {
  const isValidOrderNo = orderRegex2024.test(orderNoInput.value);
  orderNoInput.style.borderColor = isValidOrderNo ? "green" : "red";
});

const productCodeInput = document.getElementById("product-code");
productCodeInput.addEventListener("change", () => {
  const isValidProductCode = productRegex.test(productCodeInput.value);
  productCodeInput.style.borderColor = isValidProductCode ? "green" : "red";
});

const quantityInput = document.getElementById("quantity");
quantityInput.addEventListener("change", () => {
  const quantityValue = Number(quantityInput.value);
  const isValidQuantity = Number.isInteger(quantityValue) && quantityValue > 0;
  quantityInput.style.borderColor = isValidQuantity ? "green" : "red";
});

const complaintsGroup = document.getElementById("complaints-group");
complaintsGroup.addEventListener("change", () => {
  const checkedComplaints = document.querySelectorAll(
    'input[name="complaint"]:checked',
  );
  const isChecked = checkedComplaints.length > 0;
  complaintsGroup.style.borderColor = isChecked ? "green" : "red";
});

const solutionGroup = document.getElementById("solutions-group");
solutionGroup.addEventListener("change", () => {
  const checkedSolutions = document.querySelectorAll(
    'input[name="solutions"]:checked',
  );
  const isChecked = checkedSolutions.length > 0;
  solutionGroup.style.borderColor = isChecked ? "green" : "red";
});

const complaintDescriptionInput = document.getElementById(
  "complaint-description",
);
complaintDescriptionInput.addEventListener("change", () => {
  const ontherComplaint = document.getElementById("other-complaint").checked;
  const ontherontherComplaintDescription =
    complaintDescriptionInput.value.length;
  complaintDescriptionInput.style.borderColor =
    ontherComplaint && ontherontherComplaintDescription >= 20 ? "green" : "red";
});

const solutionDescriptionInput = document.getElementById(
  "solution-description",
);
solutionDescriptionInput.addEventListener("change", () => {
  const isCheckedSolution = document.getElementById("other-solution").checked;
  const isMoretwentyCharsSolution = solutionDescriptionInput.value.length;
  solutionDescriptionInput.style.borderColor =
    isCheckedSolution && isMoretwentyCharsSolution >= 20 ? "green" : "red";
});
