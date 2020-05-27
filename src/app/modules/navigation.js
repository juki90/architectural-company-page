const navicon = document.querySelector(".navicon"),
  links = document.querySelectorAll(".navigation__item-link");
let scrollRestore;

const handleClickNavigation = (e) => {
  const navigation = document.querySelector(".navigation");
  const html = document.querySelector("html");
  if (!navigation.classList.contains("navigation--active")) {
    navigation.classList.add("navigation--active");
    html.classList.add("blocked");
    history.pushState("", document.title, `${window.location.pathname}#nav`);
    return;
  }
  navigation.classList.remove("navigation--active");
  html.classList.remove("blocked");
  history.replaceState("", document.title, `${window.location.pathname}`);
};

const handleResize = (e) => {
  const html = document.querySelector("html");
  if (html.classList.contains("blocked") && document.body.offsetWidth >= 1024) {
    const navigation = document.querySelector(".navigation");
    html.classList.remove("blocked");
    navigation.classList.remove("navigation--active");
    history.replaceState("", document.title, `${window.location.pathname}`);
  }
};

const handlePopState = (e) => {
  const navigation = document.querySelector(".navigation");
  if (navigation.classList.contains("navigation--active")) {
    handleClickNavigation();
  }
};

const handleLinkClick = (e) => {
  e.preventDefault();
  const navToStr = e.target.getAttribute("href"),
    scrollTo = document.querySelector(navToStr).offsetTop - 60;

  handleClickNavigation();

  window.scrollTo(0, scrollTo);
};

navicon.addEventListener("click", handleClickNavigation);
window.addEventListener("resize", handleResize);
window.addEventListener("popstate", handlePopState);
links.forEach((l) => {
  l.addEventListener("click", handleLinkClick);
});
