(function () {
  "use strict";

  let form = document.querySelector("#contact-form");

  form.addEventListener("submit", function(event) {
      event.preventDefault();
      event.stopPropagation();
      
      let formValid = form.checkValidity();
      form.classList.add("was-validated");
      
      if (formValid) {
          sendTheEmail();
      }
  });

  function sendTheEmail() {
      let obj = {
          sub: "Someone submitted a contact form!",
          txt: `First Name: ${document.querySelector("#contact-first").value}, ` +
               `Last Name: ${document.querySelector("#contact-last").value}, ` +
               `Email: ${document.querySelector("#contact-email-addr").value}, ` +
               `Message: ${document.querySelector("#contact-question").value}`
      };

      fetch("/mail", {
          method: "POST",
          headers: {
              "Content-type": "application/json",
          },
          body: JSON.stringify(obj),
      })
      .then(response => response.json())
      .then(data => {
          document.querySelector("#contact-button-response").textContent = data.message;
          setTimeout(() => {
              document.querySelector("#contact-button-response").textContent = "";
          }, 5000);
      })
      .catch(error => {
          console.error('Error:', error);
          document.querySelector("#contact-button-response").textContent = 'Failed to send message';
      });
  }
})();
