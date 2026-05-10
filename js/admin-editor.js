import { supabase } from './supabase-config.js';

let editingId = { work: null, certification: null, volunteer: null, project: null };

// --- PROTECTIONS ---
async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) window.location.href = 'login.html';
}
checkUser();

document.getElementById('logout-btn').onclick = async () => {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
};

// --- HELPER: UPLOAD ---
async function handleUpload(file, folder) {
    if (!file) return null;
    const path = `${folder}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('portfolio_assets').upload(path, file);
    if (error) return null;
    const { data } = supabase.storage.from('portfolio_assets').getPublicUrl(path);
    return data.publicUrl;
}

// --- REFRESH & RENDER ---
async function refreshLists() {
    renderSection('projects', 'list-project', 'title', 'project');
    renderSection('work_experience', 'list-work', 'job_position', 'work');
    renderSection('certifications', 'list-certification', 'name', 'certification');
    renderSection('volunteers', 'list-volunteer', 'role', 'volunteer');
}

async function renderSection(table, elementId, key, type) {
    const { data } = await supabase.from(table).select('*').order('id', { ascending: false });
    const el = document.getElementById(elementId);
    if (!el) return;

    if (document.getElementById(`total-${type}`)) {
        document.getElementById(`total-${type}`).innerText = data?.length || 0;
    }

    el.innerHTML = `<h4 class="list-head">Inputted Records:</h4>`;
    data?.forEach(item => {
        const div = document.createElement('div');
        div.className = 'manage-item';
        div.innerHTML = `
            <span>${item[key]}</span>
            <div class="actions">
                <button class="btn-edit" onclick="setupEdit('${type}', ${item.id})">Edit</button>
                <button class="btn-delete" onclick="deleteItem('${table}', ${item.id})">Delete</button>
            </div>`;
        el.appendChild(div);
    });
}

// --- GLOBAL ACTIONS ---
window.deleteItem = async (table, id) => {
    if (confirm('Delete this record?')) {
        await supabase.from(table).delete().eq('id', id);
        refreshLists();
    }
};

window.setupEdit = async (type, id) => {
    const tableMap = { project: 'projects', work: 'work_experience', certification: 'certifications', volunteer: 'volunteers' };
    const { data: item } = await supabase.from(tableMap[type]).select('*').eq('id', id).single();
    
    if (item) {
        editingId[type] = item.id;
        if (type === 'work') {
            document.getElementById('e-title').value = item.job_position;
            document.getElementById('e-company').value = item.company;
            document.getElementById('e-duration').value = item.duration;
            document.getElementById('e-desc').value = item.description;
            document.querySelector('#exp-form button').innerText = "Update Work Experience";
        } else if (type === 'certification') {
            document.getElementById('c-title').value = item.name;
            document.getElementById('c-issuer').value = item.publisher;
            document.getElementById('c-desc').value = item.description;
            document.querySelector('#cert-form button').innerText = "Update Certification";
        } else if (type === 'volunteer') {
            document.getElementById('v-title').value = item.role;
            document.getElementById('v-org').value = item.organization;
            document.getElementById('v-duration').value = item.duration;
            document.getElementById('v-desc').value = item.description;
            document.querySelector('#volunteer-form button').innerText = "Update Volunteer";
        }
        document.getElementById(type).scrollIntoView({ behavior: 'smooth' });
    }
};

// --- FORM SUBMITS ---

// Work Experience
document.getElementById('exp-form').onsubmit = async (e) => {
    e.preventDefault();
    const imgUrl = await handleUpload(document.getElementById('e-img').files[0], 'work');
    const payload = {
        job_position: document.getElementById('e-title').value,
        company: document.getElementById('e-company').value,
        duration: document.getElementById('e-duration').value,
        description: document.getElementById('e-desc').value
    };
    if (imgUrl) payload.image_url = imgUrl;

    if (editingId.work) {
        await supabase.from('work_experience').update(payload).eq('id', editingId.work);
        editingId.work = null;
    } else {
        await supabase.from('work_experience').insert([payload]);
    }
    e.target.reset(); e.target.querySelector('button').innerText = "Add Work Experience";
    refreshLists(); alert("Success!");
};

// Certifications
document.getElementById('cert-form').onsubmit = async (e) => {
    e.preventDefault();
    const imgUrl = await handleUpload(document.getElementById('c-img').files[0], 'certs');
    const payload = {
        name: document.getElementById('c-title').value,
        publisher: document.getElementById('c-issuer').value,
        description: document.getElementById('c-desc').value
    };
    if (imgUrl) payload.image_url = imgUrl;

    if (editingId.certification) {
        await supabase.from('certifications').update(payload).eq('id', editingId.certification);
        editingId.certification = null;
    } else {
        await supabase.from('certifications').insert([payload]);
    }
    e.target.reset(); e.target.querySelector('button').innerText = "Add Certificate";
    refreshLists(); alert("Success!");
};

// Volunteer
document.getElementById('volunteer-form').onsubmit = async (e) => {
    e.preventDefault();
    const imgUrl = await handleUpload(document.getElementById('v-img').files[0], 'volunteer');
    const payload = {
        role: document.getElementById('v-title').value,
        organization: document.getElementById('v-org').value,
        duration: document.getElementById('v-duration').value,
        description: document.getElementById('v-desc').value
    };
    if (imgUrl) payload.image_url = imgUrl;

    if (editingId.volunteer) {
        await supabase.from('volunteers').update(payload).eq('id', editingId.volunteer);
        editingId.volunteer = null;
    } else {
        await supabase.from('volunteers').insert([payload]);
    }
    e.target.reset(); e.target.querySelector('button').innerText = "Add Volunteer";
    refreshLists(); alert("Success!");
};

window.onload = refreshLists;
