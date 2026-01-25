// Career Page JavaScript

// Filter functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
    loadJobPositions();
});

// Initialize filter checkboxes event listeners
function initializeFilters() {
    const filterCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
}

// Apply filters to position boxes
function applyFilters() {
    const positionBoxes = document.querySelectorAll('.position-box');
    
    // Get all active filters
    const activeFilters = {
        location: getActiveFilters('location'),
        department: getActiveFilters('department'),
        roleType: getActiveFilters('role-type'),
        experience: getActiveFilters('experience'),
        skills: getActiveFilters('skills')
    };
    
    // Check if any filters are active
    const hasActiveFilters = Object.values(activeFilters).some(filters => filters.length > 0);
    
    positionBoxes.forEach(box => {
        if (!hasActiveFilters) {
            box.classList.remove('hidden');
            return;
        }
        
        const boxLocation = box.getAttribute('data-location');
        const boxDepartment = box.getAttribute('data-department');
        const boxRoleType = box.getAttribute('data-role-type');
        const boxExperience = box.getAttribute('data-experience');
        
        // Check if box matches all active filter categories
        const matchesLocation = activeFilters.location.length === 0 || activeFilters.location.includes(boxLocation);
        const matchesDepartment = activeFilters.department.length === 0 || activeFilters.department.includes(boxDepartment);
        const matchesRoleType = activeFilters.roleType.length === 0 || activeFilters.roleType.includes(boxRoleType);
        const matchesExperience = activeFilters.experience.length === 0 || activeFilters.experience.includes(boxExperience);
        
        if (matchesLocation && matchesDepartment && matchesRoleType && matchesExperience) {
            box.classList.remove('hidden');
        } else {
            box.classList.add('hidden');
        }
    });
    
    // Show "no results" message if needed
    updateNoResultsMessage();
}

// Get active filter values by filter name
function getActiveFilters(filterName) {
    const checkboxes = document.querySelectorAll(`input[name="${filterName}"]:checked`);
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

// Update no results message
function updateNoResultsMessage() {
    const positionsGrid = document.getElementById('positionsGrid');
    const visibleBoxes = positionsGrid.querySelectorAll('.position-box:not(.hidden)');
    
    let noResultsMsg = positionsGrid.querySelector('.no-results-message');
    
    if (visibleBoxes.length === 0) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results-message';
            noResultsMsg.innerHTML = `
                <p style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #666; font-size: 1.1rem;">
                    No positions match your filters. Try adjusting your criteria.
                </p>
            `;
            positionsGrid.appendChild(noResultsMsg);
        }
    } else {
        if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }
}

// Clear all filters
function clearAllJobFilters() {
    const filterCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    filterCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    applyFilters();
}

// Load job positions from JSON (optional - if you want to dynamically load positions)
async function loadJobPositions() {
    try {
        const response = await fetch('JSON_files/job_position_list.json');
        const data = await response.json();
        
        // Store data globally for potential use
        window.jobPositionsData = data;
        
        console.log('Job positions loaded:', data);
    } catch (error) {
        console.error('Error loading job positions:', error);
    }
}

// Open application modal for specific position
function openApplicationModal(positionTitle) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('applicationModal');
    
    if (!modal) {
        modal = createApplicationModal();
        document.body.appendChild(modal);
    }
    
    // Update modal title
    const modalTitle = modal.querySelector('.modal-position-title');
    if (modalTitle) {
        modalTitle.textContent = positionTitle;
    }
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Open general application modal
function openGeneralApplicationModal() {
    openApplicationModal('General Application');
}

// Create application modal
function createApplicationModal() {
    const modal = document.createElement('div');
    modal.id = 'applicationModal';
    modal.className = 'application-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeApplicationModal()"></div>
        <div class="modal-content">
            <button class="modal-close-btn" onclick="closeApplicationModal()">&times;</button>
            
            <h2 class="modal-position-title">Position Application</h2>
            
            <form class="application-form" onsubmit="submitApplication(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label for="firstName">First Name *</label>
                        <input type="text" id="firstName" name="firstName" required>
                    </div>
                    <div class="form-group">
                        <label for="lastName">Last Name *</label>
                        <input type="text" id="lastName" name="lastName" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="email">Email *</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="phone">Phone *</label>
                        <input type="tel" id="phone" name="phone" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="resume">Resume/CV *</label>
                    <input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" required>
                </div>
                
                <div class="form-group">
                    <label for="portfolio">Portfolio (Optional)</label>
                    <input type="url" id="portfolio" name="portfolio" placeholder="https://...">
                </div>
                
                <div class="form-group">
                    <label for="coverLetter">Cover Letter</label>
                    <textarea id="coverLetter" name="coverLetter" rows="5" placeholder="Tell us why you're a great fit..."></textarea>
                </div>
                
                <div class="form-group">
                    <label for="experience">Years of Experience *</label>
                    <select id="experience" name="experience" required>
                        <option value="">Select...</option>
                        <option value="fresher">Fresher</option>
                        <option value="1-3">1-3 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="5-10">5-10 years</option>
                        <option value="10+">10+ years</option>
                    </select>
                </div>
                
                <button type="submit" class="submit-application-btn">Submit Application</button>
            </form>
        </div>
    `;
    
    // Add styles for modal
    addModalStyles();
    
    return modal;
}

// Close application modal
function closeApplicationModal() {
    const modal = document.getElementById('applicationModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Reset form
        const form = modal.querySelector('.application-form');
        if (form) {
            form.reset();
        }
    }
}

// Submit application
function submitApplication(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    console.log('Application submitted:', data);
    
    // Show success message
    alert('Thank you for your application! We will review it and get back to you soon.');
    
    // Close modal
    closeApplicationModal();
}

// Add modal styles
function addModalStyles() {
    if (document.getElementById('modalStyles')) return;
    
    const style = document.createElement('style');
    style.id = 'modalStyles';
    style.textContent = `
        .application-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            position: relative;
            background: #fff;
            border-radius: 16px;
            max-width: 700px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            padding: 40px;
            z-index: 1;
        }
        
        .modal-close-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            font-size: 2rem;
            color: #666;
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        
        .modal-close-btn:hover {
            background: #f0f0f0;
            color: #2563eb;
        }
        
        .modal-position-title {
            font-size: 2rem;
            font-weight: 700;
            color: #111;
            margin-bottom: 30px;
        }
        
        .application-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        
        .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .form-group label {
            font-size: 0.95rem;
            font-weight: 600;
            color: #333;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
            padding: 12px 15px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 1rem;
            font-family: inherit;
            transition: border-color 0.3s ease;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #2563eb;
        }
        
        .form-group input[type="file"] {
            padding: 10px;
        }
        
        .submit-application-btn {
            padding: 16px 40px;
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            color: #fff;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 10px;
        }
        
        .submit-application-btn:hover {
            background: #111;
            transform: scale(1.02);
        }
        
        @media (max-width: 768px) {
            .modal-content {
                padding: 30px 20px;
            }
            
            .form-row {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            
            .modal-position-title {
                font-size: 1.6rem;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeApplicationModal();
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
