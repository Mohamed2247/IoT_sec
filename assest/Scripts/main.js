document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "admin123") {
      localStorage.setItem("isLoggedIn", "true");
      window.location.href = "/configuration.html";
    } else {
      document.getElementById("error-message").innerText =
        "Invalid Username or Password";
    }
  });
