import { supabase } from './supabase-config.js';

let editIds = { project: null, work: null, cert: null, vol: null };

// --- 1. CORE: REFRESH DATA ---
async function refreshAll() {
    await loadProfile();
    await renderTable('projects', 'list-project', 'title', 'project');
    await renderTable('work_experience', 'list-work', 'job_position', 'work');
    await renderTable('certifications', 'list-certification', 'name', 'cert');
    await renderTable('volunteers', 'list-volunteer', 'role', 'vol');
}

async function loadProfile() {
    const { data } = await supabase.from('profiles').select('*').eq('id', 1).single();
    if (data) {
        document.getElementById('headline').value = data.headline || '';
        document.getElementById('about_text').value = data.about_text || '';
    }
}

async function renderTable(table, elId, key, type) {
    const { data } = await supabase.from(table).select('*').order('id', { ascending: false });
    const el = document.getElementById(elId);
    if (!el) return;
    el.innerHTML = data.map(item => `
        <div class="manage-item" style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #ddd; background:#fff;">
            <span>${item[key]}</span>
            <div>
                <button onclick="window.prepareEdit('${type}', ${item.id})">Edit</button>
                <button onclick="window.del('${table}', ${item.id})" style="color:red">Del</button>
            </div>
        </div>`).join('');
}

// --- 2. HELPERS ---
window.del = async (table, id) => {
    if(confirm('Hapus?')) { await supabase.from(table).delete().eq('id', id); refreshAll(); }
};

async function upload(file, folder) {
    if (!file) return null;
    const path = `${folder}/${Date.now()}_${file.name}`;
    await supabase.storage.from('portfolio_assets').upload(path, file);
    const { data } = supabase.storage.from('portfolio_assets').getPublicUrl(path);
    return data.publicUrl;
}

// --- 3. CRUD HANDLERS ---
window.prepareEdit = async (type, id) => {
    const map = { project: 'projects', work: 'work_experience', cert: 'certifications', vol: 'volunteers' };
    const { data } = await supabase.from(map[type]).select('*').eq('id', id).single();
    if (!data) return;
    editIds[type] = data.id;
    
    if (type === 'project') {
        document.getElementById('p-title').value = data.title;
        document.getElementById('p-desc').value = data.description;
        document.getElementById('p-link').value = data.link_github;
    } else if (type === 'work') {
        document.getElementById('e-title').value = data.job_position;
        document.getElementById('e-company').value = data.company;
        document.getElementById('e-duration').value = data.duration;
        document.getElementById('e-desc').value = data.description;
    } else if (type === 'cert') {
        document.getElementById('c-title').value = data.name;
        document.getElementById('c-issuer').value = data.publisher;
        document.getElementById('c-desc').value = data.description;
    } else if (type === 'vol') {
        document.getElementById('v-title').value = data.role;
        document.getElementById('v-org').value = data.organization;
        document.getElementById('v-duration').value = data.duration;
        document.getElementById('v-desc').value = data.description;
    }
    document.getElementById(type).scrollIntoView({ behavior: 'smooth' });
    document.querySelector(`#${type}-form button`).innerText = "Update Data";
};

const setupForm = (id, type, table, payloadFn) => {
    document.getElementById(id).onsubmit = async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.innerText = "Processing...";
        const payload = await payloadFn();
        if (editIds[type]) {
            await supabase.from(table).update(payload).eq('id', editIds[type]);
            editIds[type] = null;
        } else {
            await supabase.from(table).insert([payload]);
        }
        btn.innerText = "Add Data";
        e.target.reset(); refreshAll(); alert("Done!");
    };
};

// Inisialisasi Form
setupForm('project-form', 'project', 'projects', async () => ({
    title: document.getElementById('p-title').value,
    description: document.getElementById('p-desc').value,
    link_github: document.getElementById('p-link').value,
    image_url: await upload(document.getElementById('p-img').files[0], 'projects')
}));

setupForm('work-form', 'work', 'work_experience', async () => ({
    job_position: document.getElementById('e-title').value,
    company: document.getElementById('e-company').value,
    duration: document.getElementById('e-duration').value,
    description: document.getElementById('e-desc').value,
    image_url: await upload(document.getElementById('e-img').files[0], 'work')
}));

setupForm('certification-form', 'cert', 'certifications', async () => ({
    name: document.getElementById('c-title').value,
    publisher: document.getElementById('c-issuer').value,
    description: document.getElementById('c-desc').value,
    image_url: await upload(document.getElementById('c-img').files[0], 'certs')
}));

setupForm('volunteer-form', 'vol', 'volunteers', async () => ({
    role: document.getElementById('v-title').value,
    organization: document.getElementById('v-org').value,
    duration: document.getElementById('v-duration').value,
    description: document.getElementById('v-desc').value,
    image_url: await upload(document.getElementById('v-img').files[0], 'vol')
}));

document.getElementById('profile-form').onsubmit = async (e) => {
    e.preventDefault();
    await supabase.from('profiles').upsert({ id: 1, headline: document.getElementById('headline').value, about_text: document.getElementById('about_text').value });
    alert("Profile Updated!");
};

window.onload = refreshAll;
