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

// --- BAGIAN REFRESH LIST UNTUK PROJECT ---
async function refreshLists() {
    // Ambil data dari tabel 'projects'
    const { data: projs, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error("Error fetching projects:", error.message);
        return;
    }

    // Update Counter (ID: total-project)
    const counter = document.getElementById('total-project');
    if (counter) counter.innerText = projs?.length || 0;

    // Render ke List (ID: list-project)
    render('list-project', projs, 'projects', 'title');
    
    // ... (panggil refresh untuk work, certification, volunteer di bawahnya)
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
// --- HANDLER SUBMIT PROJECT ---
document.getElementById('project-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = 'Adding...';

    try {
        // Upload gambar ke folder 'projects'
        const imgFile = document.getElementById('p-img').files[0];
        const imgUrl = await handleUpload(imgFile, 'projects');

        // Insert ke tabel 'projects'
        const { error } = await supabase.from('projects').insert([{
            title: document.getElementById('p-title').value,
            tech_stack: document.getElementById('p-tech').value.split(',').map(t => t.trim()),
            description: document.getElementById('p-desc').value,
            link_github: document.getElementById('p-link').value,
            image_url: imgUrl
        }]);

        if (error) throw error;

        alert("Project Added Successfully!");
        e.target.reset(); // Kosongkan form
        refreshLists();   // Update tampilan list & counter
    } catch (err) {
        alert("Failed to add project: " + err.message);
    } finally {
        btn.innerText = 'Add Project';
    }
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
