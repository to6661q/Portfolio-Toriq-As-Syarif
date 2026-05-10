import { supabase } from './supabase-config.js';

// --- PROTECTIONS & LOGOUT ---
async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) window.location.href = 'login.html';
}
checkUser();

document.getElementById('logout-btn').onclick = async () => {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
};

// --- HELPER: SMOOTH SCROLL ---
document.querySelectorAll('.sidebar-nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({ top: target.offsetTop - 30, behavior: 'smooth' });
        }
    });
});

// --- HELPER: UPLOAD ---
async function handleUpload(file, folder) {
    if (!file) return null;
    const path = `${folder}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('portfolio_assets').upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from('portfolio_assets').getPublicUrl(path);
    return data.publicUrl;
}

// --- FETCH & REFRESH ---
async function refreshLists() {
    const { data: projs } = await supabase.from('projects').select('*').order('id', { ascending: false });
    if (document.getElementById('total-project')) document.getElementById('total-project').innerText = projs?.length || 0;
    render('list-project', projs, 'projects', 'title');

    const { data: exps } = await supabase.from('work_experience').select('*').order('id', { ascending: false });
    if (document.getElementById('total-work')) document.getElementById('total-work').innerText = exps?.length || 0;
    render('list-work', exps, 'work_experience', 'job_position');

    const { data: certs } = await supabase.from('certifications').select('*').order('id', { ascending: false });
    if (document.getElementById('total-certification')) document.getElementById('total-certification').innerText = certs?.length || 0;
    render('list-certification', certs, 'certifications', 'name');

    const { data: vols } = await supabase.from('volunteers').select('*').order('id', { ascending: false });
    if (document.getElementById('total-volunteer')) document.getElementById('total-volunteer').innerText = vols?.length || 0;
    render('list-volunteer', vols, 'volunteers', 'role');
}

function render(id, data, table, key) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = `<h4 class="list-head">Inputted Records:</h4>`;
    data?.forEach(item => {
        const div = document.createElement('div');
        div.className = 'manage-item';
        div.innerHTML = `<span>${item[key]}</span> <button class="btn-delete" data-id="${item.id}" data-table="${table}">Delete</button>`;
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

// --- SUBMIT HANDLERS ---
document.getElementById('profile-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = 'Updating...';

    const { error } = await supabase.from('profiles').upsert({
        id: 1,
        full_name: "Toriq As Syarif",
        headline: document.getElementById('headline').value,
        about_text: document.getElementById('about_text').value
    });

    if (error) alert("Update Failed: " + error.message);
    else alert("Personal Summary Updated!");
    btn.innerText = 'Update Personal Summary';
};

// Insert Project
document.getElementById('project-form').onsubmit = async (e) => {
    e.preventDefault();
    const img = await handleUpload(document.getElementById('p-img').files[0], 'projects');
    await supabase.from('projects').insert([{
        title: document.getElementById('p-title').value,
        tech_stack: document.getElementById('p-tech').value.split(','),
        description: document.getElementById('p-desc').value,
        image_url: img,
        link_github: document.getElementById('p-link').value
    }]);
    e.target.reset(); refreshLists(); alert("Project Added!");
};

window.onload = refreshLists;
