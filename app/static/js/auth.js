// QT Consultancy Authentication Page Scripts

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            const emailInput = document.getElementById('email').value.trim();
            const passwordInput = document.getElementById('password').value;
            
            // Client-side quick validation
            if (!emailInput || !passwordInput) {
                e.preventDefault();
                showToast('Please fill in all credentials.', 'warning');
                return;
            }
            
            // Validate admin credentials
            if (emailInput === 'admin@company.com' && passwordInput === 'admin123') {
                // Show loading animation on the premium submit button
                if (submitBtn && btnText && btnSpinner) {
                    submitBtn.disabled = true;
                    btnText.textContent = 'Verifying Credentials...';
                    btnSpinner.classList.remove('hidden');
                    submitBtn.classList.add('opacity-80', 'cursor-not-allowed');
                }
                // Allow form submission to Django view
            } else {
                e.preventDefault();
                showToast('Incorrect email or password. Use: admin@company.com / admin123', 'error');
            }
        });
    }
});
