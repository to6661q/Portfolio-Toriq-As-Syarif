import { supabase } from './supabase-config.js';

// --- 1. GLOBAL VARIABLES (Pencatat ID Edit) ---
let editingProjectId = null;
let editingWorkId = null;
let editingCertId = null;
let editingVolId = null;

// --- 2. HELPER: UPLOAD GAMBAR ---
async function handleUpload(file, folder) {
    if (!file) return null;
    const path = `${folder}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('portfolio_assets').upload(path, file);
    if (error) {
        console.error("Upload error:", error.message);
        return null;
    }
    const { data } = supabase.storage.from('portfolio_assets').getPublicUrl(path);
    return data.publicUrl;
}

// --- 3. REFRESH LISTS (CRUD: READ) ---
async function refreshLists() {
    console.log("Syncing all data lists...");

    // Render Projects
    const { data: projs } = await supabase.from('projects').select('*').order('id', { ascending: false });
    renderToElement('list-project', projs, 'title', 'editProject', 'projects');

    // Render Work
    const { data: works } = await supabase.from('work_experience').select('*').order('id', { ascending: false });
    renderToElement('list-work', works, 'job_position', 'editWork', 'work_experience');

    // Render Certifications (Variabel diubah jadi 'certData' agar tidak bentrok)
    const { data: certData } = await supabase.from('certifications').select('*').order('id', { ascending: false });
    renderToElement('list-certification', certData, 'name', 'editCertification', 'certifications');

    // Render Volunteers (Variabel diubah jadi 'volData')
    const { data: volData } = await supabase.from('volunteers').select('*').order('id', { ascending: false });
    renderToElement('list-volunteer', volData, 'role', 'editVolunteer', 'volunteers');
}

function renderToElement(elId, data, key, editFuncName, tableName) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.innerHTML = `<h4 class="list-head">Inputted Records:</h4>`;
    data?.forEach(item => {
        const div = document.createElement('div');
        div.className = 'manage-item';
        div.innerHTML = `
            <span>${item[key]}</span>
            <div class="actions">
                <button type="button" class="btn-edit" onclick="window.${editFuncName}(${item.id})">Edit</button>
                <button type="button" class="btn-delete" onclick="window.deleteItem('${tableName}', ${item.id})">Delete</button>
            </div>`;
        el.appendChild(div);
    });
}

// --- 4. ACTIONS (DELETE & EDIT) ---
window.deleteItem = async (table, id) => {
    if (confirm('Hapus data ini?')) {
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) alert(error.message);
        else refreshLists();
    }
};

window.editProject = async (id) => {
    const { data } = await supabase.from('projects').select('*').eq('id', id).single();
    if (data) {
        editingProjectId = data.id;
        document.getElementById('p-title').value = data.title;
        document.getElementById('p-tech').value = data.tech_stack?.join(', ') || '';
        document.getElementById('p-desc').value = data.description || '';
        document.getElementById('p-link').value = data.link_github || '';
        const btn = document.querySelector('#project-form button');
        btn.innerText = "Update Project"; btn.style.background = "#ffc107";
        document.getElementById('project').scrollIntoView({ behavior: 'smooth' });
    }
};

window.editWork = async (id) => {
    const { data } = await supabase.from('work_experience').select('*').eq('id', id).single();
    if (data) {
        editingWorkId = data.id;
        document.getElementById('e-title').value = data.job_position;
        document.getElementById('e-company').value = data.company;
        document.getElementById('e-duration').value = data.duration;
        document.getElementById('e-desc').value = data.description || '';
        const btn = document.querySelector('#work-form button');
        btn.innerText = "Update Work"; btn.style.background = "#ffc107";
        document.getElementById('work').scrollIntoView({ behavior: 'smooth' });
    }
};

window.editCertification = async (id) => {
    const { data } = await supabase.from('certifications').select('*').eq('id', id).single();
    if (data) {
        editingCertId = data.id;
        document.getElementById('c-title').value = data.name;
        document.getElementById('c-issuer').value = data.publisher;
        document.getElementById('c-desc').value = data.description || '';
        const btn = document.querySelector('#certification-form button');
        btn.innerText = "Update Certification"; btn.style.background = "#ffc107";
        document.getElementById('certification').scrollIntoView({ behavior: 'smooth' });
    }
};

window.editVolunteer = async (id) => {
    const { data } = await supabase.from('volunteers').select('*').eq('id', id).single();
    if (data) {
        editingVolId = data.id;
        document.getElementById('v-title').value = data.role;
        document.getElementById('v-org').value = data.organization;
        document.getElementById('v-duration').value = data.duration;
        document.getElementById('v-desc').value = data.description || '';
        const btn = document.querySelector('#volunteer-form button');
        btn.innerText = "Update Volunteer"; btn.style.background = "#ffc107";
        document.getElementById('volunteer').scrollIntoView({ behavior: 'smooth' });
    }
};

// --- 5. SUBMIT HANDLERS (DENGAN PENGECEKAN AMAN) ---

const initForm = (formId, table, type, payloadFn, btnText) => {
    const form = document.getElementById(formId);
    if (!form) {
        console.warn(`Peringatan: Form dengan ID "${formId}" tidak ditemukan. Pastikan ID ini ada di admin.html`);
        return; // Jangan lanjut kalau form tidak ada
    }

    form.onsubmit = async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const originalBtnText = btn.innerText;
        btn.innerText = 'Processing...';

        const payload = await payloadFn();
        
        // Cek ID mana yang sedang diedit
        let currentId = null;
        if (type === 'project') currentId = editingProjectId;
        else if (type === 'work') currentId = editingWorkId;
        else if (type === 'cert') currentId = editingCertId;
        else if (type === 'vol') currentId = editingVolId;

        try {
            if (currentId) {
                await supabase.from(table).update(payload).eq('id', currentId);
                // Reset ID setelah update
                if (type === 'project') editingProjectId = null;
                else if (type === 'work') editingWorkId = null;
                else if (type === 'cert') editingCertId = null;
                else if (type === 'vol') editingVolId = null;
            } else {
                await supabase.from(table).insert([payload]);
            }

            alert("Data Berhasil Disimpan!");
            e.target.reset();
            btn.innerText = btnText; // Kembali ke teks awal (Add...)
            btn.style.background = "#006661";
            refreshLists();
        } catch (err) {
            alert("Error: " + err.message);
            btn.innerText = originalBtnText;
        }
    };
};

// --- INISIALISASI SEMUA FORM ---
// Pastikan ID di bawah ini SAMA PERSIS dengan di admin.html

initForm('project-form', 'projects', 'project', async () => ({
    title: document.getElementById('p-title').value,
    tech_stack: document.getElementById('p-tech').value.split(',').map(t => t.trim()),
    description: document.getElementById('p-desc').value,
    link_github: document.getElementById('p-link').value,
    image_url: await handleUpload(document.getElementById('p-img').files[0], 'projects')
}), "Add Project");

initForm('work-form', 'work_experience', 'work', async () => ({
    job_position: document.getElementById('e-title').value,
    company: document.getElementById('e-company').value,
    duration: document.getElementById('e-duration').value,
    description: document.getElementById('e-desc').value,
    image_url: await handleUpload(document.getElementById('e-img').files[0], 'work')
}), "Add Work");

initForm('certification-form', 'certifications', 'cert', async () => ({
    name: document.getElementById('c-title').value,
    publisher: document.getElementById('c-issuer').value,
    description: document.getElementById('c-desc').value,
    image_url: await handleUpload(document.getElementById('c-img').files[0], 'certs')
}), "Add Certification");

initForm('volunteer-form', 'volunteers', 'vol', async () => ({
    role: document.getElementById('v-title').value,
    organization: document.getElementById('v-org').value,
    duration: document.getElementById('v-duration').value,
    description: document.getElementById('v-desc').value,
    image_url: await handleUpload(document.getElementById('v-img').files[0], 'volunteer')
}), "Add Volunteer");

// Khusus Profile (Gunakan pengecekan manual)
const profForm = document.getElementById('profile-form');
if (profForm) {
    profForm.onsubmit = async (e) => {
        e.preventDefault();
        await supabase.from('profiles').upsert({
            id: 1,
            headline: document.getElementById('headline').value,
            about_text: document.getElementById('about_text').value
        });
        alert("Profile Updated!");
    };
}
// Start
window.onload = refreshLists;
