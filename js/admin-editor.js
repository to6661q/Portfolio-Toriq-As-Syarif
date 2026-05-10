import { supabase } from './supabase-config.js';

let editingIds = { project: null, work: null, cert: null, volunteer: null };

// 1. REFRESH SEMUA DATA
async function refresh() {
    // Load Profile
    const { data: prof } = await supabase.from('profile').select('*').eq('id', 1).single();
    if (prof) {
        document.getElementById('headline').value = prof.headline;
        document.getElementById('about_text').value = prof.about_text;
    }

    render('project', 'list-project', 'title');
    render('work', 'list-work', 'job_position');
    render('cert', 'list-cert', 'name');
    render('volunteer', 'list-volunteer', 'role');
}

async function render(table, elId, key) {
    const { data } = await supabase.from(table).select('*').order('id', { ascending: false });
    const el = document.getElementById(elId);
    if (!el) return;
    el.innerHTML = data.map(d => `
        <div class="list-item">
            <span>${d[key]}</span>
            <div>
                <button onclick="window.prepareEdit('${table}', ${d.id})" style="color:blue; border:none; background:none; cursor:pointer;">Edit</button>
                <button onclick="window.del('${table}', ${d.id})" style="color:red; border:none; background:none; cursor:pointer; margin-left:10px;">Del</button>
            </div>
        </div>`).join('');
}

// 2. ACTIONS
window.del = async (table, id) => {
    if (confirm('Hapus data?')) {
        await supabase.from(table).delete().eq('id', id);
        refresh();
    }
};

window.prepareEdit = async (table, id) => {
    const { data: d } = await supabase.from(table).select('*').eq('id', id).single();
    if (!d) return;
    editingIds[table] = d.id;

    if (table === 'project') {
        document.getElementById('p-title').value = d.title;
        document.getElementById('p-desc').value = d.description;
        document.getElementById('p-link').value = d.link_github;
    } else if (table === 'work') {
        document.getElementById('e-title').value = d.job_position;
        document.getElementById('e-company').value = d.company;
        document.getElementById('e-duration').value = d.duration;
        document.getElementById('e-desc').value = d.description;
    } else if (table === 'cert') {
        document.getElementById('c-name').value = d.name;
        document.getElementById('c-pub').value = d.publisher;
    } else if (table === 'volunteer') {
        document.getElementById('v-role').value = d.role;
        document.getElementById('v-org').value = d.organization;
        document.getElementById('v-dur').value = d.duration;
    }
    document.querySelector(`#${table}-form button`).innerText = "Update Data";
};

// 3. SUBMITS
const handle = async (formId, table, type, payloadFn) => {
    const form = document.getElementById(formId);
    if (!form) return;
    form.onsubmit = async (e) => {
        e.preventDefault();
        const payload = payloadFn();
        if (editingIds[type]) {
            await supabase.from(table).update(payload).eq('id', editingIds[type]);
            editingIds[type] = null;
        } else {
            await supabase.from(table).insert([payload]);
        }
        e.target.reset();
        e.target.querySelector('button').innerText = `Add ${type}`;
        refresh();
    };
};

handle('profile-form', 'profile', 'profile', () => ({
    id: 1, headline: document.getElementById('headline').value, about_text: document.getElementById('about_text').value
}));

handle('project-form', 'project', 'project', () => ({
    title: document.getElementById('p-title').value, description: document.getElementById('p-desc').value, link_github: document.getElementById('p-link').value
}));

handle('work-form', 'work', 'work', () => ({
    job_position: document.getElementById('e-title').value, company: document.getElementById('e-company').value, duration: document.getElementById('e-duration').value, description: document.getElementById('e-desc').value
}));

handle('cert-form', 'cert', 'cert', () => ({
    name: document.getElementById('c-name').value, publisher: document.getElementById('c-pub').value
}));

handle('volunteer-form', 'volunteer', 'volunteer', () => ({
    role: document.getElementById('v-role').value, organization: document.getElementById('v-org').value, duration: document.getElementById('v-dur').value
}));

window.onload = refresh;
