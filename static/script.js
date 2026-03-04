const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

// Toggle panels
registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

// ================= REGISTER =================
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPass").value;

  const msg = document.getElementById("regMsg");
  msg.textContent = "";
  msg.className = "msg";

  if (!name || !email || !password) {
    msg.textContent = "Please fill all fields.";
    msg.className = "msg error";
    return;
  }

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      msg.textContent = data.message + " Redirecting to login...";
      msg.className = "msg success";

      // wait 2 sec then switch to login panel
      setTimeout(() => {
        container.classList.remove("active");
      }, 2000);

    } else {
      msg.textContent = data.message || "Registration failed";
      msg.className = "msg error";
    }

  } catch (err) {
    console.error("Register error:", err);
    msg.textContent = "Network error. Please try again.";
    msg.className = "msg error";
  }
});


// ================= LOGIN =================
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPass").value;

  const msg = document.getElementById("loginMsg");
  msg.textContent = "";
  msg.className = "msg";

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log("Login response:", data); // debug

    if (res.ok) {
      // Save JWT token
      localStorage.setItem("token", data.token);

      msg.textContent = "Login successful! Redirecting...";
      msg.className = "msg success";

      // small delay ensures token is stored before redirect
      setTimeout(() => {
        window.location.href = "/dashboard.html";
      }, 300);

    } else {
      msg.textContent = data.message || "Login failed";
      msg.className = "msg error";
    }

  } catch (err) {
    console.error("Login error:", err);
    msg.textContent = "Network error. Please try again.";
    msg.className = "msg error";
  }
});