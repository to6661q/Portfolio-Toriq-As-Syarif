import { supabase } from './supabase-config.js';

// 1. CEK AUTENTIKASI (Wajib di atas)
async function checkAccess() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        window.location.href = 'login.html';
    } else {
        console.log("Login sebagai:", user.email);
    }
}
checkAccess();

// 2. FUNGSI LOGOUT (Pasti Jalan)
const setupLogout = () => {
    const btn = document.getElementById('logout-btn');
    if (btn) {
        btn.onclick = async (e) => {
            e.preventDefault();
            const { error } = await supabase.auth.signOut();
            if (error) {
                alert("Gagal keluar: " + error.message);
            } else {
                alert("Berhasil keluar!");
                window.location.href = 'login.html';
            }
        };
    }
};

// 3. LOAD DATA PROFIL
async function loadData() {
    try {
        const { data } = await supabase.from('profiles').select('*').eq('id', 1).single();
        if (data) {
            if(document.getElementById('full_name')) document.getElementById('full_name').value = data.full_name || '';
            if(document.getElementById('headline')) document.getElementById('headline').value = data.headline || '';
            if(document.getElementById('about_text')) document.getElementById('about_text').value = data.about_text || '';
        }
    } catch (e) { console.log("Profil belum ada atau gagal dimuat."); }
}

// 4. HANDLE UPLOAD & UPDATE PROFIL
const profileForm = document.getElementById('profile-form');
if (profileForm) {
    profileForm.onsubmit = async (e) => {
        e.preventDefault();
        const saveBtn = document.getElementById('save-profile');
        saveBtn.innerText = 'Saving...';

        const updates = {
            id: 1,
            full_name: document.getElementById('full_name').value,
            headline: document.getElementById('headline').value,
            about_text: document.getElementById('about_text').value,
            updated_at: new Date(),
        };

        const { error } = await supabase.from('profiles').upsert(updates);
        if (error) alert("Error: " + error.message);
        else alert("Profil diperbarui!");
        saveBtn.innerText = 'Update Profil';
    };
}

// Inisialisasi Fungsi
setupLogout();
loadData();
import { supabase } from './supabase-config.js';

// Fungsi utama untuk menangani semua interaksi admin
window.onload = async () => {
    // 1. Cek User
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Logika Logout (PASTI JALAN)
    const btnLogout = document.getElementById('logout-btn');
    if (btnLogout) {
        btnLogout.addEventListener('click', async (e) => {
            e.preventDefault();
            console.log("Mencoba Keluar..."); // Cek di F12
            const { error } = await supabase.auth.signOut();
            if (error) {
                alert("Error saat keluar: " + error.message);
            } else {
                alert("Berhasil keluar!");
                window.location.href = 'login.html';
            }
        });
    } else {
        console.error("Elemen 'logout-btn' tidak ditemukan!");
    }

    // 3. Panggil fungsi load profil di sini jika ada...
};
