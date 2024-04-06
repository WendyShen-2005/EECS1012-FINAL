// Enable editing of input fields
function enableEdit(selector) {
    const input = document.querySelector(selector);
    input.disabled = false;
    input.focus(); // Optionally set focus to the input field
  }
  
  // Populate fields with saved values
  function populateFields() {
    document.querySelector('.Username').value = localStorage.getItem('username') || '';
    document.querySelector('.Email').value = localStorage.getItem('email') || '';
    document.querySelector('.Password').value = localStorage.getItem('password') || '';
  }
  
 // Save changes to localStorage
function saveChanges() {
    const username = document.querySelector('.Username').value;
    const email = document.querySelector('.Email').value;
    const password = document.querySelector('.Password').value;

    // Expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username || !email || !password) {
        alert('Please fill in all fields.');
    } else if (!emailRegex.test(email)) {
        // Check if the email matches the pattern
        alert('Please enter a valid email address.');
    } else {
        // If all validations pass, save to localStorage
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);

        // Alert the user of successful save
        alert('Changes saved successfully.');

        // Optionally disable fields again after saving
        document.querySelectorAll('.InputField').forEach(field => field.disabled = true);

        // Redirect to General.html
        window.location.href = 'General.html';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    populateFields(); // Populate fields with existing values
    document.querySelector('.Done').addEventListener('click', saveChanges);
});
