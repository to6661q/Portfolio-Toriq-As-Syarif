import { supabase } from './supabase-config.js';

// Variabel untuk melacak data yang sedang diedit
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

// --- HELPER: UPLOAD ---
async function handleUpload(file, folder) {
    if (!file) return null;
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${folder}/${fileName}`;
    const { error } = await supabase.storage.from('portfolio_assets').upload(filePath, file);
    if (error) return null;
    const { data } = supabase.storage.from('portfolio_assets').getPublicUrl(filePath);
    return data.publicUrl;
}

// --- REFRESH SEMUA LIST ---
async function refreshAll() {
    renderList('projects', 'list-project', 'title', 'project');
    renderList('work_experience', 'list-work', 'job_position', 'work');
    renderList('certifications', 'list-certification', 'name', 'certification');
    renderList('volunteers', 'list-volunteer', 'role', 'volunteer');
}

async function renderList(table, elId, key, type) {
    const { data } = await supabase.from(table).select('*').order('id', { ascending: false });
    const el = document.getElementById(elId);
    if (!el) return;

    if (document.getElementById(`total-${type}`)) {
        document.getElementById(`total-${type}`).innerText = data?.length || 0;
    }

    el.innerHTML = `<h4 class="list-head">Tersimpan:</h4>`;
    data?.forEach(item => {
        const div = document.createElement('div');
        div.className = 'manage-item';
        div.style = "display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #eee;";
        div.innerHTML = `
            <span>${item[key]}</span>
            <div class="actions">
                <button onclick="window.prepareEdit('${type}', ${item.id})">Edit</button>
                <button onclick="window.deleteItem('${table}', ${item.id})" style="background:red; color:white">Del</button>
            </div>`;
        el.appendChild(div);
    });
}

// --- AKSI GLOBAL ---
window.deleteItem = async (table, id) => {
    if (confirm('Hapus data ini?')) {
        await supabase.from(table).delete().eq('id', id);
        refreshAll();
    }
};

window.prepareEdit = async (type, id) => {
    const tableMap = { project: 'projects', work: 'work_experience', certification: 'certifications', volunteer: 'volunteers' };
    const { data } = await supabase.from(tableMap[type]).select('*').eq('id', id).single();
    
    if (data) {
        editState[type] = data.id;
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
            document.querySelector('#exp-form button').innerText = "Update Work";
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

// --- FORM SUBMITS ---

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
    e.target.reset(); e.target.querySelector('button').innerText = "Add Project";
    refreshAll();
};

// 3. Work
document.getElementById('exp-form').onsubmit = async (e) => {
    e.preventDefault();
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
    e.target.reset(); e.target.querySelector('button').innerText = "Add Work Experience";
    refreshAll();
};

// 4. Certification
document.getElementById('cert-form').onsubmit = async (e) => {
    e.preventDefault();
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
    e.target.reset(); e.target.querySelector('button').innerText = "Add Certificate";
    refreshAll();
};

// 5. Volunteer
document.getElementById('volunteer-form').onsubmit = async (e) => {
    e.preventDefault();
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
    e.target.reset(); e.target.querySelector('button').innerText = "Add Volunteer";
    refreshAll();
};

window.onload = refreshAll;
