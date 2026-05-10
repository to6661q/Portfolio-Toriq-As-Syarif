import { supabase } from './supabase-config.js';

let editingId = { project: null, work: null, certification: null, volunteer: null };

// Auth Check
async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) window.location.href = 'login.html';
}
checkAuth();

document.getElementById('logout-btn').onclick = async () => {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
};

async function handleUpload(file, folder) {
    if (!file) return null;
    const path = `${folder}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('portfolio_assets').upload(path, file);
    if (error) return null;
    const { data } = supabase.storage.from('portfolio_assets').getPublicUrl(path);
    return data.publicUrl;
}

async function refreshAll() {
    renderList('projects', 'list-project', 'title', 'project');
    renderList('work_experience', 'list-work', 'job_position', 'work');
    renderList('certifications', 'list-certification', 'name', 'certification');
    renderList('volunteers', 'list-volunteer', 'role', 'volunteer');
}

async function renderList(table, elId, titleKey, type) {
    const { data } = await supabase.from(table).select('*').order('id', { ascending: false });
    const el = document.getElementById(elId);
    if (!el) return;

    if(document.getElementById(`total-${type}`)) document.getElementById(`total-${type}`).innerText = data?.length || 0;

    el.innerHTML = data.map(item => `
        <div class="manage-item">
            <span>${item[titleKey]}</span>
            <div>
                <button onclick="window.setupEdit('${type}', ${item.id})">Edit</button>
                <button onclick="window.deleteItem('${table}', ${item.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

window.deleteItem = async (table, id) => {
    if(confirm('Delete?')) {
        await supabase.from(table).delete().eq('id', id);
        refreshAll();
    }
};

window.setupEdit = async (type, id) => {
    const map = { project: 'projects', work: 'work_experience', certification: 'certifications', volunteer: 'volunteers' };
    const { data: item } = await supabase.from(map[type]).select('*').eq('id', id).single();
    if (item) {
        editingId[type] = item.id;
        if (type === 'project') {
            document.getElementById('p-title').value = item.title;
            document.getElementById('p-tech').value = item.tech_stack?.join(', ') || '';
            document.getElementById('p-desc').value = item.description || '';
            document.getElementById('p-link').value = item.link_github || '';
        } else if (type === 'work') {
            document.getElementById('e-title').value = item.job_position;
            document.getElementById('e-company').value = item.company;
            document.getElementById('e-duration').value = item.duration;
            document.getElementById('e-desc').value = item.description;
        }
        // ... (lanjutkan untuk certification & volunteer) ...
        document.getElementById(type).scrollIntoView({ behavior: 'smooth' });
        document.querySelector(`#${type}-form button`).innerText = "Update Data";
    }
};

// Form Submit Profiles
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

// Form Submit Projects
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

    if (editingId.project) {
        await supabase.from('projects').update(payload).eq('id', editingId.project);
        editingId.project = null;
    } else {
        await supabase.from('projects').insert([payload]);
    }
    e.target.reset(); refreshAll(); alert("Done!");
};

window.onload = refreshAll;
