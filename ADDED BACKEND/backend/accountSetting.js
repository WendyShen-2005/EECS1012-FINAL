// Enable editing of input fields
function enableEdit(selector) {
    document.querySelector(selector).removeAttribute('disabled'); // Remove the 'disabled' attribute
    document.querySelector(selector).focus();
}

// Send updated settings to the server
function sendUpdateRequest(data) {
    fetch('/api/updateSettings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        alert('Changes saved successfully.');
        window.location.href = 'General.html';
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Validate user data before sending it
function validateUserData(username, email, password) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!username.trim()) {
        alert('Username cannot be empty.');
        return false;
    }
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    if (password.length < 8) {
        alert('Password must be at least 8 characters long.');
        return false;
    }
    return true;
}

// Save changes when the "Done" button is clicked
function saveChanges() {
    const username = document.querySelector('.Username').value;
    const email = document.querySelector('.Email').value;
    const password = document.querySelector('.Password').value;

    if (validateUserData(username, email, password)) {
        sendUpdateRequest({ username, email, password });
    }
}

// Add event listeners after the DOM has loaded
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.Done').addEventListener('click', saveChanges);
    document.querySelector('.change-username-button').addEventListener('click', () => enableEdit('.Username'));
    document.querySelector('.change-email-button').addEventListener('click', () => enableEdit('.Email'));
    document.querySelector('.change-password-button').addEventListener('click', () => enableEdit('.Password'));
});
