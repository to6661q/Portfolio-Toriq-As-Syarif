import { supabase } from './supabase-config.js';

let editingProjectId = null;
let editingWorkId = null;
let editingCertificationsId = null;
let editingVolunteerId = null;

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

    const { data: works } = await supabase.from('work_experience').select('*').order('id', { ascending: false });
    const listElWork = document.getElementById('list-work');
    
    if (listElWork) {
        listElWork.innerHTML = `<h4 class="list-head">Inputted Records:</h4>`;
        works?.forEach(item => {
            const div = document.createElement('div');
            div.className = 'manage-item';
            div.innerHTML = `
                <span>${item.job_position}</span>
                
                <div class="actions">
                    <button type="button" class="btn-edit" onclick="editWork(${item.id})">Edit</button>
                    
                    <button type="button" class="btn-delete" onclick="deleteItem('work_experience', ${item.id})">Delete</button>
                </div>`;
            listElWork.appendChild(div);
        });
    }
    // 1. Ambil data dari tabel 'certifications'
    const { data: certs } = await supabase.from('certifications').select('*').order('id', { ascending: false });
    
    // 2. ID elemen list di admin.html: 'list-certification'
    const listElCert = document.getElementById('list-certification');
    
    if (listElCert) {
        listElCert.innerHTML = `<h4 class="list-head">Inputted Records:</h4>`;
        certs?.forEach(item => {
            const div = document.createElement('div');
            div.className = 'manage-item';
            div.innerHTML = `
                <span>${item.name}</span>
                <div class="actions">
                    <button type="button" class="btn-edit" onclick="editCertification(${item.id})">Edit</button>
                    <button type="button" class="btn-delete" onclick="deleteItem('certifications', ${item.id})">Delete</button>
                </div>`;
            listElCert.appendChild(div);
        });
    }
    // 1. Ambil data dari tabel 'certifications'
    const { data: certs } = await supabase.from('certifications').select('*').order('id', { ascending: false });
    
    // 2. ID elemen list di admin.html: 'list-certification'
    const listElCert = document.getElementById('list-certification');
    
    if (listElCert) {
        listElCert.innerHTML = `<h4 class="list-head">Inputted Records:</h4>`;
        certs?.forEach(item => {
            const div = document.createElement('div');
            div.className = 'manage-item';
            div.innerHTML = `
                <span>${item.name}</span>
                <div class="actions">
                    <button type="button" class="btn-edit" onclick="editCertification(${item.id})">Edit</button>
                    <button type="button" class="btn-delete" onclick="deleteItem('certifications', ${item.id})">Delete</button>
                </div>`;
            listElCert.appendChild(div);
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
window.editWork = async (id) => {
    const { data: item } = await supabase.from('work_experience').select('*').eq('id', id).single();
    if (item) {
        editingWorkId = item.id; // Simpan ID untuk proses update nanti
        document.getElementById('e-title').value = item.job_position;
        document.getElementById('e-company').value = item.company;
        document.getElementById('e-duration').value = item.duration;
        document.getElementById('e-desc').value = item.description || '';
        
        const btn = document.querySelector('#work-form button[type="submit"]');
        btn.innerText = "Update Work Experience";
        btn.style.background = "#ffc107";
        document.getElementById('work').scrollIntoView({ behavior: 'smooth' });
    }
};
window.editCertification = async (id) => {
    const { data: item } = await supabase.from('certifications').select('*').eq('id', id).single();
    if (item) {
        editingCertId = item.id;
        document.getElementById('c-title').value = item.name;
        document.getElementById('c-issuer').value = item.publisher;
        document.getElementById('c-desc').value = item.description || '';
        
        const btn = document.querySelector('#certification-form button[type="submit"]');
        btn.innerText = "Update Certification";
        btn.style.background = "#ffc107";
        document.getElementById('certification').scrollIntoView({ behavior: 'smooth' });
    }
};
window.editVolunteer = async (id) => {
    const { data: item } = await supabase.from('volunteers').select('*').eq('id', id).single();
    if (item) {
        editingVolId = item.id;
        document.getElementById('v-title').value = item.role;
        document.getElementById('v-org').value = item.organization;
        document.getElementById('v-duration').value = item.duration;
        document.getElementById('v-desc').value = item.description || '';
        
        const btn = document.querySelector('#volunteer-form button[type="submit"]');
        btn.innerText = "Update Volunteer";
        btn.style.background = "#ffc107";
        document.getElementById('volunteer').scrollIntoView({ behavior: 'smooth' });
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

document.getElementById('work-form').onsubmit = async (e) => {
    e.preventDefault();
    console.log("Tombol Work diklik!"); // Debug 1

    const payload = {
        job_position: document.getElementById('e-title').value,
        company: document.getElementById('e-company').value,
        duration: document.getElementById('e-duration').value,
        description: document.getElementById('e-desc').value
    };
    
    console.log("Payload yang dikirim:", payload); // Debug 2

    try {
        if (editingWorkId) {
            const { error } = await supabase.from('work_experience').update(payload).eq('id', editingWorkId);
            if (error) throw error;
        } else {
            const { error } = await supabase.from('work_experience').insert([payload]);
            if (error) throw error;
        }
        alert("Berhasil Simpan Work!");
        refreshLists();
    } catch (err) {
        console.error("Error saat simpan ke Supabase:", err.message); // Debug 3
        alert("Gagal: " + err.message);
    }
};

document.getElementById('certification-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = 'Processing...';

    const imgFile = document.getElementById('c-img').files[0];
    const imgUrl = await handleUpload(imgFile, 'certs');

    const payload = {
        name: document.getElementById('c-title').value,
        publisher: document.getElementById('c-issuer').value,
        description: document.getElementById('c-desc').value
    };
    
    if (imgUrl) payload.image_url = imgUrl;

    if (editingCertId) {
        await supabase.from('certifications').update(payload).eq('id', editingCertId);
        editingCertId = null;
    } else {
        await supabase.from('certifications').insert([payload]);
    }

    alert("Certification Saved!");
    btn.innerText = "Add Certification";
    btn.style.background = "#006661";
    e.target.reset();
    refreshLists();
};
document.getElementById('volunteer-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = 'Processing...';

    const imgFile = document.getElementById('v-img').files[0];
    const imgUrl = await handleUpload(imgFile, 'volunteer');

    const payload = {
        role: document.getElementById('v-title').value,
        organization: document.getElementById('v-org').value,
        duration: document.getElementById('v-duration').value,
        description: document.getElementById('v-desc').value
    };
    
    if (imgUrl) payload.image_url = imgUrl;

    if (editingVolId) {
        await supabase.from('volunteers').update(payload).eq('id', editingVolId);
        editingVolId = null;
    } else {
        await supabase.from('volunteers').insert([payload]);
    }

    alert("Volunteer Data Saved!");
    btn.innerText = "Add Volunteer";
    btn.style.background = "#006661";
    e.target.reset();
    refreshLists();
};

window.onload = refreshLists;
