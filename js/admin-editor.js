import { supabase } from './supabase-config.js';

// ID FOR EDIT
let editingIds = {
    education: null,
    skill: null,
    achievement: null,
    experience: null,
    cert: null,
    softcert: null,
    volunteer: null,
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

// HELPER UPLOAD
async function uploadFile(file, folder) {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;
    const { data, error } = await supabase.storage
        .from('assets') 
        .upload(filePath, file);
    if (error) {
        console.error("Upload error details:", error);
        return null;
    }
    const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);
    return publicUrl;
}

// REFRESH DATA
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
    renderList('education', 'list-education', 'school');
    renderList('skill', 'list-skill', 'name');
    renderList('achievement', 'list-achievement', 'title');
    renderList('experience', 'list-work', 'position');
    renderList('cert', 'list-certification', 'title');
    renderList('softcert', 'softcert-table-body', 'title');
    renderList('volunteer', 'list-volunteer', 'title');
    renderList('project', 'list-project', 'title');
    renderList('contact', 'list-contact', 'platform');
}

// UPDATE FUNCTION renderList
async function renderList(table, elId, key) {
    const { data } = await supabase.from(table).select('*').order('id', { ascending: false });
    const el = document.getElementById(elId);
    if (!el) return;
    el.innerHTML = data?.map(item => {
        let dateInfo = "";
        if (table === 'experience') dateInfo = `<small>${formatDateIDN(item.start_date)} - ${item.end_date ? formatDateIDN(item.end_date) : 'Present'}</small>`;
        if (table === 'cert' || table === 'volunteer') dateInfo = `<small>${formatDateIDN(item.date)}</small>`;
        if (table === 'softcert') dateInfo = `<small>${formatDateIDN(item.issue_date)}</small>`;
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
    } else if (table === 'volunteer') {
        document.getElementById('v-title').value = data.title || '';
        document.getElementById('v-org').value = data.organization || '';
    } else if (table === 'contact') {
        document.getElementById('co-platform').value = data.platform || '';
        document.getElementById('co-url').value = data.url || '';
    } else if (table === 'cert') {
        document.getElementById('c-title').value = data.title || '';
        document.getElementById('c-issuer').value = data.publisher || '';
        document.getElementById('c-desc').value = data.description || '';
    } else if (table === 'softcert') {
        document.getElementById('sc-title').value = data.title || '';
        document.getElementById('sc-publisher').value = data.publisher || '';
        document.getElementById('sc-desc').value = data.description || '';
    }
    
    const targetId = table === 'softcert' ? 'softcert' : `section-${table}`;
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        const btn = targetSection.querySelector('button[type="submit"]');
        if(btn) btn.innerText = "Update Data";
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
};

window.saveFooterSettings = async () => {
    const email = document.getElementById('f-email').value;
    const quotes = document.getElementById('f-quotes').value;
    const { error } = await supabase.from('footer_settings').upsert({ 
        id: 1, 
        email: email, 
        quotes_list: quotes 
    });
    if (error) {
        alert("Gagal update footer: " + error.message);
    } else {
        alert("Footer Berhasil Diperbarui!");
        refreshAll();
    }
};

// PROFILE FORM SUBMIT
document.getElementById('profile-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = "Saving...";
    const photoInput = document.getElementById('p-photo');
    const cvInput = document.getElementById('profile-cv');
    const photoUrl = await uploadFile(photoInput.files[0], 'profiles');
    const cvUrl = await uploadFile(cvInput.files[0], 'documents');
    
    const payload = {
        id: 1,
        full_name: document.getElementById('full_name').value,
        headline: document.getElementById('headline').value,
        description: document.getElementById('bio-desc').value
    };
    if (photoUrl) payload.photo_url = photoUrl;
    if (cvUrl) payload.cv_url = cvUrl;
    
    const { error } = await supabase.from('profile').upsert(payload);
    if (error) {
        alert("Not save: " + error.message);
    } else {
        alert("Profile & CV Saved!");
    }
    btn.innerText = "Update Profile";
    refreshAll();
};

// GENERIC FORM HANDLER
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
        
        let resError;
        if (editingIds[type]) {
            const { error } = await supabase.from(table).update(payload).eq('id', editingIds[type]);
            resError = error;
            editingIds[type] = null;
        } else {
            const { error } = await supabase.from(table).insert([payload]);
            resError = error;
        } 
        
        if (resError) {
            alert(`Gagal menyimpan ke tabel [${table}]: ` + resError.message);
        } else {
            alert("Data Saved!");
            e.target.reset();
        }
        btn.innerText = `Save ${type}`;
        refreshAll();
    };
};

initGenericForm('education-form', 'education', 'education', () => ({
    school: document.getElementById('edu-school').value,
    degree: document.getElementById('edu-degree').value,
    year: document.getElementById('edu-year').value
}));
initGenericForm('achievement-form', 'achievement', 'achievement', () => ({
    date: document.getElementById('ach-date').value,
    title: document.getElementById('ach-title').value,
    publisher: document.getElementById('ach-pub').value,
    description: document.getElementById('ach-desc').value
}));
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
    issue_date: document.getElementById('sc-date').value || null,
    title: document.getElementById('sc-title').value,
    publisher: document.getElementById('sc-publisher').value,
    description: document.getElementById('sc-desc').value,
    tech_stack: document.getElementById('sc-tech').value
}), 'sc-img');
initGenericForm('volunteer-form', 'volunteer', 'volunteer', () => ({
    date: document.getElementById('v-date').value,
    title: document.getElementById('v-title').value,
    organization: document.getElementById('v-org').value,
    description: document.getElementById('v-desc').value,
    tech_stack: document.getElementById('vol-tech').value
}), 'v-img');
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
            const { error } = await supabase.auth.signOut();
            if (error) alert("Not Logout: " + error.message);
            else window.location.href = 'login.html'; 
        }
    });
}

window.onload = refreshAll;
