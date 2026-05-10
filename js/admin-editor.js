import { supabase } from './supabase-config.js';

// --- 1. GLOBAL STATE ---
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
async function uploadFile(file, folder) {
    if (!file) return null;
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('assets')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('assets').getPublicUrl(filePath);
        return data.publicUrl;
    } catch (err) {
        console.error("Upload Error:", err.message);
        return null;
    }
}

// --- 3. REFRESH & RENDER DATA (READ) ---
async function refreshAll() {
    console.log("Syncing admin data...");

    // Safe-load Profile (ID 1)
const { data: prof } = await supabase.from('profile').select('*').eq('id', 1).maybeSingle();
    if (prof) {
        if (document.getElementById('full_name')) document.getElementById('full_name').value = prof.full_name || '';
        if (document.getElementById('headline')) document.getElementById('headline').value = prof.headline || '';
        if (document.getElementById('bio-desc')) document.getElementById('bio-desc').value = prof.description || '';
    }

    // Render Lists dengan pengecekan elemen
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
    const el = document.getElementById(elId);
    if (!el) return;

    const { data, error } = await supabase.from(table).select('*').order('id', { ascending: false });
    if (error) return console.error(`Error fetching ${table}:`, error.message);

    el.innerHTML = data?.map(item => `
        <div class="manage-item" style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #eee; background:#fff; margin-bottom:5px; border-radius:8px;">
            <span><strong>${item[keyName]}</strong></span>
            <div>
                <button onclick="window.prepareEdit('${table}', ${item.id})" style="color:#006661; border:none; background:none; cursor:pointer; font-weight:bold;">Edit</button>
                <button onclick="window.deleteItem('${table}', ${item.id})" style="color:red; border:none; background:none; cursor:pointer; margin-left:10px;">Hapus</button>
            </div>
        </div>`).join('') || '<p style="color:#999; font-size:0.8rem;">Data kosong.</p>';
}

// --- 4. GLOBAL ACTIONS (DELETE & PREPARE EDIT) ---
window.deleteItem = async (table, id) => {
    if (confirm(`Hapus data dari ${table}?`)) {
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) alert(error.message);
        refreshAll();
    }
};

window.prepareEdit = async (table, id) => {
    const { data } = await supabase.from(table).select('*').eq('id', id).single();
    if (!data) return;

    editingIds[table] = data.id;

    // Mapping manual berdasarkan tabel
    const map = {
        education: ['edu-school:school', 'edu-degree:degree', 'edu-year:year'],
        skill: ['skill-name:name', 'skill-icon:icon_class'],
        achievement: ['ach-title:title', 'ach-pub:publisher', 'ach-date:date', 'ach-desc:description'],
        experience: ['e-start:start_date', 'e-end:end_date', 'e-title:position', 'e-company:company', 'e-desc:description'],
        cert: ['c-date:date', 'c-title:title', 'c-issuer:publisher', 'c-desc:description'],
        volunteer: ['v-date:date', 'v-title:title', 'v-org:organization', 'v-desc:description'],
        project: ['p-title:title', 'p-desc:description', 'p-tech:tech_stack', 'p-link:link_github'],
        contact: ['co-platform:platform', 'co-icon:icon_class', 'co-url:url']
    };

    if (map[table]) {
        map[table].forEach(pair => {
            const [elId, dbKey] = pair.split(':');
            const el = document.getElementById(elId);
            if (el) el.value = data[dbKey] || '';
        });
    }

    // Update Button Text
    const form = document.querySelector(`section[id*="${table}"] form button`);
    if (form) {
        form.innerText = "Update Data";
        form.style.background = "#ffc107"; // Kuning tanda Edit
    }
    document.getElementById(`section-${table}`)?.scrollIntoView({ behavior: 'smooth' });
};

// --- 5. SUBMIT HANDLERS ---

// A. Profile Form (Section 2)
const profileForm = document.getElementById('profile-form');
if (profileForm) {
    profileForm.onsubmit = async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.innerText = "Processing...";

        const photoFile = document.getElementById('p-photo')?.files[0];
        const photoUrl = await uploadFile(photoFile, 'profiles');

        const payload = {
            id: 1,
            full_name: document.getElementById('full_name')?.value || '',
            headline: document.getElementById('headline')?.value || '',
            description: document.getElementById('bio-desc')?.value || ''
        };
        if (photoUrl) payload.photo_url = photoUrl;

        const { error } = await supabase.from('profile').upsert(payload);
        if (error) alert(error.message);
        else alert("Profile Updated!");

        btn.innerText = "Update Profile";
        refreshAll();
    };
}

// B. Generic Form Handler (Sistematis untuk 8 section lainnya)
const initGenericForm = (formId, table, type, payloadFn, fileInputId = null) => {
    const form = document.getElementById(formId);
    if (!form) return;

    form.onsubmit = async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = "Processing...";

        try {
            const payload = payloadFn();

            // Handle Gambar jika ada
            if (fileInputId) {
                const file = document.getElementById(fileInputId)?.files[0];
                const uploadedUrl = await uploadFile(file, table);
                if (uploadedUrl) payload.image_url = uploadedUrl;
            }

            if (editingIds[type]) {
                await supabase.from(table).update(payload).eq('id', editingIds[type]);
                editingIds[type] = null;
            } else {
                await supabase.from(table).insert([payload]);
            }

            alert("Berhasil Simpan Data!");
            e.target.reset();
            btn.innerText = originalText.replace('Update', 'Add');
            btn.style.background = "#006661";
            refreshAll();
        } catch (err) {
            alert("Gagal: " + err.message);
            btn.innerText = originalText;
        }
    };
};

// Inisialisasi Berdasarkan ID di admin.html kamu
initGenericForm('education-form', 'education', 'education', () => ({
    school: document.getElementById('edu-school')?.value || '',
    degree: document.getElementById('edu-degree')?.value || '',
    year: document.getElementById('edu-year')?.value || ''
}));

initGenericForm('skill-form', 'skill', 'skill', () => ({
    name: document.getElementById('skill-name')?.value || '',
    icon_class: document.getElementById('skill-icon')?.value || ''
}));

initGenericForm('achievement-form', 'achievement', 'achievement', () => ({
    date: document.getElementById('ach-date')?.value || '',
    title: document.getElementById('ach-title')?.value || '',
    publisher: document.getElementById('ach-pub')?.value || '',
    description: document.getElementById('ach-desc')?.value || ''
}));

initGenericForm('work-form', 'experience', 'experience', () => ({
    start_date: document.getElementById('e-start')?.value || '',
    end_date: document.getElementById('e-end')?.value || '',
    position: document.getElementById('e-title')?.value || '',
    company: document.getElementById('e-company')?.value || '',
    description: document.getElementById('e-desc')?.value || ''
}), 'e-img');

initGenericForm('certification-form', 'cert', 'cert', () => ({
    date: document.getElementById('c-date')?.value || '',
    title: document.getElementById('c-title')?.value || '',
    publisher: document.getElementById('c-issuer')?.value || '',
    description: document.getElementById('c-desc')?.value || ''
}), 'c-img');

initGenericForm('volunteer-form', 'volunteer', 'volunteer', () => ({
    date: document.getElementById('v-date')?.value || '',
    title: document.getElementById('v-title')?.value || '',
    organization: document.getElementById('v-org')?.value || '',
    description: document.getElementById('v-desc')?.value || ''
}), 'v-img');

initGenericForm('project-form', 'project', 'project', () => ({
    title: document.getElementById('p-title')?.value || '',
    description: document.getElementById('p-desc')?.value || '',
    tech_stack: document.getElementById('p-tech')?.value || '',
    link_github: document.getElementById('p-link')?.value || ''
}));

initGenericForm('contact-form', 'contact', 'contact', () => ({
    platform: document.getElementById('co-platform')?.value || '',
    icon_class: document.getElementById('co-icon')?.value || '',
    url: document.getElementById('co-url')?.value || ''
}));

// --- 6. STARTUP ---
window.onload = refreshAll;
