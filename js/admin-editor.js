import { supabase } from './supabase-config.js';

// --- 1. PROTECTIONS ---
async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) window.location.href = 'login.html';
}
checkUser();

document.getElementById('logout-btn').onclick = async () => {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
};

// --- 2. UPLOAD HELPER ---
async function handleUpload(file, folder) {
    if (!file) return null;
    // Pastikan bucket 'portfolio_assets' sudah dibuat di Supabase Storage
    const path = `${folder}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('portfolio_assets').upload(path, file);
    if (error) {
        console.error("Upload Error:", error.message);
        return null;
    }
    const { data } = supabase.storage.from('portfolio_assets').getPublicUrl(path);
    return data.publicUrl;
}

// --- 3. REFRESH & RENDER ---
async function refreshLists() {
    console.log("Refreshing all lists...");
    
    // Project List
    const { data: projs } = await supabase.from('projects').select('*').order('id', { ascending: false });
    if (document.getElementById('total-project')) document.getElementById('total-project').innerText = projs?.length || 0;
    render('list-project', projs, 'projects', 'title');

    // Work List
    const { data: exps } = await supabase.from('work_experience').select('*').order('id', { ascending: false });
    if (document.getElementById('total-work')) document.getElementById('total-work').innerText = exps?.length || 0;
    render('list-work', exps, 'work_experience', 'job_title');

    // Certification List
    const { data: certs } = await supabase.from('certifications').select('*').order('id', { ascending: false });
    if (document.getElementById('total-certification')) document.getElementById('total-certification').innerText = certs?.length || 0;
    render('list-certification', certs, 'certifications', 'name');

    // Volunteer List
    const { data: vols } = await supabase.from('volunteers').select('*').order('id', { ascending: false });
    if (document.getElementById('total-volunteer')) document.getElementById('total-volunteer').innerText = vols?.length || 0;
    render('list-volunteer', vols, 'volunteers', 'role');
}

function render(id, data, table, key) {
    const el = document.getElementById(id);
    if (!el) return; // Mencegah error jika ID tidak ada di HTML
    
    el.innerHTML = `<h4 class="list-head">Inputted Records:</h4>`;
    data?.forEach(item => {
        const div = document.createElement('div');
        div.className = 'manage-item';
        div.innerHTML = `
            <span>${item[key]}</span> 
            <button class="btn-delete" data-id="${item.id}" data-table="${table}">Delete</button>
        `;
        el.appendChild(div);
    });

    el.querySelectorAll('.btn-delete').forEach(btn => {
        btn.onclick = async () => {
            if (confirm('Delete this record?')) {
                await supabase.from(btn.dataset.table).delete().eq('id', btn.dataset.id);
                refreshLists();
            }
        };
    });
}

// --- 4. FORM SUBMITS ---

// Profile
const profileForm = document.getElementById('profile-form');
if (profileForm) {
    profileForm.onsubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('profiles').upsert({
            id: 1,
            full_name: "Toriq As Syarif",
            headline: document.getElementById('headline').value,
            about_text: document.getElementById('about_text').value
        });
        if (error) alert(error.message);
        else alert("Profile Updated!");
    };
}

// Project (PERBAIKAN DI SINI)
const projectForm = document.getElementById('project-form');
if (projectForm) {
    projectForm.onsubmit = async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.innerText = 'Adding...';

        try {
            const imgFile = document.getElementById('p-img').files[0];
            const imgUrl = await handleUpload(imgFile, 'projects');

            const { error } = await supabase.from('projects').insert([{
                title: document.getElementById('p-title').value,
                tech_stack: document.getElementById('p-tech').value.split(',').map(t => t.trim()),
                description: document.getElementById('p-desc').value,
                link_github: document.getElementById('p-link').value,
                image_url: imgUrl
            }]);

            if (error) throw error;
            alert("Project Added!");
            e.target.reset();
            refreshLists();
        } catch (err) {
            alert("Error: " + err.message);
        } finally {
            btn.innerText = 'Add Project';
        }
    };
}

// Jalankan Refresh saat awal
window.onload = refreshLists;
