import { supabase } from './supabase-config.js';

let editingId = { project: null, work: null, certification: null, volunteer: null };

// --- FUNGSI REFRESH LIST ---
async function refreshLists() {
    console.log("Memulai Refresh...");
    await renderList('projects', 'list-project', 'title', 'project');
    await renderList('work_experience', 'list-work', 'job_position', 'work');
    await renderList('certifications', 'list-certification', 'name', 'certification');
    await renderList('volunteers', 'list-volunteer', 'role', 'volunteer');
}

async function renderList(table, elId, titleKey, type) {
    const { data, error } = await supabase.from(table).select('*').order('id', { ascending: false });
    const el = document.getElementById(elId);
    if (!el || error) return;

    if (document.getElementById(`total-${type}`)) document.getElementById(`total-${type}`).innerText = data.length;

    el.innerHTML = data.map(item => `
        <div class="manage-item" style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #eee;">
            <span>${item[titleKey]}</span>
            <div>
                <button type="button" onclick="window.prepareEdit('${type}', ${item.id})">Edit</button>
                <button type="button" onclick="window.deleteItem('${table}', ${item.id})" style="background:red;color:white">Del</button>
            </div>
        </div>
    `).join('');
}

// --- AKSI GLOBAL ---
window.deleteItem = async (table, id) => {
    if (confirm('Hapus data?')) {
        await supabase.from(table).delete().eq('id', id);
        refreshLists();
    }
};

window.prepareEdit = async (type, id) => {
    const tableMap = { project: 'projects', work: 'work_experience', certification: 'certifications', volunteer: 'volunteers' };
    const { data } = await supabase.from(tableMap[type]).select('*').eq('id', id).single();
    if (data) {
        editingId[type] = data.id;
        if (type === 'project') {
            document.getElementById('p-title').value = data.title;
            document.getElementById('p-tech').value = data.tech_stack?.join(', ') || '';
            document.getElementById('p-desc').value = data.description;
            document.getElementById('p-link').value = data.link_github;
            document.querySelector('#project-form button').innerText = "Update Project";
        }
        // ... Logika edit untuk work, cert, volunteer bisa ditambahkan polanya sama ...
        document.getElementById(type).scrollIntoView({ behavior: 'smooth' });
    }
};

// --- SUBMIT HANDLING (PROJECT) ---
const projectForm = document.getElementById('project-form');
if (projectForm) {
    projectForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log("Submit Project Dimulai...");
        const btn = e.target.querySelector('button');
        btn.innerText = "Processing...";

        const payload = {
            title: document.getElementById('p-title').value,
            tech_stack: document.getElementById('p-tech').value.split(',').map(t => t.trim()),
            description: document.getElementById('p-desc').value,
            link_github: document.getElementById('p-link').value
        };

        try {
            let error;
            if (editingId.project) {
                const res = await supabase.from('projects').update(payload).eq('id', editingId.project);
                error = res.error;
            } else {
                const res = await supabase.from('projects').insert([payload]);
                error = res.error;
            }

            if (error) throw error;

            alert("Berhasil!");
            editingId.project = null;
            btn.innerText = "Add Project";
            e.target.reset();
            refreshLists();
        } catch (err) {
            console.error("Gagal Simpan:", err);
            alert("Error: " + err.message);
        }
    });
}

// --- SUBMIT HANDLING (PROFILE) ---
const profileForm = document.getElementById('profile-form');
if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('profiles').upsert({
            id: 1,
            headline: document.getElementById('headline').value,
            about_text: document.getElementById('about_text').value
        });
        if (error) alert(error.message);
        else alert("Profile Updated!");
    });
}

window.onload = refreshLists;
