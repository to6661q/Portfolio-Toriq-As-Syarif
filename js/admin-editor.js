import { supabase } from './supabase-config.js';

// --- 1. PROTEKSI & LOGOUT ---
async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) window.location.href = 'login.html';
}
checkUser();

document.getElementById('logout-btn').onclick = async () => {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
};

// --- 2. HELPER: UPLOAD GAMBAR ---
async function handleUpload(file, folder) {
    if (!file) return null;
    const path = `${folder}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('portfolio_assets').upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from('portfolio_assets').getPublicUrl(path);
    return data.publicUrl;
}

// --- 3. FUNGSI FETCH & RENDER (MANAGE DATA) ---
async function refreshLists() {
    // Projek
    const { data: projs } = await supabase.from('projects').select('*').order('id', { ascending: false });
    renderList('list-projek', projs, 'projects', 'title');

    // Pengalaman
    const { data: exps } = await supabase.from('work_experience').select('*').order('id', { ascending: false });
    renderList('list-pengalaman', exps, 'work_experience', 'job_title');

    // Sertifikat
    const { data: certs } = await supabase.from('certificates').select('*').order('id', { ascending: false });
    renderList('list-sertifikat', certs, 'certificates', 'title');
}

function renderList(containerId, data, table, displayKey) {
    const container = document.getElementById(containerId);
    container.innerHTML = `<h4 class="list-head">Daftar Terinput:</h4>`;
    data?.forEach(item => {
        const div = document.createElement('div');
        div.className = 'manage-item';
        div.innerHTML = `
            <span>${item[displayKey]}</span>
            <button class="btn-delete" data-id="${item.id}" data-table="${table}">Hapus</button>
        `;
        container.appendChild(div);
    });

    // Event Listener Hapus
    container.querySelectorAll('.btn-delete').forEach(btn => {
        btn.onclick = async () => {
            if (confirm('Hapus data ini?')) {
                const { error } = await supabase.from(btn.dataset.table).delete().eq('id', btn.dataset.id);
                if (!error) refreshLists();
            }
        };
    });
}

// --- 4. EVENT LISTENERS FORM ---

// Profil
document.getElementById('profile-form').onsubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('profiles').upsert({
        id: 1,
        headline: document.getElementById('headline').value,
        about_text: document.getElementById('about_text').value,
        updated_at: new Date()
    });
    alert(error ? error.message : "Profil diperbarui!");
};

// Projek
document.getElementById('project-form').onsubmit = async (e) => {
    e.preventDefault();
    try {
        const img = await handleUpload(document.getElementById('p-img').files[0], 'projects');
        const techs = document.getElementById('p-tech').value.split(',').map(t => t.trim());
        await supabase.from('projects').insert([{
            title: document.getElementById('p-title').value,
            description: document.getElementById('p-tech').value,
            tech_stack: techs,
            link_github: document.getElementById('p-link').value,
            image_url: img
        }]);
        e.target.reset(); refreshLists(); alert("Projek ditambah!");
    } catch (err) { alert(err.message); }
};

// Pengalaman
document.getElementById('exp-form').onsubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('work_experience').insert([{
        job_title: document.getElementById('e-title').value,
        company: document.getElementById('e-company').value,
        duration: document.getElementById('e-duration').value,
        description: document.getElementById('e-desc').value
    }]);
    if (!error) { e.target.reset(); refreshLists(); alert("Pengalaman ditambah!"); }
};

// Sertifikat
document.getElementById('cert-form').onsubmit = async (e) => {
    e.preventDefault();
    try {
        const img = await handleUpload(document.getElementById('c-img').files[0], 'certificates');
        await supabase.from('certificates').insert([{
            title: document.getElementById('c-title').value,
            issuer: document.getElementById('c-issuer').value,
            image_url: img
        }]);
        e.target.reset(); refreshLists(); alert("Sertifikat ditambah!");
    } catch (err) { alert(err.message); }
};

// Start
window.onload = refreshLists;
