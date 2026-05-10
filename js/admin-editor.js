import { supabase } from './supabase-config.js';

console.log("Script Admin Editor Dimulai...");

// --- 1. CEK STATUS LOGIN ---
async function checkUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
        alert("Sesi Login Habis / Tidak Terdeteksi. Silakan Login Kembali.");
        window.location.href = 'login.html';
    } else {
        console.log("User Terautentikasi:", user.email);
        refreshLists();
    }
}

// --- 2. FUNGSI REFRESH (DENGAN ALERT ERROR) ---
async function refreshLists() {
    console.log("Memulai Refresh Data...");
    
    // Project
    const { data: projs, error: pErr } = await supabase.from('projects').select('*').order('id', { ascending: false });
    if (pErr) console.error("Gagal muat Projects:", pErr.message);
    render('list-project', projs, 'projects', 'title', 'project');

    // Work
    const { data: exps, error: wErr } = await supabase.from('work_experience').select('*').order('id', { ascending: false });
    if (wErr) console.error("Gagal muat Work:", wErr.message);
    render('list-work', exps, 'work_experience', 'job_position', 'work');

    // Certification
    const { data: certs, error: cErr } = await supabase.from('certifications').select('*').order('id', { ascending: false });
    if (cErr) console.error("Gagal muat Certs:", cErr.message);
    render('list-certification', certs, 'certifications', 'name', 'certification');

    // Volunteer
    const { data: vols, error: vErr } = await supabase.from('volunteers').select('*').order('id', { ascending: false });
    if (vErr) console.error("Gagal muat Vol:", vErr.message);
    render('list-volunteer', vols, 'volunteers', 'role', 'volunteer');
}

function render(id, data, table, key, type) {
    const el = document.getElementById(id);
    if (!el) {
        console.warn(`Elemen dengan ID ${id} tidak ditemukan di HTML!`);
        return;
    }
    
    const counter = document.getElementById(`total-${type}`);
    if (counter) counter.innerText = data?.length || 0;

    el.innerHTML = `<h4 class="list-head">Data Tersimpan:</h4>`;
    if (!data || data.length === 0) {
        el.innerHTML += `<p style="color:gray; font-style:italic; padding:10px;">Belum ada data.</p>`;
        return;
    }

    el.innerHTML += data.map(item => `
        <div class="manage-item" style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #eee;">
            <span>${item[key]}</span>
            <button onclick="window.deleteItem('${table}', ${item.id})" style="background:#ff4757; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Hapus</button>
        </div>
    `).join('');
}

// --- 3. AKSI GLOBAL ---
window.deleteItem = async (table, id) => {
    if (confirm('Hapus data ini?')) {
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) alert("Gagal Hapus: " + error.message);
        refreshLists();
    }
};

// --- 4. HANDLER SUBMIT (DENGAN ALERT STATUS) ---
const projectForm = document.getElementById('project-form');
if (projectForm) {
    projectForm.onsubmit = async (e) => {
        e.preventDefault();
        alert("Tombol Add Project Diklik! Memulai proses simpan...");

        const payload = {
            title: document.getElementById('p-title').value,
            tech_stack: document.getElementById('p-tech').value.split(',').map(t => t.trim()),
            description: document.getElementById('p-desc').value,
            link_github: document.getElementById('p-link').value
        };

        console.log("Mengirim Payload:", payload);

        const { data, error } = await supabase.from('projects').insert([payload]);

        if (error) {
            console.error("Error Supabase:", error);
            alert("GAGAL SIMPAN: " + error.message + "\n\nCek apakah nama tabel 'projects' sudah benar di database.");
        } else {
            alert("BERHASIL! Data telah masuk ke database.");
            e.target.reset();
            refreshLists();
        }
    };
}

// Handler untuk form lain (Work, Cert, Volunteer) mengikuti pola yang sama...

// Jalankan pengecekan user saat halaman dimuat
checkUser();
