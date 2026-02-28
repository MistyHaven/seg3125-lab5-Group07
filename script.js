
// Booking State
const bookingState = {
    service: null,
    servicePrice: 0,
    expert: null,
    date: null,
    time: null
};

// Toggle service selection
function selectService(serviceName, price) {

    // 1️⃣ Update State
    bookingState.service = serviceName;
    bookingState.servicePrice = price;

    // 2️⃣ Remove selection from ALL service cards ONLY
    document.querySelectorAll('#services .service-card').forEach(card => {
        card.classList.remove('selected');
    });

    // 3️⃣ Reset all buttons
    document.querySelectorAll('#services .service-select-btn').forEach(btn => {
        btn.classList.remove('btn-success');
        btn.classList.add('btn-primary');
        btn.textContent = "Select Service";
    });

    // 4️⃣ Find the clicked card using the service name
    const headings = document.querySelectorAll('#services .card-title');

    for (const heading of headings) {
        if (heading.textContent.trim() === serviceName) {

            const card = heading.closest('.service-card');
            card.classList.add('selected');

            const button = card.querySelector('.service-select-btn');
            button.classList.remove('btn-primary');
            button.classList.add('btn-success');
            button.textContent = "Selected ✓";

            break;
        }
    }

    // Update Summary
    updateWizardSummary();

    // Smooth scroll to experts
    document.getElementById('experts')
        .scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function selectExpert(expertName) {
    // Update State
    bookingState.expert = expertName;

    // UI Feedback
    document.querySelectorAll('.expert-select-btn').forEach(btn => {
        btn.classList.remove('btn-success');
        btn.classList.add('btn-outline-primary');
        btn.textContent = 'Select Expert';
    });

    // Find the button that was clicked (Logic handled by onclick, but we need to find it visually)
    // We can iterate buttons to find the one matching the call or just all buttons in the carousel
    // For simplicity, let's just make sure the state is visual
    const buttons = document.querySelectorAll('.expert-select-btn');
    for (const btn of buttons) {
        if (btn.getAttribute('onclick').includes(expertName)) {
            btn.classList.remove('btn-outline-primary');
            btn.classList.add('btn-success');
            btn.textContent = 'Selected ✓';
        }
    }

    // Update Summary
    updateWizardSummary();

    // Scroll to Booking Section
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth', block: 'start' });
}


// Initialize
document.addEventListener('DOMContentLoaded', function () {
    // Initialize summary
    updateWizardSummary();
});

// Navigation: Move to next step (Date -> Personal Info)
function nextStep(stepNumber) {
    if (stepNumber === 2) { // Logic for old Step 3 -> 4 transition
        // Validation
        if (!bookingState.service) {
            alert('Please select a service from the Services section first.');
            document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
            return;
        }
        if (!bookingState.expert) {
            alert('Please select an expert from the Experts section first.');
            document.getElementById('experts').scrollIntoView({ behavior: 'smooth' });
            return;
        }

        const date = document.getElementById('bookingDate').value;
        if (!date) {
            alert('Please select a date.');
            return;
        }
        if (!bookingState.time) {
            alert('Please select a time slot.');
            return;
        }

        // Update State
        bookingState.date = date;

        // Reveal Personal Information Section
        const personalInfoSection = document.getElementById('personal-info-section');

        // Scroll to the new section
        personalInfoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Time slot selection
function selectTimeSlot(button, time) {
    // Remove active class from all time slot buttons
    document.querySelectorAll('.time-slot-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Add active class to selected button
    button.classList.add('active');
    bookingState.time = time;

    // Update the summary
    updateWizardSummary();
}

// Update wizard summary dynamically
function updateWizardSummary() {
    const service = bookingState.service ? `<strong>${bookingState.service}</strong> ($${bookingState.servicePrice})` : '<span class="text-muted">Not selected</span>';
    const expert = bookingState.expert ? `<strong>${bookingState.expert}</strong>` : '<span class="text-muted">Not selected</span>';

    const dateInput = document.getElementById('bookingDate');
    let dateTime = '<span class="text-muted">Not selected</span>';

    if (dateInput && dateInput.value) {
        const dateStr = new Date(dateInput.value).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        if (bookingState.time) {
            dateTime = `<strong>${dateStr} at ${bookingState.time}</strong>`;
        } else {
            dateTime = `${dateStr} at <span class="text-muted">Select time</span>`;
        }
    }

    const summaryDiv = document.getElementById('wizardSummary');
    if (summaryDiv) {
        summaryDiv.innerHTML = `
            <div class="row g-2">
                <div class="col-md-4">
                    <small class="text-uppercase text-muted fw-bold">Service</small>
                    <div class="fw-normal">${service}</div>
                </div>
                <div class="col-md-4">
                    <small class="text-uppercase text-muted fw-bold">Expert</small>
                    <div class="fw-normal">${expert}</div>
                </div>
                <div class="col-md-4">
                    <small class="text-uppercase text-muted fw-bold">Date & Time</small>
                    <div class="fw-normal">${dateTime}</div>
                </div>
            </div>
        `;
    }
}

// Confirm complete booking
function confirmWizardBooking() {
    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    // Final Validation
    if (!bookingState.service || !bookingState.expert || !document.getElementById('bookingDate').value || !bookingState.time || !name || !email || !phone) {
        const resultDiv = document.getElementById('wizardResult');
        resultDiv.innerHTML = `
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                <strong>Incomplete!</strong> Please ensure all selections (Service, Expert, Date, Time) and Personal Info are filled.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        return;
    }

    const resultDiv = document.getElementById('wizardResult');
    // Show success message
    resultDiv.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i>
            <strong>Booking Confirmed!</strong><br>
            Thank you <strong>${name}</strong>!<br>
            Your appointment for <strong>${bookingState.service}</strong> with <strong>${bookingState.expert}</strong><br>
            on <strong>${new Date(document.getElementById('bookingDate').value).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</strong> 
            at <strong>${bookingState.time}</strong> has been scheduled.<br>
            A confirmation email has been sent to <strong>${email}</strong>.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function myBurgerMenu(){
    var links = document.getElementById("burger_links");
    links.classList.toggle("show");
}