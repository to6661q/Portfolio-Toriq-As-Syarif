import { supabase } from './supabase-config.js';

// 1. Cek Login
async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) window.location.href = 'login.html';
    else refreshAll();
}

// 2. Fungsi Refresh Data (Mengambil data dari Supabase dan tampilkan di List Admin)
async function refreshAll() {
    console.log("Menyinkronkan data...");
    renderTable('projects', 'list-project', 'title', 'project');
    renderTable('work_experience', 'list-work', 'job_position', 'work');
    renderTable('certifications', 'list-certification', 'name', 'cert');
    renderTable('volunteers', 'list-volunteer', 'role', 'vol');
}

async function renderTable(table, elId, key, type) {
    const { data, error } = await supabase.from(table).select('*').order('id', { ascending: false });
    const el = document.getElementById(elId);
    if (!el || error) return;

    el.innerHTML = data.map(item => `
        <div class="manage-item" style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #ddd; background:#fff;">
            <span>${item[key]}</span>
            <button onclick="window.delItem('${table}', ${item.id})" style="color:red; cursor:pointer;">Hapus</button>
        </div>`).join('');
}

// 3. Fungsi Hapus Global
window.delItem = async (table, id) => {
    if (confirm('Hapus data ini?')) {
        await supabase.from(table).delete().eq('id', id);
        refreshAll();
    }
};

// 4. Handler Submit Form (Dibuat modular agar rapi)
const handleForm = (formId, table, getPayload) => {
    const form = document.getElementById(formId);
    if (!form) return;
    form.onsubmit = async (e) => {
        e.preventDefault();
        const payload = getPayload();
        const { error } = await supabase.from(table).insert([payload]);
        if (error) alert("Gagal: " + error.message);
        else {
            alert("Berhasil ditambah!");
            form.reset();
            refreshAll();
        }
    };
};

// Inisialisasi semua form
handleForm('project-form', 'projects', () => ({
    title: document.getElementById('p-title').value,
    description: document.getElementById('p-desc').value,
    link_github: document.getElementById('p-link').value
}));

handleForm('work-form', 'work_experience', () => ({
    job_position: document.getElementById('e-title').value,
    company: document.getElementById('e-company').value,
    duration: document.getElementById('e-duration').value,
    description: document.getElementById('e-desc').value
}));

handleForm('certification-form', 'certifications', () => ({
    name: document.getElementById('c-title').value,
    publisher: document.getElementById('c-issuer').value,
    description: document.getElementById('c-desc').value
}));

handleForm('volunteer-form', 'volunteers', () => ({
    role: document.getElementById('v-title').value,
    organization: document.getElementById('v-org').value,
    duration: document.getElementById('v-duration').value,
    description: document.getElementById('v-desc').value
}));

// Submit khusus Profile (UPSERT)
document.getElementById('profile-form').onsubmit = async (e) => {
    e.preventDefault();
    await supabase.from('profiles').upsert({
        id: 1,
        headline: document.getElementById('headline').value,
        about_text: document.getElementById('about_text').value
    });
    alert("Profile Updated!");
};

checkAuth();
