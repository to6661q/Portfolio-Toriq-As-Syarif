import { supabase } from './supabase-config.js';

let editId = { project: null, work: null, certification: null, volunteer: null };

// --- PROTECTIONS ---
async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) window.location.href = 'login.html';
    else refreshAll();
}

document.getElementById('logout-btn').onclick = async () => {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
};

// --- UPLOAD ---
async function handleUpload(file, folder) {
    if (!file) return null;
    const path = `${folder}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('portfolio_assets').upload(path, file);
    if (error) return null;
    const { data } = supabase.storage.from('portfolio_assets').getPublicUrl(path);
    return data.publicUrl;
}

// --- REFRESH ---
async function refreshAll() {
    renderTable('projects', 'list-project', 'title', 'project');
    renderTable('work_experience', 'list-work', 'job_position', 'work');
    renderTable('certifications', 'list-certification', 'name', 'certification');
    renderTable('volunteers', 'list-volunteer', 'role', 'volunteer');
}

async function renderTable(table, elId, key, type) {
    const { data } = await supabase.from(table).select('*').order('id', { ascending: false });
    const el = document.getElementById(elId);
    if (!el) return;
    
    if(document.getElementById(`total-${type}`)) document.getElementById(`total-${type}`).innerText = data?.length || 0;

    el.innerHTML = data.map(item => `
        <div class="manage-item" style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #ddd;">
            <span>${item[key]}</span>
            <div>
                <button onclick="window.startEdit('${type}', ${item.id})">Edit</button>
                <button onclick="window.delItem('${table}', ${item.id})" style="color:red">Del</button>
            </div>
        </div>`).join('');
}

// --- ACTIONS ---
window.delItem = async (table, id) => {
    if(confirm('Hapus?')) {
        await supabase.from(table).delete().eq('id', id);
        refreshAll();
    }
};

window.startEdit = async (type, id) => {
    const map = { project: 'projects', work: 'work_experience', certification: 'certifications', volunteer: 'volunteers' };
    const { data } = await supabase.from(map[type]).select('*').eq('id', id).single();
    if (data) {
        editId[type] = data.id;
        if (type === 'project') {
            document.getElementById('p-title').value = data.title;
            document.getElementById('p-tech').value = data.tech_stack?.join(', ');
            document.getElementById('p-desc').value = data.description;
            document.getElementById('p-link').value = data.link_github;
            document.querySelector('#project-form button').innerText = "Update Project";
        } else if (type === 'work') {
            document.getElementById('e-title').value = data.job_position;
            document.getElementById('e-company').value = data.company;
            document.getElementById('e-duration').value = data.duration;
            document.getElementById('e-desc').value = data.description;
            document.querySelector('#work-form button').innerText = "Update Work";
        } else if (type === 'certification') {
            document.getElementById('c-title').value = data.name;
            document.getElementById('c-issuer').value = data.publisher;
            document.getElementById('c-desc').value = data.description;
            document.querySelector('#certification-form button').innerText = "Update Cert";
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

// --- SUBMITS ---
document.getElementById('profile-form').onsubmit = async (e) => {
    e.preventDefault();
    await supabase.from('profiles').upsert({ id: 1, full_name: "Toriq As Syarif", headline: document.getElementById('headline').value, about_text: document.getElementById('about_text').value });
    alert("Profil Diupdate!");
};

const handleForm = async (e, type, table, payloadFunc) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = "Processing...";
    const payload = await payloadFunc();
    
    if (editId[type]) {
        await supabase.from(table).update(payload).eq('id', editId[type]);
        editId[type] = null;
    } else {
        await supabase.from(table).insert([payload]);
    }
    
    e.target.reset();
    btn.innerText = "Add Data";
    refreshAll();
};

document.getElementById('project-form').onsubmit = (e) => handleForm(e, 'project', 'projects', async () => ({
    title: document.getElementById('p-title').value,
    tech_stack: document.getElementById('p-tech').value.split(',').map(t => t.trim()),
    description: document.getElementById('p-desc').value,
    link_github: document.getElementById('p-link').value,
    image_url: await handleUpload(document.getElementById('p-img').files[0], 'projects')
}));

document.getElementById('work-form').onsubmit = (e) => handleForm(e, 'work', 'work_experience', async () => ({
    job_position: document.getElementById('e-title').value,
    company: document.getElementById('e-company').value,
    duration: document.getElementById('e-duration').value,
    description: document.getElementById('e-desc').value,
    image_url: await handleUpload(document.getElementById('e-img').files[0], 'work')
}));

document.getElementById('certification-form').onsubmit = (e) => handleForm(e, 'certification', 'certifications', async () => ({
    name: document.getElementById('c-title').value,
    publisher: document.getElementById('c-issuer').value,
    description: document.getElementById('c-desc').value,
    image_url: await handleUpload(document.getElementById('c-img').files[0], 'certs')
}));

document.getElementById('volunteer-form').onsubmit = (e) => handleForm(e, 'volunteer', 'volunteers', async () => ({
    role: document.getElementById('v-title').value,
    organization: document.getElementById('v-org').value,
    duration: document.getElementById('v-duration').value,
    description: document.getElementById('v-desc').value,
    image_url: await handleUpload(document.getElementById('v-img').files[0], 'volunteer')
}));

checkAuth();
