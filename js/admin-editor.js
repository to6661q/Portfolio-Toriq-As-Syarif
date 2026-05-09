import { supabase } from './supabase-config.js';

// 1. CEK AUTENTIKASI (PENTING!)
async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        window.location.href = 'login.html'; // Tendang jika belum login
    }
}
checkUser();

// 2. LOAD DATA LAMA (Agar tidak kosong saat form dibuka)
async function loadData() {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', 1).single();
    if (data) {
        document.getElementById('full_name').value = data.full_name;
        document.getElementById('headline').value = data.headline;
        document.getElementById('about_text').value = data.about_text;
    }
}
loadData();

// 3. PROSES SIMPAN & UPLOAD
document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('save-btn');
    btn.innerText = 'Menyimpan...';

    const file = document.getElementById('profile_img').files[0];
    let imageUrl = '';

    // A. Proses Upload Gambar jika ada file yang dipilih
    if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `profile-${Math.random()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('portfolio_assets')
            .upload(filePath, file);

        if (!uploadError) {
            const { data: publicUrlData } = supabase.storage
                .from('portfolio_assets')
                .getPublicUrl(filePath);
            imageUrl = publicUrlData.publicUrl;
        }
    }

    // B. Proses Update Tabel Profiles
    const updates = {
        id: 1, // Kita asumsikan update baris pertama
        full_name: document.getElementById('full_name').value,
        headline: document.getElementById('headline').value,
        about_text: document.getElementById('about_text').value,
        updated_at: new Date(),
    };

    if (imageUrl) updates.profile_img_url = imageUrl;

    const { error } = await supabase.from('profiles').upsert(updates);

    if (error) {
        alert('Gagal menyimpan: ' + error.message);
    } else {
        alert('Profil berhasil diperbarui!');
    }
    btn.innerText = 'Simpan Perubahan';
});
