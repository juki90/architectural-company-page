const button = document.querySelector(".intro-button");

const handleButtonClick = (e) => {
  const scrollTo = document.querySelector("#company").offsetTop;
  let rafID,
    counter = document.querySelector("html").scrollTop;

  const rafFunc = () => {
    rafID = requestAnimationFrame(rafFunc);
    if (counter >= scrollTo - 80) {
      cancelAnimationFrame(rafID);
    }
    counter += 30;
    window.scrollTo(0, counter);
  };

  requestAnimationFrame(rafFunc);
};

button.addEventListener("click", handleButtonClick);
