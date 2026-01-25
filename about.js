// Team Member Data
const teamMembers = {
    1: {
        name: "Rajesh Kumar",
        position: "Master Craftsman",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80",
        about: "With over 25 years of experience in stone craftsmanship, Rajesh leads our team of artisans with unparalleled expertise. His mastery in traditional carving techniques combined with modern precision has produced some of our most celebrated works. He specializes in intricate temple carvings and large-scale architectural installations.",
        email: "rajesh.kumar@marbel.com",
        phone: "+91 98765 43210",
        linkedin: "https://linkedin.com/in/rajeshkumar"
    },
    2: {
        name: "Priya Sharma",
        position: "Design Director",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80",
        about: "Priya brings a unique blend of contemporary design thinking and traditional aesthetics to every project. With a Master's degree in Architecture and 15 years in the luxury stone industry, she transforms client visions into stunning reality. Her innovative approach has won numerous design awards and client accolades.",
        email: "priya.sharma@marbel.com",
        phone: "+91 98765 43211",
        linkedin: "https://linkedin.com/in/priyasharma"
    },
    3: {
        name: "Amit Patel",
        position: "Head of Operations",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80",
        about: "Amit ensures seamless execution of every project from quarry to installation. His expertise in supply chain management and quality control has streamlined our operations globally. With 18 years in the stone industry, he manages our production facilities and international logistics with precision and care.",
        email: "amit.patel@marbel.com",
        phone: "+91 98765 43212",
        linkedin: "https://linkedin.com/in/amitpatel"
    },
    4: {
        name: "Kavita Singh",
        position: "Client Relations Manager",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80",
        about: "Kavita is the bridge between our clients and craftsmen, ensuring every requirement is understood and exceeded. Her dedication to client satisfaction and 12 years of experience in luxury goods have made her an invaluable part of our team. She personally oversees each project to ensure it meets our exacting standards.",
        email: "kavita.singh@marbel.com",
        phone: "+91 98765 43213",
        linkedin: "https://linkedin.com/in/kavitasingh"
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('teamModal');
    const closeBtn = document.getElementById('closeModal');
    const overlay = document.querySelector('.modal-overlay');
    const readMoreBtns = document.querySelectorAll('.read-more-btn');

    // Open modal
    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const memberId = this.getAttribute('data-member');
            const member = teamMembers[memberId];
            
            if (member) {
                // Populate modal with member data
                document.getElementById('modalImage').src = member.image;
                document.getElementById('modalImage').alt = member.name;
                document.getElementById('modalName').textContent = member.name;
                document.getElementById('modalPosition').textContent = member.position;
                document.getElementById('modalAbout').textContent = member.about;
                document.getElementById('modalEmail').textContent = member.email;
                document.getElementById('modalPhone').textContent = member.phone;
                document.getElementById('modalLinkedin').href = member.linkedin;
                
                // Show modal
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});
