// Send authentication request to the server
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

// Save credentials to the server
function saveCredentials() {
  const username = document.getElementById('signupUsername').value;
  const password = document.getElementById('signupPassword').value;

  if (username && password) {
      sendAuthRequest('/api/signup', { username, password });
  } else {
      alert('Please enter both username and password.');
  }
}

// Check login credentials against the server
function checkLogin() {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  if (username && password) {
      sendAuthRequest('/api/login', { username, password });
  } else {
      alert('Please enter both username and password.');
  }
}

// Add event listeners after the DOM has loaded
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('LoginForm').addEventListener('submit', (event) => {
      event.preventDefault();
      checkLogin();
  });
  document.getElementById('SignUpForm').addEventListener('submit', (event) => {
      event.preventDefault();
      saveCredentials();
  });
});
