import { supabase } from './supabase-config.js';

let editingProjectId = null;

// --- 1. UPLOAD HELPER ---
async function handleUpload(file, folder) {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('portfolio_assets')
        .upload(filePath, file);

    if (uploadError) {
        console.error("Upload failed:", uploadError);
        return null;
    }

    // Ambil URL Publik
    const { data } = supabase.storage.from('portfolio_assets').getPublicUrl(filePath);
    return data.publicUrl;
}
// --- STATE UNTUK EDIT WORK ---
let editingWorkId = null;


// --- 2. REFRESH & RENDER ---
async function refreshLists() {
    const { data: projs } = await supabase.from('projects').select('*').order('id', { ascending: false });
    const listEl = document.getElementById('list-project');
    if (listEl) {
        listEl.innerHTML = `<h4 class="list-head">Inputted Records:</h4>`;
        projs?.forEach(item => {
            const div = document.createElement('div');
            div.className = 'manage-item';
            div.innerHTML = `
                <span>${item.title}</span>
                <div class="actions">
                    <button type="button" class="btn-edit" onclick="editProject(${item.id})">Edit</button>
                    <button type="button" class="btn-delete" onclick="deleteItem('projects', ${item.id})">Delete</button>
                </div>`;
            listEl.appendChild(div);
        });
    }


    const { data: works } = await supabase.from('work_experience').select('*').order('id', { ascending: false });
    if (document.getElementById('total-work')) document.getElementById('total-work').innerText = works?.length || 0;
    
    const workEl = document.getElementById('list-work');
    if (workEl) {
        workEl.innerHTML = `<h4 class="list-head">Inputted Records:</h4>`;
        works?.forEach(item => {
            const div = document.createElement('div');
            div.className = 'manage-item';
            div.innerHTML = `
                <span>${item.job_position} at ${item.company}</span>
                <div class="actions">
                    <button type="button" class="btn-edit" onclick="editWork(${item.id})">Edit</button>
                    <button type="button" class="btn-delete" onclick="deleteItem('work_experience', ${item.id})">Delete</button>
                </div>`;
            workEl.appendChild(div);
        });
    }

    window.editWork = async (id) => {
    const { data: item } = await supabase.from('work_experience').select('*').eq('id', id).single();
    if (item) {
        editingWorkId = item.id;
        document.getElementById('e-title').value = item.job_position;
        document.getElementById('e-company').value = item.company || '';
        document.getElementById('e-duration').value = item.duration || '';
        document.getElementById('e-desc').value = item.description || '';
        
        const btn = document.querySelector('#exp-form button[type="submit"]');
        btn.innerText = "Update Work Experience";
        btn.style.background = "#ffc107";
        document.getElementById('work').scrollIntoView({ behavior: 'smooth' });
    }
};// --- HANDLER SUBMIT WORK (Insert/Update) ---
const expForm = document.getElementById('exp-form');
if (expForm) {
    expForm.onsubmit = async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.innerText = 'Processing...';

        const imgFile = document.getElementById('e-img').files[0];
        const imgUrl = await handleUpload(imgFile, 'experience');

        const payload = {
            job_position: document.getElementById('e-title').value,
            company: document.getElementById('e-company').value,
            duration: document.getElementById('e-duration').value,
            description: document.getElementById('e-desc').value
        };
        if (imgUrl) payload.image_url = imgUrl;

        if (editingWorkId) {
            await supabase.from('work_experience').update(payload).eq('id', editingWorkId);
            editingWorkId = null;
        } else {
            await supabase.from('work_experience').insert([payload]);
        }

        alert("Work Experience Saved!");
        btn.innerText = "Add Work Experience";
        btn.style.background = "#006661";
        e.target.reset();
        refreshLists();
    };
}
}

// Global functions agar bisa dipanggil dari HTML
window.deleteItem = async (table, id) => {
    if (confirm('Delete?')) {
        await supabase.from(table).delete().eq('id', id);
        refreshLists();
    }
};

window.editProject = async (id) => {
    const { data: item } = await supabase.from('projects').select('*').eq('id', id).single();
    if (item) {
        editingProjectId = item.id;
        document.getElementById('p-title').value = item.title;
        document.getElementById('p-tech').value = item.tech_stack?.join(', ') || '';
        document.getElementById('p-desc').value = item.description || '';
        document.getElementById('p-link').value = item.link_github || '';
        
        const btn = document.querySelector('#project-form button[type="submit"]');
        btn.innerText = "Update Project";
        btn.style.background = "#ffc107";
        document.getElementById('project').scrollIntoView({ behavior: 'smooth' });
    }
};

// --- 3. SUBMIT HANDLER ---
document.getElementById('project-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = 'Processing...';

    const imgFile = document.getElementById('p-img').files[0];
    const imgUrl = await handleUpload(imgFile, 'projects');

    const payload = {
        title: document.getElementById('p-title').value,
        tech_stack: document.getElementById('p-tech').value.split(',').map(t => t.trim()),
        description: document.getElementById('p-desc').value,
        link_github: document.getElementById('p-link').value
    };
    
    // Hanya update image_url jika ada file baru yang diupload
    if (imgUrl) payload.image_url = imgUrl;

    if (editingProjectId) {
        await supabase.from('projects').update(payload).eq('id', editingProjectId);
        editingProjectId = null;
    } else {
        await supabase.from('projects').insert([payload]);
    }

    alert("Success!");
    btn.innerText = "Add Project";
    btn.style.background = "#006661";
    e.target.reset();
    refreshLists();
};

window.onload = refreshLists;
