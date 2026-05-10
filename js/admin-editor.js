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
