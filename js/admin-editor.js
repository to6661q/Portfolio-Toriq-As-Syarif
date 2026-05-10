import { supabase } from './supabase-config.js';

// Objek untuk melacak ID data yang sedang diedit
let editState = {
    project: null,
    work: null,
    certification: null,
    volunteer: null
};

// --- PROTECTIONS ---
async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) window.location.href = 'login.html';
}
checkAuth();

document.getElementById('logout-btn').onclick = async () => {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
};

// --- HELPER: UPLOAD ---
async function handleUpload(file, folder) {
    if (!file) return null;
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${folder}/${fileName}`;
    const { error } = await supabase.storage.from('portfolio_assets').upload(filePath, file);
    if (error) {
        console.error("Upload error:", error.message);
        return null;
    }
    const { data } = supabase.storage.from('portfolio_assets').getPublicUrl(filePath);
    return data.publicUrl;
}

// --- REFRESH SEMUA LIST (DENGAN PENGAMAN) ---
async function refreshAll() {
    console.log("Memulai sinkronisasi data...");
    // Gunakan try-catch per bagian agar jika satu gagal, yang lain tetap tampil
    await renderSection('projects', 'list-project', 'title', 'project');
    await renderSection('work_experience', 'list-work', 'job_position', 'work');
    await renderSection('certifications', 'list-certification', 'name', 'certification');
    await renderSection('volunteers', 'list-volunteer', 'role', 'volunteer');
}

async function renderSection(table, elId, key, type) {
    try {
        const { data, error } = await supabase.from(table).select('*').order('id', { ascending: false });
        const el = document.getElementById(elId);
        if (!el) return;

        if (error) throw error;

        // Update Counter (total-project, total-work, dll)
        const counter = document.getElementById(`total-${type}`);
        if (counter) counter.innerText = data?.length || 0;

        el.innerHTML = `<h4 class="list-head">Data Tersimpan:</h4>`;
        if (!data || data.length === 0) {
            el.innerHTML += `<p style="color:gray; font-style:italic; padding:10px;">Belum ada data.</p>`;
            return;
        }

        el.innerHTML += data.map(item => `
            <div class="manage-item" style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid #eee;">
                <span>${item[key]}</span>
                <div class="actions">
                    <button type="button" onclick="window.prepareEdit('${type}', ${item.id})">Edit</button>
                    <button type="button" onclick="window.deleteItem('${table}', ${item.id})" style="background:#ff4757; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; margin-left:5px;">Del</button>
                </div>
            </div>`).join('');
    } catch (err) {
        console.error(`Gagal memuat tabel ${table}:`, err.message);
    }
}

// --- AKSI GLOBAL ---
window.deleteItem = async (table, id) => {
    if (confirm('Hapus data ini?')) {
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) alert("Gagal hapus: " + error.message);
        refreshAll();
    }
};

window.prepareEdit = async (type, id) => {
    const tableMap = { project: 'projects', work: 'work_experience', certification: 'certifications', volunteer: 'volunteers' };
    const { data, error } = await supabase.from(tableMap[type]).select('*').eq('id', id).single();
    
    if (data) {
        editState[type] = data.id;
        // Mapping data ke form sesuai standar baku
        if (type === 'project') {
            document.getElementById('p-title').value = data.title;
            document.getElementById('p-tech').value = data.tech_stack?.join(', ') || '';
            document.getElementById('p-desc').value = data.description;
            document.getElementById('p-link').value = data.link_github;
            document.querySelector('#project-form button').innerText = "Update Project";
        } else if (type === 'work') {
            document.getElementById('e-title').value = data.job_position;
            document.getElementById('e-company').value = data.company;
            document.getElementById('e-duration').value = data.duration;
            document.getElementById('e-desc').value = data.description;
            document.querySelector('#exp-form button').innerText = "Update Work Experience";
        } else if (type === 'certification') {
            document.getElementById('c-title').value = data.name;
            document.getElementById('c-issuer').value = data.publisher;
            document.getElementById('c-desc').value = data.description;
            document.querySelector('#cert-form button').innerText = "Update Certification";
        } else if (type === 'volunteer') {
            document.getElementById('v-title').value = data.role;
            document.getElementById('v-org').value = data.organization;
            document.getElementById('v-duration').value = data.duration;
            document.getElementById('v-desc').value = data.description;
            document.querySelector('#volunteer-form button').innerText = "Update Volunteer";
        }
        document.getElementById(type).scrollIntoView({ behavior: 'smooth' });
    }
};

// --- FORM SUBMIT HANDLERS ---

// 1. Profile
document.getElementById('profile-form').onsubmit = async (e) => {
    e.preventDefault();
    await supabase.from('profiles').upsert({
        id: 1,
        full_name: "Toriq As Syarif",
        headline: document.getElementById('headline').value,
        about_text: document.getElementById('about_text').value
    });
    alert("Profile Updated!");
};

// 2. Project
document.getElementById('project-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = "Processing...";
    const img = await handleUpload(document.getElementById('p-img').files[0], 'projects');
    const payload = {
        title: document.getElementById('p-title').value,
        tech_stack: document.getElementById('p-tech').value.split(',').map(t => t.trim()),
        description: document.getElementById('p-desc').value,
        link_github: document.getElementById('p-link').value
    };
    if (img) payload.image_url = img;

    if (editState.project) {
        await supabase.from('projects').update(payload).eq('id', editState.project);
        editState.project = null;
    } else {
        await supabase.from('projects').insert([payload]);
    }
    btn.innerText = "Add Project";
    e.target.reset(); refreshAll(); alert("Success!");
};

// 3. Work Experience
document.getElementById('exp-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = "Processing...";
    const img = await handleUpload(document.getElementById('e-img').files[0], 'work');
    const payload = {
        job_position: document.getElementById('e-title').value,
        company: document.getElementById('e-company').value,
        duration: document.getElementById('e-duration').value,
        description: document.getElementById('e-desc').value
    };
    if (img) payload.image_url = img;

    if (editState.work) {
        await supabase.from('work_experience').update(payload).eq('id', editState.work);
        editState.work = null;
    } else {
        await supabase.from('work_experience').insert([payload]);
    }
    btn.innerText = "Add Work Experience";
    e.target.reset(); refreshAll(); alert("Work Added!");
};

// 4. Certification
document.getElementById('cert-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = "Processing...";
    const img = await handleUpload(document.getElementById('c-img').files[0], 'certs');
    const payload = {
        name: document.getElementById('c-title').value,
        publisher: document.getElementById('c-issuer').value,
        description: document.getElementById('c-desc').value
    };
    if (img) payload.image_url = img;

    if (editState.certification) {
        await supabase.from('certifications').update(payload).eq('id', editState.certification);
        editState.certification = null;
    } else {
        await supabase.from('certifications').insert([payload]);
    }
    btn.innerText = "Add Certificate";
    e.target.reset(); refreshAll(); alert("Certification Added!");
};

// 5. Volunteer
document.getElementById('volunteer-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = "Processing...";
    const img = await handleUpload(document.getElementById('v-img').files[0], 'volunteer');
    const payload = {
        role: document.getElementById('v-title').value,
        organization: document.getElementById('v-org').value,
        duration: document.getElementById('v-duration').value,
        description: document.getElementById('v-desc').value
    };
    if (img) payload.image_url = img;

    if (editState.volunteer) {
        await supabase.from('volunteers').update(payload).eq('id', editState.volunteer);
        editState.volunteer = null;
    } else {
        await supabase.from('volunteers').insert([payload]);
    }
    btn.innerText = "Add Volunteer";
    e.target.reset(); refreshAll(); alert("Volunteer Experience Added!");
};

window.onload = refreshAll;
