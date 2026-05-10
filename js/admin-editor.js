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

// --- FUNGSI FORMAT TANGGAL ---
function formatDuration(start, end) {
    const options = { month: 'short', year: 'numeric' };
    const startDate = new Date(start).toLocaleDateString('en-US', options);
    const endDate = end ? new Date(end).toLocaleDateString('en-US', options) : 'Present';
    return `${startDate} - ${endDate}`;
}

// --- REFRESH LIST WORK ---
async function refreshWorkList() {
    const { data: exps } = await supabase.from('work_experience').select('*').order('id', { ascending: false });
    if (document.getElementById('total-work')) document.getElementById('total-work').innerText = exps?.length || 0;
    
    const listEl = document.getElementById('list-work');
    if (listEl) {
        listEl.innerHTML = `<h4 class="list-head">Inputted Records:</h4>`;
        exps?.forEach(item => {
            const div = document.createElement('div');
            div.className = 'manage-item';
            div.innerHTML = `
                <span><strong>${item.job_title}</strong> at ${item.company}</span>
                <div class="actions">
                    <button type="button" class="btn-delete" onclick="deleteWork(${item.id})">Delete</button>
                </div>`;
            listEl.appendChild(div);
        });
    }
}

window.deleteWork = async (id) => {
    if (confirm('Hapus pengalaman kerja ini?')) {
        await supabase.from('work_experience').delete().eq('id', id);
        refreshWorkList();
    }
};

// --- SUBMIT WORK FORM ---
const workForm = document.getElementById('work-form');
if (workForm) {
    workForm.onsubmit = async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.innerText = 'Processing...';

        const start = document.getElementById('w-start-date').value;
        const end = document.getElementById('w-end-date').value;
        const durationText = formatDuration(start, end);

        const imgFile = document.getElementById('w-img').files[0];
        const imgUrl = await handleUpload(imgFile, 'experience');

        const { error } = await supabase.from('work_experience').insert([{
            job_title: document.getElementById('w-title').value,
            company: document.getElementById('w-company').value,
            duration: durationText, // Menyimpan teks "Month Year - Month Year/Present"
            description: document.getElementById('w-desc').value,
            image_url: imgUrl
        }]);

        if (error) alert(error.message);
        else {
            alert("Work Experience Added!");
            e.target.reset();
            refreshWorkList();
        }
        btn.innerText = 'Add Work Experience';
    };
}

    
window.onload = refreshLists;
