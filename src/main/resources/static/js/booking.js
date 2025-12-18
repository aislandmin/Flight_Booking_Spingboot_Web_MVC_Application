// Xiaomin Guo  301495284  2025-9-27
 
 const oneWayTripRadio = document.getElementById("oneWayTrip");
 const roundTripRadio = document.getElementById("roundTrip");
 const returnDateField = document.getElementById("returnDate");
 const departureDateField = document.getElementById("departureDate");
 const expiryDateField = document.getElementById("expiryDate");
 const issueDateField = document.getElementById("issueDate");    
 
 const fromSelect = document.getElementById("from");
 const toSelect = document.getElementById("to");
 
 const phoneField = document.getElementById("phone");
 
 const bookingForm = document.getElementById("bookingForm");
 
 const fromError = document.getElementById("fromError");
 const toError = document.getElementById("toError");
 const returnDateError = document.getElementById("returnDateError");
 
 // Both departure and return dates must be future dates (i.e., after the current date).
 const today = new Date();
 const tomorrow = new Date(today);
 tomorrow.setDate(today.getDate() + 1); 
 const minDate = tomorrow.toISOString().split("T")[0];    
 departureDateField.min = minDate;
 returnDateField.min = minDate;

 // set default value to min date
 departureDateField.value = minDate;
 returnDateField.value = minDate;
 
 expiryDateField.value = minDate;
 issueDateField.value = minDate; 

 // one Way trip disables return date     
 function toggleReturnDate() {
     if (oneWayTripRadio.checked) {
         returnDateField.disabled = true;
         returnDateField.removeAttribute("required");
     } else {
         returnDateField.disabled = false;
         returnDateField.setAttribute("required", "true");
     }
 }

 //format phone number    
 phoneField.addEventListener("input", function(e) {
     let numbers = phoneField.value.replace(/\D/g, ""); // remove all non-digits
     numbers = numbers.substring(0, 10); // limit to 10 digits

     let formatted = numbers;

     if (numbers.length >= 4) {
         formatted = `(${numbers.substring(0, 3)})${numbers.substring(3, 6)}`;
         if (numbers.length >= 7) {
             formatted += `-${numbers.substring(6, 10)}`;
         }
     }

     phoneField.value = formatted;
 });
 
 //validate email and confirmEmail match
 const emailField = document.getElementById("email");
 const confirmEmailField = document.getElementById("confirmEmail");
 const confirmEmailError = document.getElementById("confirmEmailError");

 confirmEmailField.addEventListener("input", function() {
     confirmEmailError.textContent = "";

     if (emailField.value !== confirmEmailField.value) {
         confirmEmailError.textContent = "Emails do not match.";
     }
 });

 // Attach listeners
 oneWayTripRadio.addEventListener("change", toggleReturnDate);
 roundTripRadio.addEventListener("change", toggleReturnDate);

 // ensure from and to different cities
function validateCities(changedField) {
    // clear old errors
    fromError.textContent = "";
    toError.textContent = "";

    if (fromSelect.value && toSelect.value && fromSelect.value === toSelect.value) {
        if (changedField === "from") {
            fromError.textContent = "From and To cannot be the same city.";
            fromSelect.value = "";
            fromSelect.focus();
        } else if (changedField === "to") {
            toError.textContent = "From and To cannot be the same city.";
            toSelect.value = "";
            toSelect.focus();
        }
    }
}

fromSelect.addEventListener("change", () => validateCities("from"));
toSelect.addEventListener("change", () => validateCities("to"));

// Validate return date on change
returnDateField.addEventListener("change", () => {
    returnDateError.textContent = ""; // clear previous error

    if (returnDateField.value && returnDateField.value < departureDateField.value) {
        returnDateError.textContent = "Return date cannot be earlier than departure date.";
    }
});

// Validate before form submission
bookingForm.addEventListener("submit", (event) => {
    returnDateError.textContent = ""; // clear previous error

    if (returnDateField.value && returnDateField.value < departureDateField.value) {
        returnDateError.textContent = "Return date cannot be earlier than departure date.";
        returnDateField.focus();
        event.preventDefault(); // stop form submit
    }
});