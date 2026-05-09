import { supabase } from './supabase-config.js';

// --- 1. PROTEKSI ---
async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) window.location.href = 'login.html';
}
checkUser();

document.getElementById('logout-btn').onclick = async () => {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
};

// --- 2. HELPER UPLOAD ---
async function handleUpload(file, folder) {
    if (!file) return null;
    const path = `${folder}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('portfolio_assets').upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from('portfolio_assets').getPublicUrl(path);
    return data.publicUrl;
}

// --- 3. REFRESH DATA ---
async function refreshLists() {
    const { data: projs } = await supabase.from('projects').select('*').order('id', { ascending: false });
    render('list-projek', projs, 'projects', 'title');

    const { data: exps } = await supabase.from('work_experience').select('*').order('id', { ascending: false });
    render('list-pengalaman', exps, 'work_experience', 'job_title');

    const { data: certs } = await supabase.from('certificates').select('*').order('id', { ascending: false });
    render('list-sertifikat', certs, 'certificates', 'title');
}

function render(id, data, table, key) {
    const el = document.getElementById(id);
    el.innerHTML = `<h4 class="list-head">Daftar Terinput:</h4>`;
    data?.forEach(item => {
        const div = document.createElement('div');
        div.className = 'manage-item';
        div.innerHTML = `<span>${item[key]}</span> <button class="btn-delete" data-id="${item.id}" data-table="${table}">Hapus</button>`;
        el.appendChild(div);
    });

    el.querySelectorAll('.btn-delete').forEach(btn => {
        btn.onclick = async () => {
            if (confirm('Hapus data?')) {
                await supabase.from(btn.dataset.table).delete().eq('id', btn.dataset.id);
                refreshLists();
            }
        };
    });
}

// --- 4. SUBMIT HANDLERS ---
document.getElementById('profile-form').onsubmit = async (e) => {
    e.preventDefault();
    await supabase.from('profiles').upsert({
        id: 1,
        headline: document.getElementById('headline').value,
        about_text: document.getElementById('about_text').value,
        updated_at: new Date()
    });
    alert("Profil diperbarui!");
};

document.getElementById('project-form').onsubmit = async (e) => {
    e.preventDefault();
    const img = await handleUpload(document.getElementById('p-img').files[0], 'projects');
    await supabase.from('projects').insert([{
        title: document.getElementById('p-title').value,
        tech_stack: document.getElementById('p-tech').value.split(',').map(t => t.trim()),
        image_url: img,
        link_github: document.getElementById('p-link').value
    }]);
    e.target.reset(); refreshLists(); alert("Sukses!");
};

document.getElementById('exp-form').onsubmit = async (e) => {
    e.preventDefault();
    await supabase.from('work_experience').insert([{
        job_title: document.getElementById('e-title').value,
        company: document.getElementById('e-company').value,
        duration: document.getElementById('e-duration').value,
        description: document.getElementById('e-desc').value
    }]);
    e.target.reset(); refreshLists(); alert("Sukses!");
};

document.getElementById('cert-form').onsubmit = async (e) => {
    e.preventDefault();
    const img = await handleUpload(document.getElementById('c-img').files[0], 'certificates');
    await supabase.from('certificates').insert([{
        title: document.getElementById('c-title').value,
        issuer: document.getElementById('c-issuer').value,
        image_url: img
    }]);
    e.target.reset(); refreshLists(); alert("Sukses!");
};

window.onload = refreshLists;

// --- JAVASCRIPT SMOOTH SCROLL FALLBACK ---
document.querySelectorAll('.sidebar-nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // Menghitung posisi dengan offset agar tidak tertutup header jika ada
            const offset = 30; 
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Update class active pada menu
            document.querySelectorAll('.sidebar-nav a').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        }
    });
});
