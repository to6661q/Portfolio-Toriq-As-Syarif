import { supabase } from './supabase-config.js';
const loginForm = document.getElementById('login-form');
const messageDiv = document.getElementById('message');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btn = document.getElementById('login-btn');
    btn.innerText = 'Authenticating...';
    btn.disabled = true;
    // LOGIN PROCESS TO SUPABASE
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });
    if (error) {
        messageDiv.innerText = "Login gagal: " + error.message;
        btn.innerText = 'Sign In';
        btn.disabled = false;
    } else {
        // SUCCESS! LOGIN TO DASHBOARD ADMIN
        window.location.href = 'admin.html';
    }
});
// LOGOUT FUNCTION (Can be called from the logout button in admin.html)
export async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    window.location.href = 'login.html';
}
