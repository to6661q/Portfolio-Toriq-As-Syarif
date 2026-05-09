import { supabase } from './supabase-config.js';

// --- 1. PROTEKSI HALAMAN ---
async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        window.location.href = 'login.html';
    }
}
checkUser();

// --- 2. FUNGSI PEMBANTU: UPLOAD GAMBAR ---
// Fungsi ini digunakan berulang kali untuk Profil, Projek, dan Sertifikat
async function uploadImage(file, folder) {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('portfolio_assets')
        .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('portfolio_assets').getPublicUrl(filePath);
    return data.publicUrl;
}

// --- 3. LOAD DATA PROFIL (SAAT HALAMAN DIBUKA) ---
async function loadProfileData() {
    const { data } = await supabase.from('profiles').select('*').eq('id', 1).single();
    if (data) {
        document.getElementById('full_name').value = data.full_name || '';
        document.getElementById('headline').value = data.headline || '';
        document.getElementById('about_text').value = data.about_text || '';
    }
}
loadProfileData();

// --- 4. HANDLE UPDATE PROFIL ---
document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('save-profile');
    btn.innerText = 'Menyimpan...';

    try {
        const file = document.getElementById('profile_img').files[0];
        const imageUrl = await uploadImage(file, 'avatars');

        const updates = {
            id: 1,
            full_name: document.getElementById('full_name').value,
            headline: document.getElementById('headline').value,
            about_text: document.getElementById('about_text').value,
            updated_at: new Date(),
        };

        if (imageUrl) updates.profile_img_url = imageUrl;

        const { error } = await supabase.from('profiles').upsert(updates);
        if (error) throw error;
        alert('Profil berhasil diperbarui!');
    } catch (err) {
        alert('Gagal: ' + err.message);
    } finally {
        btn.innerText = 'Update Profil';
    }
});

// --- 5. HANDLE TAMBAH PROJEK ---
document.getElementById('project-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = 'Mengunggah...';

    try {
        const file = document.getElementById('p-img').files[0];
        const imageUrl = await uploadImage(file, 'projects');
        
        // Mengubah string tech stack menjadi array (contoh: "PHP, Docker" jadi ["PHP", "Docker"])
        const techArray = document.getElementById('p-tech').value.split(',').map(s => s.trim());

        const { error } = await supabase.from('projects').insert([{
            title: document.getElementById('p-title').value,
            description: document.getElementById('p-desc').value,
            tech_stack: techArray,
            link_github: document.getElementById('p-link').value,
            image_url: imageUrl
        }]);

        if (error) throw error;
        alert('Projek berhasil ditambahkan!');
        e.target.reset(); // Kosongkan form
    } catch (err) {
        alert('Gagal tambah projek: ' + err.message);
    } finally {
        btn.innerText = 'Tambah Projek';
    }
});

// --- 6. HANDLE TAMBAH SERTIFIKAT ---
document.getElementById('cert-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = 'Mengunggah...';

    try {
        const file = document.getElementById('c-img').files[0];
        const imageUrl = await uploadImage(file, 'certificates');

        const { error } = await supabase.from('certificates').insert([{
            title: document.getElementById('c-title').value,
            issuer: document.getElementById('c-issuer').value,
            image_url: imageUrl,
            date_issued: new Date().toISOString().split('T')[0] // Tanggal hari ini
        }]);

        if (error) throw error;
        alert('Sertifikat berhasil disimpan!');
        e.target.reset();
    } catch (err) {
        alert('Gagal simpan sertifikat: ' + err.message);
    } finally {
        btn.innerText = 'Tambah Sertifikat';
    }
});

import { supabase } from './supabase-config.js';

// Cek User Saat Halaman Dimuat
async function checkAccess() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        window.location.href = 'login.html';
    }
}
checkAccess();

// LOGIKA LOGOUT
const btnLogout = document.getElementById('logout-btn');
if (btnLogout) {
    btnLogout.addEventListener('click', async (e) => {
        e.preventDefault(); // Mencegah reload halaman
        console.log("Mencoba logout...");
        const { error } = await supabase.auth.signOut();
        if (error) {
            alert("Error: " + error.message);
        } else {
            alert("Berhasil keluar!");
            window.location.href = 'login.html';
        }
    });
}
