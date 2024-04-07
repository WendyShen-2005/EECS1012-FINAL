// Function to send authentication request to the server
function sendAuthRequest(url, data) {
  fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(result => {
      alert(result.message);
      if (result.success) {
          window.location.href = 'General.html';
      }
  })
  .catch(error => {
      alert('Error: ' + error.message);
  });
}

// Function to save credentials to the server
function saveCredentials() {
  const username = document.getElementById('signupUsername').value;
  const password = document.getElementById('signupPassword').value;

  if (username && password) {
      sendAuthRequest('/api/signup', { username, password });
  } else {
      alert('Please enter both username and password.');
  }
}

// Function to check login credentials against the server
function checkLogin() {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  if (username && password) {
      sendAuthRequest('/api/login', { username, password });
  } else {
      alert('Please enter both username and password.');
  }
}

// Function to show the sign-up form and hide the login form
function showSignupForm() {
  document.getElementById('LoginForm').style.display = 'none'; // Hide login form
  document.getElementById('SignUpForm').style.display = 'block'; // Show sign-up form
}

// Function to show the login form and hide the sign-up form
function showLoginForm() {
  document.getElementById('SignUpForm').style.display = 'none'; // Hide sign-up form
  document.getElementById('LoginForm').style.display = 'block'; // Show login form
}

// Add event listeners after the DOM has loaded
document.addEventListener('DOMContentLoaded', () => {
  // Event listener for the sign-up button
  document.getElementById('showSignupBtn').addEventListener('click', showSignupForm);

  // Event listener for the login button
  document.getElementById('showLoginBtn').addEventListener('click', showLoginForm);

  // Event listener for the login form submission
  document.getElementById('LoginForm').addEventListener('submit', (event) => {
      event.preventDefault();
      checkLogin();
  });

  // Event listener for the sign-up form submission
  document.getElementById('SignUpForm').addEventListener('submit', (event) => {
      event.preventDefault();
      saveCredentials();
  });
});
