import { supabase } from './supabase-config.js';

let editId = { project: null, work: null, certification: null, volunteer: null };

// Refresh Lists
async function refresh() {
    renderTable('projects', 'list-project', 'title', 'project');
    renderTable('work_experience', 'list-work', 'job_position', 'work');
    renderTable('certifications', 'list-certification', 'name', 'certification');
    renderTable('volunteers', 'list-volunteer', 'role', 'volunteer');
}

async function renderTable(table, elId, key, type) {
    const { data } = await supabase.from(table).select('*').order('id', { ascending: false });
    const el = document.getElementById(elId);
    if (el) {
        el.innerHTML = data.map(item => `
            <div class="manage-item" style="display:flex; justify-content:space-between; padding:8px; border-bottom:1px solid #eee;">
                <span>${item[key]}</span>
                <div>
                    <button onclick="window.setEdit('${type}', ${item.id})">Edit</button>
                    <button onclick="window.del('${table}', ${item.id})" style="color:red">Del</button>
                </div>
            </div>`).join('');
    }
}

window.del = async (table, id) => {
    if (confirm('Hapus?')) { await supabase.from(table).delete().eq('id', id); refresh(); }
};

window.setEdit = async (type, id) => {
    const map = { project: 'projects', work: 'work_experience', certification: 'certifications', volunteer: 'volunteers' };
    const { data } = await supabase.from(map[type]).select('*').eq('id', id).single();
    if (data) {
        editId[type] = data.id;
        if (type === 'project') {
            document.getElementById('p-title').value = data.title;
            document.getElementById('p-desc').value = data.description;
            document.getElementById('p-link').value = data.link_github;
        } else if (type === 'work') {
            document.getElementById('e-title').value = data.job_position;
            document.getElementById('e-company').value = data.company;
            document.getElementById('e-duration').value = data.duration;
            document.getElementById('e-desc').value = data.description;
        } else if (type === 'certification') {
            document.getElementById('c-title').value = data.name;
            document.getElementById('c-issuer').value = data.publisher;
            document.getElementById('c-desc').value = data.description;
        } else if (type === 'volunteer') {
            document.getElementById('v-title').value = data.role;
            document.getElementById('v-org').value = data.organization;
            document.getElementById('v-duration').value = data.duration;
            document.getElementById('v-desc').value = data.description;
        }
        document.getElementById(type).scrollIntoView();
        document.querySelector(`#${type}-form button`).innerText = "Update Data";
    }
};

// Form Handlers
async function submitForm(e, type, table, payload) {
    e.preventDefault();
    if (editId[type]) {
        await supabase.from(table).update(payload).eq('id', editId[type]);
        editId[type] = null;
    } else {
        await supabase.from(table).insert([payload]);
    }
    e.target.reset();
    e.target.querySelector('button').innerText = "Add Data";
    refresh();
}

document.getElementById('profile-form').onsubmit = async (e) => {
    e.preventDefault();
    await supabase.from('profiles').upsert({ id: 1, headline: document.getElementById('headline').value, about_text: document.getElementById('about_text').value });
    alert("Profile Updated");
};

document.getElementById('project-form').onsubmit = (e) => submitForm(e, 'project', 'projects', {
    title: document.getElementById('p-title').value,
    description: document.getElementById('p-desc').value,
    link_github: document.getElementById('p-link').value
});

document.getElementById('work-form').onsubmit = (e) => submitForm(e, 'work', 'work_experience', {
    job_position: document.getElementById('e-title').value,
    company: document.getElementById('e-company').value,
    duration: document.getElementById('e-duration').value,
    description: document.getElementById('e-desc').value
});

document.getElementById('certification-form').onsubmit = (e) => submitForm(e, 'certification', 'certifications', {
    name: document.getElementById('c-title').value,
    publisher: document.getElementById('c-issuer').value,
    description: document.getElementById('c-desc').value
});

document.getElementById('volunteer-form').onsubmit = (e) => submitForm(e, 'volunteer', 'volunteers', {
    role: document.getElementById('v-title').value,
    organization: document.getElementById('v-org').value,
    duration: document.getElementById('v-duration').value,
    description: document.getElementById('v-desc').value
});

window.onload = refresh;
