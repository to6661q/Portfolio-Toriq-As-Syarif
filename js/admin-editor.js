import { supabase } from './supabase-config.js';

// Melacak data yang sedang diedit
let editing = { project: null, work: null, cert: null, vol: null };

// --- 1. HELPER: UPLOAD GAMBAR ---
async function uploadFile(file, folder) {
    if (!file) return null;
    const path = `${folder}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('portfolio_assets').upload(path, file);
    if (error) return null;
    const { data } = supabase.storage.from('portfolio_assets').getPublicUrl(path);
    return data.publicUrl;
}

// --- 2. CORE: RENDER LIST ---
async function refreshAll() {
    render('projects', 'list-project', 'title', 'project');
    render('work_experience', 'list-work', 'job_position', 'work');
    render('certifications', 'list-certification', 'name', 'cert');
    render('volunteers', 'list-volunteer', 'role', 'vol');
}

async function render(table, elId, key, type) {
    const { data } = await supabase.from(table).select('*').order('id', { ascending: false });
    const el = document.getElementById(elId);
    if (!el) return;

    // Update Badge Counter
    if (document.getElementById(`total-${type}`)) document.getElementById(`total-${type}`).innerText = data?.length || 0;

    el.innerHTML = data.map(item => `
        <div class="manage-item" style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid #ddd;">
            <span>${item[key]}</span>
            <div>
                <button onclick="window.prepareEdit('${type}', ${item.id})">Edit</button>
                <button onclick="window.del('${table}', ${item.id})" style="color:red">Del</button>
            </div>
        </div>`).join('');
}

// --- 3. AKSI GLOBAL (DELETE & EDIT) ---
window.del = async (table, id) => {
    if(confirm('Hapus data ini?')) { await supabase.from(table).delete().eq('id', id); refreshAll(); }
};

window.prepareEdit = async (type, id) => {
    const tableMap = { project: 'projects', work: 'work_experience', cert: 'certifications', vol: 'volunteers' };
    const { data } = await supabase.from(tableMap[type]).select('*').eq('id', id).single();
    if (!data) return;

    editing[type] = data.id;
    if (type === 'project') {
        document.getElementById('p-title').value = data.title;
        document.getElementById('p-tech').value = data.tech_stack?.join(', ');
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
    document.getElementById(type).scrollIntoView();
    document.querySelector(`#${type}-form button`).innerText = "Update Data";
};

// --- 4. SUBMIT HANDLERS ---
const handleForm = async (e, type, table, getPayload) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = "Processing...";
    const payload = await getPayload();
    
    if (editing[type]) {
        await supabase.from(table).update(payload).eq('id', editing[type]);
        editing[type] = null;
    } else {
        await supabase.from(table).insert([payload]);
    }
    
    e.target.reset();
    btn.innerText = "Add Data";
    refreshAll();
    alert("Berhasil disimpan!");
};

// Hubungkan Form ke Handler
document.getElementById('profile-form').onsubmit = async (e) => {
    e.preventDefault();
    await supabase.from('profiles').upsert({ id: 1, headline: document.getElementById('headline').value, about_text: document.getElementById('about_text').value });
    alert("Profile Updated!");
};

document.getElementById('project-form').onsubmit = (e) => handleForm(e, 'project', 'projects', async () => ({
    title: document.getElementById('p-title').value,
    tech_stack: document.getElementById('p-tech').value.split(',').map(t => t.trim()),
    description: document.getElementById('p-desc').value,
    link_github: document.getElementById('p-link').value,
    image_url: await uploadFile(document.getElementById('p-img').files[0], 'projects')
}));

document.getElementById('exp-form').onsubmit = (e) => handleForm(e, 'work', 'work_experience', async () => ({
    job_position: document.getElementById('e-title').value,
    company: document.getElementById('e-company').value,
    duration: document.getElementById('e-duration').value,
    description: document.getElementById('e-desc').value,
    image_url: await uploadFile(document.getElementById('e-img').files[0], 'work')
}));

document.getElementById('cert-form').onsubmit = (e) => handleForm(e, 'cert', 'certifications', async () => ({
    name: document.getElementById('c-title').value,
    publisher: document.getElementById('c-issuer').value,
    description: document.getElementById('c-desc').value,
    image_url: await uploadFile(document.getElementById('c-img').files[0], 'certs')
}));

document.getElementById('volunteer-form').onsubmit = (e) => handleForm(e, 'vol', 'volunteers', async () => ({
    role: document.getElementById('v-title').value,
    organization: document.getElementById('v-org').value,
    duration: document.getElementById('v-duration').value,
    description: document.getElementById('v-desc').value,
    image_url: await uploadFile(document.getElementById('v-img').files[0], 'volunteer')
}));

window.onload = refreshAll;
