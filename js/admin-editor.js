import { supabase } from './supabase-config.js';

// Pencatat ID untuk edit
let editingIds = { education: null, skill: null, achievement: null, experience: null, cert: null, volunteer: null, project: null, contact: null };
// --- HELPER: FORMAT TANGGAL INDONESIA ---
const formatDateIDN = (dateString) => {
    if (!dateString) return "";
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
};
// --- 1. HELPER UPLOAD (FIX BUCKET ERROR) ---
async function uploadFile(file, folder) {
    if (!file) return null; // Jika tidak pilih file, dia memang balik null

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // CEK NAMA BUCKET DI SINI! 
    // Ganti 'portfolio-assets' dengan nama bucket aslimu di Supabase
    const { data, error } = await supabase.storage
        .from('portfolio-assets') 
        .upload(filePath, file);

    if (error) {
        console.error("Upload error details:", error);
        return null;
    }

    const { data: { publicUrl } } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(filePath);

    return publicUrl;
}

// --- 2. REFRESH DATA ---
async function refreshAll() {
    // Load Profile
    const { data: prof } = await supabase.from('profile').select('*').eq('id', 1).maybeSingle();
    if (prof) {
        if (document.getElementById('full_name')) document.getElementById('full_name').value = prof.full_name || '';
        if (document.getElementById('headline')) document.getElementById('headline').value = prof.headline || '';
        if (document.getElementById('bio-desc')) document.getElementById('bio-desc').value = prof.description || '';
    }

    // Load Footer
    const { data: foot } = await supabase.from('footer_settings').select('*').eq('id', 1).maybeSingle();
    if (foot) {
        if (document.getElementById('f-email')) document.getElementById('f-email').value = foot.email || '';
        if (document.getElementById('f-quotes')) document.getElementById('f-quotes').value = foot.quotes_list || '';
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

// --- UPDATE PADA FUNGSI renderList ---
// Ubah bagian penampil tanggal di list admin agar lebih rapi
async function renderList(table, elId, key) {
    const { data } = await supabase.from(table).select('*').order('id', { ascending: false });
    const el = document.getElementById(elId);
    if (!el) return;

    el.innerHTML = data?.map(item => {
        // Logika khusus untuk menampilkan tanggal yang sudah diformat di list admin
        let dateInfo = "";
        if (table === 'experience') dateInfo = `<small>${formatDateIDN(item.start_date)} - ${item.end_date ? formatDateIDN(item.end_date) : 'Sekarang'}</small>`;
        if (table === 'cert' || table === 'volunteer') dateInfo = `<small>${formatDateIDN(item.date)}</small>`;

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

// --- 3. EXPOSE FUNCTIONS TO WINDOW (SOLUSI ERROR "is not a function") ---
window.deleteItem = async (table, id) => {
    if (confirm('Hapus data?')) {
        await supabase.from(table).delete().eq('id', id);
        refreshAll();
    }
};

window.prepareEdit = async (table, id) => {
    const { data } = await supabase.from(table).select('*').eq('id', id).single();
    if (!data) return;
    editingIds[table] = data.id;

    // Mapping logic untuk edit
    if (table === 'experience') {
        document.getElementById('e-title').value = data.position;
        document.getElementById('e-company').value = data.company;
        document.getElementById('e-desc').value = data.description;
    } else if (table === 'volunteer') {
        document.getElementById('v-title').value = data.title;
        document.getElementById('v-org').value = data.organization;
    } else if (table === 'contact') {
        document.getElementById('co-platform').value = data.platform;
        document.getElementById('co-url').value = data.url;
    }
    
    const btn = document.querySelector(`section[id*="${table}"] button`);
    if(btn) btn.innerText = "Update Data";
    document.getElementById(`section-${table}`).scrollIntoView({ behavior: 'smooth' });
};

// Tambahkan ini di bagian paling bawah file admin-editor.js kamu
const footerBtn = document.getElementById('btn-save-footer');
if (footerBtn) {
    footerBtn.addEventListener('click', async () => {
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
    });
}

// --- 4. SUBMIT HANDLERS ---

// Profile
document.getElementById('profile-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = "Saving...";
    
    // Ambil elemen input
    const photoInput = document.getElementById('p-photo');
    const cvInput = document.getElementById('profile-cv'); // Pastikan ID ini ada di HTML

    // Proses upload
    const photoUrl = await uploadFile(photoInput.files[0], 'profiles');
    const cvUrl = await uploadFile(cvInput.files[0], 'documents');

    // DEBUG: Cek apakah file tertangkap atau tidak
    console.log("File PDF terpilih:", cvInput.files[0]);
    console.log("URL CV Hasil Upload:", cvUrl);

    const payload = {
        id: 1,
        full_name: document.getElementById('full_name').value,
        headline: document.getElementById('headline').value,
        description: document.getElementById('bio-desc').value
    };

    if (photoUrl) payload.photo_url = photoUrl;
    if (cvUrl) payload.cv_url = cvUrl; // Hanya kirim jika cvUrl tidak null

    // Simpan ke tabel 'profile'
    const { error } = await supabase.from('profile').upsert(payload);
    
    if (error) {
        console.error("Supabase Error:", error.message);
        alert("Gagal simpan: " + error.message);
    } else {
        alert("Profile & CV Saved!");
    }
    
    btn.innerText = "Update Profile";
    refreshAll();
};

// Generic Form Handler
const initGenericForm = (formId, table, type, payloadFn, fileId = null) => {
    const form = document.getElementById(formId);
    if (!form) return;
    form.onsubmit = async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
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
        btn.innerText = `Add ${type}`;
        alert("Data Saved!");
        refreshAll();
    };
};

initGenericForm('education-form', 'education', 'education', () => ({
    school: document.getElementById('edu-school').value,
    degree: document.getElementById('edu-degree').value,
    year: document.getElementById('edu-year').value
}));

initGenericForm('skill-form', 'skill', 'skill', () => ({
    name: document.getElementById('skill-name').value,
    icon_class: document.getElementById('skill-icon').value
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
}), 'p-img'); // Tambahkan 'p-img' di sini

initGenericForm('contact-form', 'contact', 'contact', () => ({
    platform: document.getElementById('co-platform').value,
    icon_class: document.getElementById('co-icon').value,
    url: document.getElementById('co-url').value
}));

initGenericForm('skill-form', 'skill', 'skill', () => ({
    name: document.getElementById('skill-name').value
}), 'skill-img'); // Tambahkan 'skill-img' di sini
// --- LOGIKA LOGOUT ---
const logoutBtn = document.getElementById('btn-logout');

if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault(); // Mencegah link pindah halaman sebelum proses selesai

        if (confirm("Apakah Anda yakin ingin keluar dari panel admin?")) {
            const { error } = await supabase.auth.signOut();

            if (error) {
                alert("Gagal Logout: " + error.message);
            } else {
                alert("Berhasil Logout. Mengalihkan ke halaman login...");
                // Arahkan kembali ke halaman login atau index
                window.location.href = 'login.html'; 
            }
        }
    });
}
window.onload = refreshAll;
