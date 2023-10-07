document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    // Simulated user data (replace with your actual user data)
    const users = [
        { username: 'user1', password: 'password1' },
        { username: 'user2', password: 'password2' },
        // Add more user objects as needed
    ];

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Find a user with the entered username
        const user = users.find((u) => u.username === username
