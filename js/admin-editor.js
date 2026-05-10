import { supabase } from './supabase-config.js';

// --- GLOBAL VARIABLES ---
let editingProjectId = null;
let editingWorkId = null;
let editingCertId = null;
let editingVolId = null;

// --- 1. HELPER: UPLOAD GAMBAR ---
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

// --- 2. RENDER LISTS (CRUD: READ) ---
async function refreshLists() {
    // Render Project
    const { data: projs } = await supabase.from('projects').select('*').order('id', { ascending: false });
    renderToElement('list-project', projs, 'title', 'editProject', 'projects');

    // Render Work
    const { data: works } = await supabase.from('work_experience').select('*').order('id', { ascending: false });
    renderToElement('list-work', works, 'job_position', 'editWork', 'work_experience');

    // Render Certifications (Ini yang tadi bikin error karena namanya dobel)
    const { data: allCerts } = await supabase.from('certifications').select('*').order('id', { ascending: false });
    renderToElement('list-certification', allCerts, 'name', 'editCertification', 'certifications');

    // Render Volunteers
    const { data: allVols } = await supabase.from('volunteers').select('*').order('id', { ascending: false });
    renderToElement('list-volunteer', allVols, 'role', 'editVolunteer', 'volunteers');
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
                <button type="button" class="btn-edit" onclick="${editFuncName}(${item.id})">Edit</button>
                <button type="button" class="btn-delete" onclick="deleteItem('${tableName}', ${item.id})">Delete</button>
            </div>`;
        el.appendChild(div);
    });
}

// --- 3. ACTIONS (CRUD: DELETE) ---
window.deleteItem = async (table, id) => {
    if (confirm('Are you sure you want to delete this?')) {
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) alert(error.message);
        else refreshLists();
    }
};

// --- 4. PREPARE EDIT (CRUD: UPDATE MODE) ---
window.editProject = async (id) => {
    const { data } = await supabase.from('projects').select('*').eq('id', id).single();
    if (data) {
        editingProjectId = data.id;
        document.getElementById('p-title').value = data.title;
        document.getElementById('p-tech').value = data.tech_stack?.join(', ') || '';
        document.getElementById('p-desc').value = data.description || '';
        document.getElementById('p-link').value = data.link_github || '';
        document.querySelector('#project-form button').innerText = "Update Project";
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
        document.querySelector('#work-form button').innerText = "Update Work";
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
        document.querySelector('#certification-form button').innerText = "Update Certification";
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
        document.querySelector('#volunteer-form button').innerText = "Update Volunteer";
        document.getElementById('volunteer').scrollIntoView({ behavior: 'smooth' });
    }
};

// --- 5. SUBMIT HANDLERS (CRUD: CREATE & UPDATE) ---

// Project Submit
document.getElementById('project-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = 'Processing...';
    const imgUrl = await handleUpload(document.getElementById('p-img').files[0], 'projects');
    const payload = {
        title: document.getElementById('p-title').value,
        tech_stack: document.getElementById('p-tech').value.split(',').map(t => t.trim()),
        description: document.getElementById('p-desc').value,
        link_github: document.getElementById('p-link').value
    };
    if (imgUrl) payload.image_url = imgUrl;

    if (editingProjectId) {
        await supabase.from('projects').update(payload).eq('id', editingProjectId);
        editingProjectId = null;
    } else {
        await supabase.from('projects').insert([payload]);
    }
    e.target.reset(); btn.innerText = "Add Project"; refreshLists(); alert("Success!");
};

// Work Submit
document.getElementById('work-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = 'Processing...';
    const imgUrl = await handleUpload(document.getElementById('e-img').files[0], 'work');
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
    e.target.reset(); btn.innerText = "Add Work"; refreshLists(); alert("Success!");
};

// Certification Submit
document.getElementById('certification-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = 'Processing...';
    const imgUrl = await handleUpload(document.getElementById('c-img').files[0], 'certs');
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
    e.target.reset(); btn.innerText = "Add Certification"; refreshLists(); alert("Success!");
};

// Volunteer Submit
document.getElementById('volunteer-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = 'Processing...';
    const imgUrl = await handleUpload(document.getElementById('v-img').files[0], 'volunteer');
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
    e.target.reset(); btn.innerText = "Add Volunteer"; refreshLists(); alert("Success!");
};

// Profile Submit
document.getElementById('profile-form').onsubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('profiles').upsert({
        id: 1,
        headline: document.getElementById('headline').value,
        about_text: document.getElementById('about_text').value
    });
    if (error) alert(error.message);
    else alert("Profile Updated!");
};

// --- INITIAL LOAD ---
window.onload = refreshLists;
