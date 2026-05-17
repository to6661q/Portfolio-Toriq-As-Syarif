import { supabase } from './supabase-config.js';

// ID FOR EDIT
let editingIds = {
    education: null,
    skill: null,
    achievement: null,
    experience: null,
    cert: null,
    softcert: null,
    othercert: null,
    extracurricular: null,
    project: null,
    contact: null
};

// HELPER DATE FORMAT
const formatDateIDN = (dateString) => {
    if (!dateString) return "";
    const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
};

// HELPER UPLOAD (NAMA FILE CV TETAP ASLI SANGAT AMAN)
async function uploadFile(file, folder) {
    if (!file) return null;
    let fileName = folder === 'documents' ? file.name : `${Math.random()}.${file.name.split('.').pop()}`;
    const filePath = `${folder}/${fileName}`;
    const { data, error } = await supabase.storage.from('assets').upload(filePath, file);
    if (error) {
        console.error("Upload error details:", error);
        return null;
    }
    const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(filePath);
    return publicUrl;
}

// REFRESH DATA DENGAN SORTING TIMELINE TERBARU DAHULU
async function refreshAll() {
    const { data: prof } = await supabase.from('profile').select('*').eq('id', 1).maybeSingle();
    if (prof) {
        if (document.getElementById('full_name')) document.getElementById('full_name').value = prof.full_name || '';
        if (document.getElementById('headline')) document.getElementById('headline').value = prof.headline || '';
        if (document.getElementById('bio-desc')) document.getElementById('bio-desc').value = prof.description || '';
    }
    const { data: foot } = await supabase.from('footer_settings').select('*').eq('id', 1).maybeSingle();
    if (foot) {
        if (document.getElementById('f-email')) document.getElementById('f-email').value = foot.email || '';
        if (document.getElementById('f-quotes')) document.getElementById('f-quotes').value = foot.quotes_list || '';
    }
    renderList('education', 'list-education', 'school', 'id');
    renderList('skill', 'list-skill', 'name', 'id');
    renderList('extracurricular', 'list-extracurricular', 'name', 'id');
    renderList('experience', 'list-work', 'position', 'start_date');
    renderList('cert', 'list-certification', 'title', 'date');
    renderList('softcert', 'softcert-table-body', 'title', 'issue_date');
    renderList('othercert', 'othercert-table-body', 'title', 'issue_date');
    renderList('achievement', 'list-achievement', 'title', 'date');
    renderList('project', 'list-project', 'title', 'id');
    renderList('contact', 'list-contact', 'platform', 'id');
}

async function renderList(table, elId, key, orderColumn = 'id') {
    const { data } = await supabase.from(table).select('*').order(orderColumn, { ascending: false });
    const el = document.getElementById(elId);
    if (!el) return;
    el.innerHTML = data?.map(item => {
        let dateInfo = "";
        if (table === 'experience') dateInfo = `<small>${formatDateIDN(item.start_date)} - ${item.end_date ? formatDateIDN(item.end_date) : 'Present'}</small>`;
        if (table === 'cert' || table === 'achievement') dateInfo = `<small>${formatDateIDN(item.date)}</small>`;
        if (table === 'softcert' || table === 'othercert') dateInfo = `<small>${formatDateIDN(item.issue_date)}</small>`;
        if (table === 'education' || table === 'extracurricular') dateInfo = `<small>${item.year}</small>`;
        return `
        <div class="manage-item" style="display:flex; justify-content:space-between; padding:12px; border-bottom:1px solid #eee; align-items:center;">
            <div>
                <div style="font-weight:bold; color:#006661;">${item[key]}</div>
                ${dateInfo}
            </div>
            <div>
                <button onclick="window.prepareEdit('${table}', ${item.id})" style="color:blue; border:none; background:none; cursor:pointer;">Edit</button>
                <button onclick="window.deleteItem('${table}', ${item.id})" style="color:red; border:none; background:none; cursor:pointer; margin-left:10px;">Hapus</button>
            </div>
        </div>`;
    }).join('') || '<p style="font-size:0.8rem; color:#999; padding:10px;">Belum ada data.</p>';
}

window.deleteItem = async (table, id) => {
    if (confirm('Delete data?')) {
        await supabase.from(table).delete().eq('id', id);
        refreshAll();
    }
};

window.prepareEdit = async (table, id) => {
    const { data } = await supabase.from(table).select('*').eq('id', id).single();
    if (!data) return;
    editingIds[table] = data.id;
    
    if (table === 'experience') {
        document.getElementById('e-title').value = data.position || '';
        document.getElementById('e-company').value = data.company || '';
        document.getElementById('e-desc').value = data.description || '';
        document.getElementById('exp-tech').value = data.tech_stack || '';
    } else if (table === 'extracurricular') {
        document.getElementById('extra-name').value = data.name || '';
        document.getElementById('extra-role').value = data.role || '';
        document.getElementById('extra-year').value = data.year || '';
    } else if (table === 'contact') {
        document.getElementById('co-platform').value = data.platform || '';
        document.getElementById('co-icon').value = data.icon_class || '';
        document.getElementById('co-url').value = data.url || '';
    } else if (table === 'cert') {
        document.getElementById('c-title').value = data.title || '';
        document.getElementById('c-issuer').value = data.publisher || '';
        document.getElementById('c-desc').value = data.description || '';
        document.getElementById('cert-tech').value = data.tech_stack || '';
    } else if (table === 'softcert') {
        document.getElementById('sc-title').value = data.title || '';
        document.getElementById('sc-publisher').value = data.publisher || '';
        document.getElementById('sc-desc').value = data.description || '';
        document.getElementById('sc-tech').value = data.tech_stack || '';
    } else if (table === 'othercert') {
        document.getElementById('oc-title').value = data.title || '';
        document.getElementById('oc-publisher').value = data.publisher || '';
        document.getElementById('oc-desc').value = data.description || '';
        document.getElementById('oc-tech').value = data.tech_stack || '';
    } else if (table === 'achievement') {
        document.getElementById('ach-date').value = data.date || '';
        document.getElementById('ach-title').value = data.title || '';
        document.getElementById('ach-pub').value = data.publisher || '';
        document.getElementById('ach-desc').value = data.description || '';
        document.getElementById('ach-tech').value = data.tech_stack || '';
    } else if (table === 'project') {
        document.getElementById('p-title').value = data.title || '';
        document.getElementById('p-desc').value = data.description || '';
        document.getElementById('p-tech').value = data.tech_stack || '';
        document.getElementById('p-link').value = data.link_github || '';
    }
    
    const targetSection = document.getElementById(`section-${table}`);
    if (targetSection) {
        const btn = targetSection.querySelector('button[type="submit"]');
        if(btn) btn.innerText = "Update Data";
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
};

window.saveFooterSettings = async () => {
    const email = document.getElementById('f-email').value;
    const quotes = document.getElementById('f-quotes').value;
    const { error } = await supabase.from('footer_settings').upsert({ id: 1, email: email, quotes_list: quotes });
    if (error) alert("Gagal update footer: " + error.message);
    else { alert("Footer Berhasil Diperbarui!"); refreshAll(); }
};

window.updateBioDesc = async () => {
    const bioDesc = document.getElementById('bio-desc').value;
    const { error } = await supabase.from('profile').update({ description: bioDesc }).eq('id', 1);
    if (error) alert("Gagal menyimpan deskripsi: " + error.message);
    else { alert("Deskripsi Biodata Berhasil Disimpan!"); refreshAll(); }
};

document.getElementById('profile-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = "Saving...";
    const photoUrl = await uploadFile(document.getElementById('p-photo').files[0], 'profiles');
    const cvUrl = await uploadFile(document.getElementById('profile-cv').files[0], 'documents');
    const payload = {
        id: 1,
        full_name: document.getElementById('full_name').value,
        headline: document.getElementById('headline').value,
        description: document.getElementById('bio-desc').value
    };
    if (photoUrl) payload.photo_url = photoUrl;
    if (cvUrl) payload.cv_url = cvUrl;
    const { error } = await supabase.from('profile').upsert(payload);
    if (error) alert("Not save: " + error.message);
    else alert("Profile & CV Saved!");
    btn.innerText = "Update Profile";
    refreshAll();
};

const initGenericForm = (formId, table, type, payloadFn, fileId = null) => {
    const form = document.getElementById(formId);
    if (!form) return;
    form.onsubmit = async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        btn.innerText = "Processing...";  
        const payload = payloadFn();
        if (fileId) {
            const url = await uploadFile(document.getElementById(fileId).files[0], table);
            if (url) payload.image_url = url;
        }
        if (editingIds[type]) {
            await supabase.from(table).update(payload).eq('id', editingIds[type]);
            editingIds[type] = null;
        } else {
            await supabase.from(table).insert([payload]);
        } 
        e.target.reset();
        btn.innerText = `Save ${type}`;
        alert("Data Saved!");
        refreshAll();
    };
};

initGenericForm('education-form', 'education', 'education', () => ({
    school: document.getElementById('edu-school').value,
    degree: document.getElementById('edu-degree').value,
    year: document.getElementById('edu-year').value
}));
initGenericForm('extracurricular-form', 'extracurricular', 'extracurricular', () => ({
    name: document.getElementById('extra-name').value,
    role: document.getElementById('extra-role').value,
    year: document.getElementById('extra-year').value
}));
initGenericForm('achievement-form', 'achievement', 'achievement', () => ({
    date: document.getElementById('ach-date').value,
    title: document.getElementById('ach-title').value,
    publisher: document.getElementById('ach-pub').value,
    description: document.getElementById('ach-desc').value,
    tech_stack: document.getElementById('ach-tech').value
}), 'ach-img');
initGenericForm('work-form', 'experience', 'experience', () => ({
    start_date: document.getElementById('e-start').value,
    end_date: document.getElementById('e-end').value,
    position: document.getElementById('e-title').value,
    company: document.getElementById('e-company').value,
    description: document.getElementById('e-desc').value,
    tech_stack: document.getElementById('exp-tech').value
}), 'e-img');
initGenericForm('certification-form', 'cert', 'cert', () => ({
    date: document.getElementById('c-date').value,
    title: document.getElementById('c-title').value,
    publisher: document.getElementById('c-issuer').value,
    description: document.getElementById('c-desc').value,
    tech_stack: document.getElementById('cert-tech').value
}), 'c-img');
initGenericForm('softcert-form', 'softcert', 'softcert', () => ({
    issue_date: document.getElementById('sc-date').value,
    title: document.getElementById('sc-title').value,
    publisher: document.getElementById('sc-publisher').value,
    description: document.getElementById('sc-desc').value,
    tech_stack: document.getElementById('sc-tech').value
}), 'sc-img');
initGenericForm('othercert-form', 'othercert', 'othercert', () => ({
    issue_date: document.getElementById('oc-date').value,
    title: document.getElementById('oc-title').value,
    publisher: document.getElementById('oc-publisher').value,
    description: document.getElementById('oc-desc').value,
    tech_stack: document.getElementById('oc-tech').value
}), 'oc-img');
initGenericForm('project-form', 'project', 'project', () => ({
    title: document.getElementById('p-title').value,
    description: document.getElementById('p-desc').value,
    tech_stack: document.getElementById('p-tech').value,
    link_github: document.getElementById('p-link').value
}), 'p-img');
initGenericForm('contact-form', 'contact', 'contact', () => ({
    platform: document.getElementById('co-platform').value,
    icon_class: document.getElementById('co-icon').value,
    url: document.getElementById('co-url').value
}));
initGenericForm('skill-form', 'skill', 'skill', () => ({
    name: document.getElementById('skill-name').value
}), 'skill-img');

const logoutBtn = document.getElementById('btn-logout');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        if (confirm("Are you sure you want to exit the admin panel?")) {
            await supabase.auth.signOut();
            window.location.href = 'login.html'; 
        }
    });
}
window.onload = refreshAll;
