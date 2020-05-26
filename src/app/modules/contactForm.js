const namee = document.querySelector("#name");
const email = document.querySelector("#email");
const phone = document.querySelector("#phone");
const message = document.querySelector("#message");
const send = document.querySelector("#send");
const form = document.querySelector(".contact-form");

const regexes = {
  namee: /^[a-z ,.'-\s]{2,}$/i,
  email: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
  phone: /[0-9\s\+\-\(\)]{8,}/,
  message: /\S{4,}/,
};

const errors = {
  namee: "Fill up all fields correctly",
  email: "This field must contain a valid e-mail address",
  phone: "This field must contain a valid phone number",
  message: "Please, enter message",
};

let hasErrors = false;

const clearFields = () => {
  namee.value = "";
  email.value = "";
  phone.value = "";
  message.value = "";
};

const validate = (el, regex, error) => {
  const small = document.querySelector(
    `[for='${el.getAttribute("id")}'] small`
  );
  if (small) {
    small.remove();
  }
  if (!regex.test(el.value)) {
    const errorMsg = document.createElement("small");
    errorMsg.classList.add("--error");
    errorMsg.innerText = error;
    el.classList.add("--error");
    el.parentNode.appendChild(errorMsg);
    hasErrors = true;
    return;
  }
  el.classList.remove("--error");
};

const handleChange = (el, regex) => {
  if (regex.test(el.value)) {
    const small = document.querySelector(
      `[for="${el.getAttribute("id")}"] small`
    );
    if (small) {
      small.remove();
    }
    el.classList.remove("--error");
  }
};

const handleSubmit = (e) => {
  e.preventDefault();
  const msg = document.createElement("p");
  const sendContainer = document.querySelector(`[for="send"]`);
  const small = sendContainer.querySelector("p");
  validate(namee, regexes.namee, errors.namee);
  validate(email, regexes.email, errors.email);
  validate(phone, regexes.phone, errors.phone);
  validate(message, regexes.message, errors.message);
  console.log(hasErrors);
  if (small) {
    small.remove();
  }
  if (hasErrors) {
    msg.classList.add("--error");
    msg.innerText = "Fill up all fields correctly";
    sendContainer.appendChild(msg);
    hasErrors = false;
    return;
  }
  msg.classList.add("--success");
  msg.innerText = "Message is sent";
  sendContainer.appendChild(msg);
  clearFields();
};

namee.addEventListener("blur", (e) => {
  validate(e.target, regexes.namee, errors.namee);
});

namee.addEventListener("input", (e) => {
  handleChange(e.target, regexes.namee);
});

email.addEventListener("blur", (e) => {
  validate(e.target, regexes.email, errors.email);
});

email.addEventListener("input", (e) => {
  handleChange(e.target, regexes.email);
});

phone.addEventListener("blur", (e) => {
  validate(e.target, regexes.phone, errors.phone);
});

phone.addEventListener("input", (e) => {
  handleChange(e.target, regexes.phone);
});

message.addEventListener("blur", (e) => {
  validate(e.target, regexes.message, errors.message);
});

message.addEventListener("input", (e) => {
  handleChange(e.target, regexes.message);
});

form.addEventListener("submit", handleSubmit);

window.addEventListener("load", clearFields);
