// Contact Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactBtns = document.querySelectorAll('.connect-btn');
    const contactModal = document.getElementById('contactModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('closeModal');
    const contactForm = document.getElementById('contactForm');

    if (!contactModal) return;

    // Open modal when "Let Connect" button is clicked
    contactBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
        });
    });

    // Close modal when close button is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close modal when overlay is clicked
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && contactModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Handle form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Validate form
            if (!name || !email || !subject || !message) {
                alert('Please fill in all required fields');
                return;
            }

            // Create email content
            const emailBody = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\nMessage: ${message}`;
            
            // Send email using mailto (client-side solution)
            window.location.href = `mailto:hello@example.com?subject=${encodeURIComponent('MARBEL Connection - ' + subject)}&body=${encodeURIComponent(emailBody)}`;

            // Show success message
            alert('Thank you for connecting! We will get back to you soon.');
            
            // Reset form
            contactForm.reset();
            
            // Close modal
            closeModal();
        });
    }

    function openModal() {
        contactModal.classList.add('active');
        if (modalOverlay) modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        contactModal.classList.remove('active');
        if (modalOverlay) modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});
