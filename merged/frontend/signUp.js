document.addEventListener('DOMContentLoaded', () => {
  const signUpForm = document.getElementById('SignUpForm');
  const loginForm = document.getElementById('LoginForm');

  // Handle the Sign Up form submission
  if (signUpForm) {
      signUpForm.addEventListener('submit', event => {
          event.preventDefault();
          const username = document.getElementById('signupUsername').value.trim();
          const password = document.getElementById('signupPassword').value.trim();

          if (username && password) {
              sendAuthRequest('/api/signup', { username, password }).then(data => {
                  alert(data.message);
                  if (data.success) {
                      window.location.href = 'General.html'; // Redirect on successful signup
                  }
              }).catch(error => {
                  alert('Signup failed: ' + error.message);
              });
          } else {
              alert('Please enter both a username and a password.');
          }
      });
  }

  // Handle the Login form submission
  if (loginForm) {
      loginForm.addEventListener('submit', event => {
          event.preventDefault();
          const username = document.getElementById('loginUsername').value.trim();
          const password = document.getElementById('loginPassword').value.trim();

          if (username && password) {
              sendAuthRequest('/api/login', { username, password }).then(data => {
                  alert(data.message);
                  if (data.success) {
                      window.location.href = 'General.html'; // Redirect on successful login
                  }
              }).catch(error => {
                  alert('Login failed: ' + error.message);
              });
          } else {
              alert('Please enter both a username and a password for login.');
          }
      });
  }
});

function sendAuthRequest(url, data) {
  return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
  })
  .then(response => response.json().then(data => {
      if (!response.ok) throw new Error(data.message || 'Server error');
      return data;
  }));
}
