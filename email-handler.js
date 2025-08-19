document.addEventListener('DOMContentLoaded', () => {
    const contactForms = document.querySelectorAll('.contact-form');
    const recipientEmail = 'anastasiareflexology@gmail.com';

    contactForms.forEach(form => {
        let isSubmitting = false; // Flag to prevent double submission

        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission
            console.log('Form submission triggered.');

            if (isSubmitting) {
                console.log('DEBUG: Submission already in progress, ignoring.');
                return;
            }
            isSubmitting = true;

            const nameInput = form.querySelector('input[name="name"]');
            const emailInput = form.querySelector('input[name="email"]');
            const subjectInput = form.querySelector('input[name="subject"]');
            const messageInput = form.querySelector('textarea[name="message"]');

            if (!nameInput || !emailInput || !subjectInput || !messageInput) {
                console.error('DEBUG: Critical error - form field elements not found. Check HTML structure and selectors.');
                alert('Could not find all required form fields. Please check the form setup.');
                isSubmitting = false; // Reset flag
                return;
            }

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const subject = subjectInput.value.trim();
            const message = messageInput.value.trim();

            console.log(`DEBUG: Values - Name: "${name}", Email: "${email}", Subject: "${subject}", Message: "${message}"`);

            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields before sending the message. (Validation failed)');
                console.log('DEBUG: Validation failed for empty fields.');
                isSubmitting = false; // Reset flag on validation failure
                return;
            }

            console.log('DEBUG: Validation passed. Constructing mailto link.');
            const mailtoSubject = encodeURIComponent(subject);
            const mailtoBody = encodeURIComponent(
                `Name: ${name}\n` +
                `Email: ${email}\n\n` +
                `Message:\n${message}`
            );
            const mailtoLink = `mailto:${recipientEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;
            console.log(`DEBUG: Mailto link: ${mailtoLink}`);

            try {
                window.location.href = mailtoLink;
                console.log('DEBUG: window.location.href called for mailto link.');
                
                alert('Your email application should now be open with the message details. Please review and send it from there. If it did not open, please check your browser or email client settings.');
                form.reset();
                console.log('DEBUG: Form reset and alert shown after mailto attempt.');
                
                // Reset the flag after a short delay, allowing navigation to potentially occur.
                setTimeout(() => { isSubmitting = false; }, 1000);
            } catch (e) {
                console.error('DEBUG: Error during mailto link navigation or subsequent operations:', e);
                alert('An error occurred while trying to open your email client. Please try again or copy the email address and send your message manually.');
                isSubmitting = false; // Reset flag on error
            }
        });
    });
});