import { supabase } from './supabase-config.js';

// Pencatat ID untuk fitur Edit

let editingIds = { education: null,socmed: null, achievement:null, project: null, work: null, cert: null, volunteer: null };

// --- 1. FUNGSI PENYEGAR DATA ---
async function refresh() {
    console.log("Menyinkronkan data...");

    // Ambil Data Profile (ID 1)
    const { data: prof } = await supabase.from('profile').select('*').eq('id', 1).maybeSingle();
    if (prof) {
        document.getElementById('headline').value = prof.headline || '';
        document.getElementById('about_text').value = prof.about_text || '';
    }

    renderList('education', 'list-education', 'school');
renderList('socmed', 'list-socmed', 'platform');
renderList('achievement', 'list-achievement', 'title');

    // Render tabel lainnya
    renderList('project', 'list-project', 'title');
    renderList('work', 'list-work', 'job_position');
    renderList('cert', 'list-cert', 'name');
    renderList('volunteer', 'list-volunteer', 'role');
}

async function renderList(table, elId, keyName) {
    const { data, error } = await supabase.from(table).select('*').order('id', { ascending: false });
    const el = document.getElementById(elId);
    if (!el || error) return;

    el.innerHTML = data.map(item => `
        <div class="list-item" style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #eee; background:#fff; margin-bottom:5px;">
            <span><b>${item[keyName]}</b></span>
            <div>
                <button onclick="window.prepareEdit('${table}', ${item.id})" style="color:#006661; border:none; background:none; cursor:pointer; font-weight:bold;">Edit</button>
                <button onclick="window.del('${table}', ${item.id})" style="color:red; border:none; background:none; cursor:pointer; margin-left:10px;">Hapus</button>
            </div>
        </div>`).join('');
}

// --- 2. FUNGSI ACTIONS (Global) ---
window.del = async (table, id) => {
    if (confirm('Hapus data ini?')) {
        await supabase.from(table).delete().eq('id', id);
        refresh();
    }
};

window.prepareEdit = async (table, id) => {
    const { data } = await supabase.from(table).select('*').eq('id', id).single();
    if (!data) return;

    editingIds[table] = data.id;

    if (table === 'project') {
        document.getElementById('p-title').value = data.title;
        document.getElementById('p-desc').value = data.description;
        document.getElementById('p-link').value = data.link_github;
    } else if (table === 'work') {
        document.getElementById('e-title').value = data.job_position;
        document.getElementById('e-company').value = data.company;
        document.getElementById('e-duration').value = data.duration;
        document.getElementById('e-desc').value = data.description;
    } else if (table === 'cert') {
        document.getElementById('c-name').value = data.name;
        document.getElementById('c-pub').value = data.publisher;
    } else if (table === 'volunteer') {
        document.getElementById('v-role').value = data.role;
        document.getElementById('v-org').value = data.organization;
        document.getElementById('v-dur').value = data.duration;
    }else if (table === 'education') {
        document.getElementById('edu-school').value = data.school;
        document.getElementById('edu-degree').value = data.degree;
        document.getElementById('edu-year').value = data.year;
        document.getElementById('edu-gpa').value = data.gpa;
    } else if (table === 'socmed') {
        document.getElementById('sm-platform').value = data.platform;
        document.getElementById('sm-url').value = data.url;
    } else if (table === 'achievement') {
        document.getElementById('ach-title').value = data.title;
        document.getElementById('ach-issuer').value = data.issuer;
        document.getElementById('ach-year').value = data.year;
}
    
    
    const btn = document.querySelector(`#${table}-form button`);
    if(btn) btn.innerText = "Update Data";
    document.getElementById(table).scrollIntoView({ behavior: 'smooth' });
};

// --- 3. HANDLER UNTUK PROFILE (SOLUSI FIX) ---
const profileForm = document.getElementById('profile-form');
if (profileForm) {
    profileForm.onsubmit = async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.innerText = "Updating...";

        const payload = {
            id: 1, // Paksa ke baris pertama
            headline: document.getElementById('headline').value,
            about_text: document.getElementById('about_text').value
        };

        const { error } = await supabase.from('profile').upsert(payload);

        if (error) {
            alert("Gagal update profil: " + error.message);
        } else {
            alert("Profil berhasil diperbarui!");
            refresh();
        }
        btn.innerText = "Update Profile";
    };
}

// --- 4. HANDLER UNTUK LIST (Project, Work, dll) ---
const initGenericForm = (formId, table, type, payloadFn) => {
    const form = document.getElementById(formId);
    if (!form) return;

    form.onsubmit = async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.innerText = "Processing...";

        const payload = payloadFn();

        if (editingIds[type]) {
            await supabase.from(table).update(payload).eq('id', editingIds[type]);
            editingIds[type] = null;
        } else {
            await supabase.from(table).insert([payload]);
        }

        e.target.reset();
        btn.innerText = `Add ${type}`;
        refresh();
        alert("Berhasil!");
    };
};

initGenericForm('education-form', 'education', 'education', () => ({
    school: document.getElementById('edu-school').value,
    degree: document.getElementById('edu-degree').value,
    year: document.getElementById('edu-year').value,
    gpa: document.getElementById('edu-gpa').value
}));

initGenericForm('socmed-form', 'socmed', 'socmed', () => ({
    platform: document.getElementById('sm-platform').value,
    url: document.getElementById('sm-url').value
}));

initGenericForm('achievement-form', 'achievement', 'achievement', () => ({
    title: document.getElementById('ach-title').value,
    issuer: document.getElementById('ach-issuer').value,
    year: document.getElementById('ach-year').value
}));

initGenericForm('project-form', 'project', 'project', () => ({
    title: document.getElementById('p-title').value,
    description: document.getElementById('p-desc').value,
    link_github: document.getElementById('p-link').value
}));

initGenericForm('work-form', 'work', 'work', () => ({
    job_position: document.getElementById('e-title').value,
    company: document.getElementById('e-company').value,
    duration: document.getElementById('e-duration').value,
    description: document.getElementById('e-desc').value
}));

initGenericForm('cert-form', 'cert', 'cert', () => ({
    name: document.getElementById('c-name').value,
    publisher: document.getElementById('c-pub').value
}));

initGenericForm('volunteer-form', 'volunteer', 'volunteer', () => ({
    role: document.getElementById('v-role').value,
    organization: document.getElementById('v-org').value,
    duration: document.getElementById('v-dur').value
}));

// Menjalankan refresh saat halaman dimuat
window.onload = refresh;
