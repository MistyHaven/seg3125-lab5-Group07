// Toggle service selection
function toggleService(button) {
    // Get the card that contains this button
    const card = button.closest('.card');
    
    // Check if the card is already selected
    const isSelected = card.classList.contains('selected');
    
    if (isSelected) {
        // If selected, deselect it
        card.classList.remove('selected');
        button.classList.remove('selected');
        button.textContent = 'Select Service';
    } else {
        // If not selected, select it
        card.classList.add('selected');
        button.classList.add('selected');
        button.textContent = 'Selected ✓';
    }
}