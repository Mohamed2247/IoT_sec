const body = document.querySelector("body"),
  sidebar = body.querySelector(".sidebar"),
  toggle = body.querySelector(".toggle"),
  modeSwitch = body.querySelector(".toggle-switch"),
  modeText = body.querySelector(".mode-text");

toggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});

modeSwitch.addEventListener("click", () => {
  body.classList.toggle("dark");
  modeText.innerHTML = body.classList.contains("dark")
    ? "Light Mode"
    : "Dark Mode";
});


function logout(){
  sessionStorage.clear();
    // Redirect to the login page
    window.location.href = '/index.html';
}