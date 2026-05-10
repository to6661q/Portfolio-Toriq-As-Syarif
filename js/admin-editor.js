import { supabase } from './supabase-config.js';

// --- 1. GLOBAL STATE (Pencatat ID untuk Mode Edit) ---
let editingIds = {
    education: null,
    skill: null,
    achievement: null,
    experience: null,
    cert: null,
    volunteer: null,
    project: null,
    contact: null
};

// --- 2. HELPER: UPLOAD FILE KE STORAGE ---
// Pastikan kamu sudah membuat Bucket bernama 'assets' di Supabase Storage (Public)
async function uploadFile(file, folder) {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file);

    if (uploadError) {
        console.error("Upload Error:", uploadError.message);
        return null;
    }

    const { data } = supabase.storage.from('assets').getPublicUrl(filePath);
    return data.publicUrl;
}

// --- 3. REFRESH SEMUA LIST DATA (READ) ---
async function refreshAll() {
    console.log("Syncing all admin data...");

    // Profile (Section 2)
    const { data: prof } = await supabase.from('profile').select('*').eq('id', 1).maybeSingle();
    if (prof) {
        document.getElementById('full_name').value = prof.full_name || '';
        document.getElementById('headline').value = prof.headline || '';
        document.getElementById('bio-desc').value = prof.description || '';
    }

    // Render Lists
    renderList('education', 'list-education', 'school');
    renderList('skill', 'list-skill', 'name');
    renderList('achievement', 'list-achievement', 'title');
    renderList('experience', 'list-work', 'position');
    renderList('cert', 'list-certification', 'title');
    renderList('volunteer', 'list-volunteer', 'title');
    renderList('project', 'list-project', 'title');
    renderList('contact', 'list-contact', 'platform');
}

async function renderList(table, elId, keyName) {
    const { data } = await supabase.from(table).select('*').order('id', { ascending: false });
    const el = document.getElementById(elId);
    if (!el) return;

    el.innerHTML = data?.map(item => `
        <div class="manage-item">
            <span><strong>${item[keyName]}</strong></span>
            <div>
                <button onclick="window.prepareEdit('${table}', ${item.id})" class="btn-edit" style="color:blue; border:none; background:none; cursor:pointer;">Edit</button>
                <button onclick="window.deleteItem('${table}', ${item.id})" class="btn-del" style="color:red; border:none; background:none; cursor:pointer; margin-left:10px;">Hapus</button>
            </div>
        </div>`).join('') || '<p style="font-size:0.8rem; color:#999;">Belum ada data.</p>';
}

// --- 4. ACTIONS: DELETE & PREPARE EDIT ---
window.deleteItem = async (table, id) => {
    if (confirm(`Yakin ingin menghapus data di tabel ${table}?`)) {
        await supabase.from(table).delete().eq('id', id);
        refreshAll();
    }
};

window.prepareEdit = async (table, id) => {
    const { data } = await supabase.from(table).select('*').eq('id', id).single();
    if (!data) return;

    editingIds[table] = data.id;

    // Mapping data ke Form
    if (table === 'education') {
        document.getElementById('edu-school').value = data.school;
        document.getElementById('edu-degree').value = data.degree;
        document.getElementById('edu-year').value = data.year;
    } else if (table === 'skill') {
        document.getElementById('skill-name').value = data.name;
        document.getElementById('skill-icon').value = data.icon_class;
    } else if (table === 'achievement') {
        document.getElementById('ach-title').value = data.title;
        document.getElementById('ach-pub').value = data.publisher;
        document.getElementById('ach-date').value = data.date;
        document.getElementById('ach-desc').value = data.description;
    } else if (table === 'experience') {
        document.getElementById('e-start').value = data.start_date;
        document.getElementById('e-end').value = data.end_date;
        document.getElementById('e-title').value = data.position;
        document.getElementById('e-company').value = data.company;
        document.getElementById('e-desc').value = data.description;
    } else if (table === 'cert') {
        document.getElementById('c-date').value = data.date;
        document.getElementById('c-title').value = data.title;
        document.getElementById('c-issuer').value = data.publisher;
        document.getElementById('c-desc').value = data.description;
    } else if (table === 'volunteer') {
        document.getElementById('v-date').value = data.date;
        document.getElementById('v-title').value = data.title;
        document.getElementById('v-org').value = data.organization;
        document.getElementById('v-desc').value = data.description;
    } else if (table === 'project') {
        document.getElementById('p-title').value = data.title;
        document.getElementById('p-desc').value = data.description;
        document.getElementById('p-tech').value = data.tech_stack;
        document.getElementById('p-link').value = data.link_github;
    } else if (table === 'contact') {
        document.getElementById('co-platform').value = data.platform;
        document.getElementById('co-icon').value = data.icon_class;
        document.getElementById('co-url').value = data.url;
    }

    // Ubah teks tombol di form terkait
    const form = document.querySelector(`section[id*="${table}"] form button`);
    if (form) form.innerText = "Update Data";
    document.getElementById(`section-${table}`).scrollIntoView({ behavior: 'smooth' });
};

// --- 5. SUBMIT HANDLERS ---

// A. Profile & Bio Desc (Upsert ID 1)
document.getElementById('profile-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = "Processing...";

    const photoFile = document.getElementById('p-photo').files[0];
    const photoUrl = await uploadFile(photoFile, 'profiles');

    const payload = {
        id: 1,
        full_name: document.getElementById('full_name').value,
        headline: document.getElementById('headline').value,
        description: document.getElementById('bio-desc').value
    };
    if (photoUrl) payload.photo_url = photoUrl;

    await supabase.from('profile').upsert(payload);
    alert("Profile Updated!");
    btn.innerText = "Update Profile";
    refreshAll();
};

// Fungsi pembantu untuk Simpan/Update data generic
const initForm = (formId, table, type, payloadFn, fileInputId = null) => {
    const form = document.getElementById(formId);
    if (!form) return;

    form.onsubmit = async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.innerText = "Processing...";

        const payload = payloadFn();

        // Jika ada input file
        if (fileInputId) {
            const file = document.getElementById(fileInputId).files[0];
            const uploadedUrl = await uploadFile(file, table);
            if (uploadedUrl) payload.image_url = uploadedUrl;
        }

        if (editingIds[type]) {
            await supabase.from(table).update(payload).eq('id', editingIds[type]);
            editingIds[type] = null;
        } else {
            await supabase.from(table).insert([payload]);
        }

        alert("Success!");
        e.target.reset();
        btn.innerText = `Add ${type}`;
        refreshAll();
    };
};

// Inisialisasi semua form berdasarkan struktur tabel baru
initForm('education-form', 'education', 'education', () => ({
    school: document.getElementById('edu-school').value,
    degree: document.getElementById('edu-degree').value,
    year: document.getElementById('edu-year').value
}));

initForm('skill-form', 'skill', 'skill', () => ({
    name: document.getElementById('skill-name').value,
    icon_class: document.getElementById('skill-icon').value
}));

initForm('achievement-form', 'achievement', 'achievement', () => ({
    date: document.getElementById('ach-date').value,
    title: document.getElementById('ach-title').value,
    publisher: document.getElementById('ach-pub').value,
    description: document.getElementById('ach-desc').value
}));

initForm('work-form', 'experience', 'experience', () => ({
    start_date: document.getElementById('e-start').value,
    end_date: document.getElementById('e-end').value,
    position: document.getElementById('e-title').value,
    company: document.getElementById('e-company').value,
    description: document.getElementById('e-desc').value
}), 'e-img');

initForm('certification-form', 'cert', 'cert', () => ({
    date: document.getElementById('c-date').value,
    title: document.getElementById('c-title').value,
    publisher: document.getElementById('c-issuer').value,
    description: document.getElementById('c-desc').value
}), 'c-img');

initForm('volunteer-form', 'volunteer', 'volunteer', () => ({
    date: document.getElementById('v-date').value,
    title: document.getElementById('v-title').value,
    organization: document.getElementById('v-org').value,
    description: document.getElementById('v-desc').value
}), 'v-img');

initForm('project-form', 'project', 'project', () => ({
    title: document.getElementById('p-title').value,
    description: document.getElementById('p-desc').value,
    tech_stack: document.getElementById('p-tech').value,
    link_github: document.getElementById('p-link').value
}));

initForm('contact-form', 'contact', 'contact', () => ({
    platform: document.getElementById('co-platform').value,
    icon_class: document.getElementById('co-icon').value,
    url: document.getElementById('co-url').value
}));

// Initial Load
window.onload = refreshAll;
