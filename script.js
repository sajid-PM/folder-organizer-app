document.getElementById("folderForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const folderPath = document.getElementById("folder_path").value;

    fetch('/organize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ folder_path: folderPath })
    })
    .then(response => response.json())
    .then(data => {
        const messageDiv = document.getElementById("message");
        messageDiv.style.display = 'block';
        if (data.success) {
            messageDiv.textContent = data.message;
            messageDiv.className = 'success';
        } else {
            messageDiv.textContent = data.message;
            messageDiv.className = 'error';
        }
    })
    .catch((error) => {
        const messageDiv = document.getElementById("message");
        messageDiv.style.display = 'block';
        messageDiv.textContent = "An error occurred: " + error.message;
        messageDiv.className = 'error';
    });
});
