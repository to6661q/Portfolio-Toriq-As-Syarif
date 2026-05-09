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

// --- CALCULATION HELPER ---
function calculateTotalYears(durations) {
    let total = 0;
    durations.forEach(str => {
        const years = str.match(/\d{4}/g);
        if (years && years.length === 2) {
            total += (parseInt(years[1]) - parseInt(years[0]));
        } else if (years && str.toLowerCase().includes('present')) {
            total += (new Date().getFullYear() - parseInt(years[0]));
        }
    });
    return total;
}

// --- FETCH & REFRESH ---
async function refreshLists() {
    // Projects
    const { data: projs } = await supabase.from('projects').select('*').order('id', { ascending: false });
    document.getElementById('total-projects').innerText = projs?.length || 0;
    render('list-projek', projs, 'projects', 'title');

    // Experience
    const { data: exps } = await supabase.from('work_experience').select('*').order('id', { ascending: false });
    document.getElementById('total-exp').innerText = exps?.length || 0;
    document.getElementById('total-duration').innerText = calculateTotalYears(exps?.map(e => e.duration) || []);
    render('list-pengalaman', exps, 'work_experience', 'job_title');

    // Certificates
    const { data: certs } = await supabase.from('certificates').select('*').order('id', { ascending: false });
    document.getElementById('total-certs').innerText = certs?.length || 0;
    render('list-sertifikat', certs, 'certificates', 'title');
}

function render(id, data, table, key) {
    const el = document.getElementById(id);
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
    await supabase.from('profiles').upsert({
        id: 1,
        headline: document.getElementById('headline').value,
        about_text: document.getElementById('about_text').value
    });
    alert("Profile Updated Successfully!");
};

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

document.getElementById('exp-form').onsubmit = async (e) => {
    e.preventDefault();
    const img = await handleUpload(document.getElementById('e-img').files[0], 'experience');
    await supabase.from('work_experience').insert([{
        job_title: document.getElementById('e-title').value,
        company: document.getElementById('e-company').value,
        duration: document.getElementById('e-duration').value,
        description: document.getElementById('e-desc').value,
        image_url: img
    }]);
    e.target.reset(); refreshLists(); alert("Experience Added!");
};

document.getElementById('cert-form').onsubmit = async (e) => {
    e.preventDefault();
    const img = await handleUpload(document.getElementById('c-img').files[0], 'certificates');
    await supabase.from('certificates').insert([{
        title: document.getElementById('c-title').value,
        issuer: document.getElementById('c-issuer').value,
        description: document.getElementById('c-desc').value,
        image_url: img
    }]);
    e.target.reset(); refreshLists(); alert("Certificate Added!");
};

window.onload = refreshLists;
