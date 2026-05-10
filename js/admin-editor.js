import { supabase } from './supabase-config.js';

let editingIds = { project: null, work: null, certification: null, volunteer: null };

// Refresh Semua Data di Panel Admin
async function refreshAll() {
    try {
        console.log("Memulai refresh data...");
        await Promise.all([
            loadTable('projects', 'list-project', 'title', 'project'),
            loadTable('work_experience', 'list-work', 'job_position', 'work'),
            loadTable('certifications', 'list-certification', 'name', 'certification'),
            loadTable('volunteers', 'list-volunteer', 'role', 'volunteer')
        ]);
    } catch (err) {
        console.error("Gagal memuat data admin:", err);
    }
}

async function loadTable(table, elId, key, type) {
    const { data, error } = await supabase.from(table).select('*').order('id', { ascending: false });
    const el = document.getElementById(elId);
    if (!el) return;

    // Update Counter
    const counter = document.getElementById(`total-${type}`);
    if (counter) counter.innerText = data?.length || 0;

    if (error) {
        el.innerHTML = `<p style="color:red">Error: ${error.message}</p>`;
        return;
    }

    el.innerHTML = data.map(item => `
        <div class="manage-item" style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #ddd;">
            <span>${item[key]}</span>
            <div>
                <button onclick="window.editData('${type}', ${item.id})">Edit</button>
                <button onclick="window.deleteData('${table}', ${item.id})" style="background:red; color:white">Del</button>
            </div>
        </div>
    `).join('');
}

// Global Actions (Wajib window agar bisa diklik)
window.deleteData = async (table, id) => {
    if (confirm('Hapus data ini?')) {
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) alert(error.message);
        refreshAll();
    }
};

window.editData = async (type, id) => {
    const tableMap = { project: 'projects', work: 'work_experience', certification: 'certifications', volunteer: 'volunteers' };
    const { data } = await supabase.from(tableMap[type]).select('*').eq('id', id).single();
    if (data) {
        editingIds[type] = data.id;
        if (type === 'project') {
            document.getElementById('p-title').value = data.title;
            document.getElementById('p-desc').value = data.description;
            document.getElementById('p-tech').value = data.tech_stack?.join(', ') || '';
            document.getElementById('p-link').value = data.link_github;
        } else if (type === 'work') {
            document.getElementById('e-title').value = data.job_position;
            document.getElementById('e-company').value = data.company;
            document.getElementById('e-duration').value = data.duration;
            document.getElementById('e-desc').value = data.description;
        }
        // ... (Tambahkan untuk cert & volunteer jika perlu)
        document.getElementById(type).scrollIntoView({ behavior: 'smooth' });
        alert("Data masuk ke form. Silakan ubah dan klik 'Add/Update'");
    }
};

// Form Submit Handling (CONTOH UNTUK PROJECT)
const projectForm = document.getElementById('project-form');
if (projectForm) {
    projectForm.onsubmit = async (e) => {
        e.preventDefault();
        const payload = {
            title: document.getElementById('p-title').value,
            description: document.getElementById('p-desc').value,
            tech_stack: document.getElementById('p-tech').value.split(',').map(t => t.trim()),
            link_github: document.getElementById('p-link').value
        };

        let result;
        if (editingIds.project) {
            result = await supabase.from('projects').update(payload).eq('id', editingIds.project);
            editingIds.project = null;
        } else {
            result = await supabase.from('projects').insert([payload]);
        }

        if (result.error) alert("Gagal: " + result.error.message);
        else {
            alert("Berhasil!");
            e.target.reset();
            refreshAll();
        }
    };
}

// Profile Submit
const profileForm = document.getElementById('profile-form');
if (profileForm) {
    profileForm.onsubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('profiles').upsert({
            id: 1,
            headline: document.getElementById('headline').value,
            about_text: document.getElementById('about_text').value
        });
        if (error) alert(error.message);
        else alert("Profile Updated!");
    };
}

window.onload = refreshAll;
