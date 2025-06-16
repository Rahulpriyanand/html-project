// WhatsApp configuration
const WHATSAPP_CONFIG = {
    accountSid: 'YOUR_TWILIO_ACCOUNT_SID',
    authToken: 'YOUR_TWILIO_AUTH_TOKEN',
    from: 'whatsapp:+14155238886', // Your Twilio WhatsApp number
    to: 'whatsapp:+1234567890' // Recipient's WhatsApp number
};

// Form validation function
function validateForm(event) {
    event.preventDefault();
    
    const form = document.getElementById('registrationForm');
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    // Password validation
    if (password.length < 8) {
        showError('Password must be at least 8 characters long');
        return false;
    }

    // Password match validation
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address');
        return false;
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        showError('Please enter a valid 10-digit phone number');
        return false;
    }

    // If all validations pass, submit to Google Sheets
    submitToGoogleSheets();
    return false;
}

// Function to send WhatsApp message
function sendWhatsAppMessage(phoneNumber, message) {
    // Remove any non-digit characters from phone number (e.g., +, spaces)
    phoneNumber = phoneNumber.replace(/\D/g, '');
    // Encode the message for URL safety
    const encodedMessage = encodeURIComponent(message);
    // Construct WhatsApp URL
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    // Open URL in a new tab/window
    window.open(url, '_blank');
}

// Submit form data to Google Sheets and WhatsApp
async function submitToGoogleSheets() {
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirm-password').value,
        date: document.getElementById('date').value,
        phone: document.getElementById('phone').value
    };

    try {
        // Send to Google Sheets
        const response = await fetch('https://script.google.com/macros/s/AKfycbxj6TJW9G7oNuFHD5rFORsHmfpOfGEwVSAapGVKrSy-na5D4GNJhDs6Jc2bxGR3tT18/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        // Prepare WhatsApp message
        const whatsappMessage = `
New Registration Details:
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Date of Birth: ${formData.date}
        `;

        // Send WhatsApp message
        sendWhatsAppMessage('919876543210', whatsappMessage); // Replace with your WhatsApp number

        showSuccess('Registration successful! Your data has been saved and WhatsApp notification sent.');
        document.getElementById('registrationForm').reset();
    } catch (error) {
        console.error('Error:', error);
        showError('There was an error submitting the form. Please try again.');
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ff6b6b';
    errorDiv.style.padding = '10px';
    errorDiv.style.margin = '10px 0';
    errorDiv.style.backgroundColor = 'rgba(255, 107, 107, 0.1)';
    errorDiv.style.borderRadius = '5px';
    errorDiv.style.textAlign = 'center';

    const form = document.getElementById('registrationForm');
    form.insertBefore(errorDiv, form.firstChild);

    // Remove error message after 3 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.color = '#4ecdc4';
    successDiv.style.padding = '10px';
    successDiv.style.margin = '10px 0';
    successDiv.style.backgroundColor = 'rgba(78, 205, 196, 0.1)';
    successDiv.style.borderRadius = '5px';
    successDiv.style.textAlign = 'center';

    const form = document.getElementById('registrationForm');
    form.insertBefore(successDiv, form.firstChild);

    // Remove success message after 3 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Initialize form functionality when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add input focus effects
    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'scale(1.02)';
            input.parentElement.style.transition = 'transform 0.3s ease';
        });

        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'scale(1)';
        });
    });

    // Add password strength indicator
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            let strength = 0;
            
            if (password.length >= 8) strength++;
            if (password.match(/[a-z]/)) strength++;
            if (password.match(/[A-Z]/)) strength++;
            if (password.match(/[0-9]/)) strength++;
            if (password.match(/[^a-zA-Z0-9]/)) strength++;

            const strengthIndicator = document.createElement('div');
            strengthIndicator.className = 'password-strength';
            strengthIndicator.style.height = '5px';
            strengthIndicator.style.marginTop = '5px';
            strengthIndicator.style.borderRadius = '3px';
            strengthIndicator.style.transition = 'all 0.3s ease';

            switch(strength) {
                case 0:
                case 1:
                    strengthIndicator.style.width = '20%';
                    strengthIndicator.style.backgroundColor = '#ff6b6b';
                    break;
                case 2:
                case 3:
                    strengthIndicator.style.width = '60%';
                    strengthIndicator.style.backgroundColor = '#ffd93d';
                    break;
                case 4:
                case 5:
                    strengthIndicator.style.width = '100%';
                    strengthIndicator.style.backgroundColor = '#4ecdc4';
                    break;
            }

            const existingIndicator = passwordInput.parentElement.querySelector('.password-strength');
            if (existingIndicator) {
                existingIndicator.remove();
            }
            passwordInput.parentElement.appendChild(strengthIndicator);
        });
    }
}); 
