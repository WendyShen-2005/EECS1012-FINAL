 // Save new user credentials to localStorage
function saveCredentials() {
  const username = document.getElementById('signupUsername').value;
  const password = document.getElementById('signupPassword').value;

  // Simple check to ensure username and password are not empty
  if (username && password) {
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
    alert('Sign Up Successful. You can now log in.');
    showLogin(); // Show the login form
  } else {
    alert('Please enter both username and password.');
  }
}

// Check credentials on login
function checkLogin() {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  if (username === localStorage.getItem('username') && password === localStorage.getItem('password')) {
    alert('Login Successful!');
    window.location.href = 'General.html'; // Redirect to General.html
  } else {
    alert('Invalid username or password.');
  }
}


// Show login form and hide sign-up form
function showLogin() {
  document.getElementById('LoginForm').style.display = 'flex';
  document.getElementById('SignUpForm').style.display = 'none';
}

// Show sign-up form and hide login form
function showSignup() {
  document.getElementById('SignUpForm').style.display = 'flex';
  document.getElementById('LoginForm').style.display = 'none';
}
