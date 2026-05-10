import { supabase } from './supabase-config.js';

// 1. FUNGSI UPLOAD GAMBAR
async function uploadFile(file, folder) {
    if (!file) return null;
    const path = `${folder}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('portfolio_assets').upload(path, file);
    if (error) return null;
    const { data } = supabase.storage.from('portfolio_assets').getPublicUrl(path);
    return data.publicUrl;
}

// 2. FUNGSI REFRESH DATA (TAMPILKAN LIST)
async function refreshLists() {
    await renderTable('projects', 'list-project', 'title');
    await renderTable('work_experience', 'list-work', 'job_position');
    await renderTable('certifications', 'list-certification', 'name');
    await renderTable('volunteers', 'list-volunteer', 'role');
}

async function renderTable(table, elId, key) {
    const { data } = await supabase.from(table).select('*').order('id', { ascending: false });
    const el = document.getElementById(elId);
    if (!el) return;
    el.innerHTML = data.map(item => `
        <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #ddd;">
            <span>${item[key]}</span>
            <button onclick="deleteData('${table}', ${item.id})" style="color:red">Hapus</button>
        </div>
    `).join('');
}

window.deleteData = async (table, id) => {
    if(confirm('Hapus?')) { await supabase.from(table).delete().eq('id', id); refreshLists(); }
};

// 3. LOGIKA INPUT DATA
const setupForm = (formId, table, getPayload) => {
    const form = document.getElementById(formId);
    if (!form) return;
    form.onsubmit = async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.innerText = "Processing...";
        
        const payload = await getPayload();
        const { error } = await supabase.from(table).insert([payload]);
        
        if (error) alert("Error: " + error.message);
        else { alert("Berhasil!"); e.target.reset(); refreshLists(); }
        btn.innerText = "Add Data";
    };
};

// Inisialisasi masing-masing form
setupForm('project-form', 'projects', async () => ({
    title: document.getElementById('p-title').value,
    tech_stack: document.getElementById('p-tech').value.split(','),
    description: document.getElementById('p-desc').value,
    link_github: document.getElementById('p-link').value,
    image_url: await uploadFile(document.getElementById('p-img').files[0], 'projects')
}));

setupForm('work-form', 'work_experience', async () => ({
    job_position: document.getElementById('e-title').value,
    company: document.getElementById('e-company').value,
    duration: document.getElementById('e-duration').value,
    description: document.getElementById('e-desc').value,
    image_url: await uploadFile(document.getElementById('e-img').files[0], 'work')
}));

// Tambahkan setupForm untuk Cert & Volunteer di sini...

window.onload = refreshLists;
