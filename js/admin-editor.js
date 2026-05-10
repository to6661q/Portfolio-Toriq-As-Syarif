import { supabase } from './supabase-config.js';

let editingProjectId = null; // Menyimpan ID projek yang sedang diedit

// --- 1. PROTECTIONS & LOGOUT ---
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

    // 1. Definisikan Path (Folder/NamaFile)
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // 2. Upload file ke Supabase Storage
    const { error: uploadError } = await supabase.storage
        .from('portfolio_assets')
        .upload(filePath, file);

    if (uploadError) {
        console.error("Upload Error Details:", uploadError);
        return null;
    }

    // 3. Ambil Public URL yang benar-benar bersih
    const { data } = supabase.storage
        .from('portfolio_assets')
        .getPublicUrl(filePath);

    if (!data || !data.publicUrl) {
        console.error("Gagal mendapatkan Public URL");
        return null;
    }

    console.log("Image Uploaded Successfully:", data.publicUrl);
    return data.publicUrl;
}

// --- 3. REFRESH & RENDER (WITH EDIT BUTTON) ---
async function refreshLists() {
    // Project List
    const { data: projs } = await supabase.from('projects').select('*').order('id', { ascending: false });
    if (document.getElementById('total-project')) document.getElementById('total-project').innerText = projs?.length || 0;
    
    // Render Project dengan tombol Edit & Delete
    const projEl = document.getElementById('list-project');
    if (projEl) {
        projEl.innerHTML = `<h4 class="list-head">Inputted Records:</h4>`;
        projs?.forEach(item => {
            const div = document.createElement('div');
            div.className = 'manage-item';
            div.style = "display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee;";
            div.innerHTML = `
                <span>${item.title}</span>
                <div class="actions">
                    <button class="btn-edit" data-id="${item.id}" style="background: #ffc107; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px;">Edit</button>
                    <button class="btn-delete" data-id="${item.id}" data-table="projects" style="background: #ff4757; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Delete</button>
                </div>
            `;
            projEl.appendChild(div);
        });

        // Event Listener Edit
        projEl.querySelectorAll('.btn-edit').forEach(btn => {
            btn.onclick = () => prepareEditProject(btn.dataset.id, projs);
        });

        // Event Listener Delete
        projEl.querySelectorAll('.btn-delete').forEach(btn => {
            btn.onclick = async () => {
                if (confirm('Delete this record?')) {
                    await supabase.from(btn.dataset.table).delete().eq('id', btn.dataset.id);
                    refreshLists();
                }
            };
        });
    }
}

// Fungsi Menyiapkan Form untuk Edit
function prepareEditProject(id, projs) {
    const item = projs.find(p => p.id == id);
    if (item) {
        editingProjectId = item.id;
        document.getElementById('p-title').value = item.title;
        document.getElementById('p-tech').value = item.tech_stack?.join(', ') || '';
        document.getElementById('p-desc').value = item.description || '';
        document.getElementById('p-link').value = item.link_github || '';
        
        // Ubah Teks Tombol
        const submitBtn = document.querySelector('#project-form button[type="submit"]');
        submitBtn.innerText = "Update Project";
        submitBtn.style.background = "#ffc107";
        
        // Scroll ke form agar Toriq tidak bingung
        document.getElementById('project').scrollIntoView({ behavior: 'smooth' });
    }
}

// --- 4. FORM SUBMIT (INSERT OR UPDATE) ---
const projectForm = document.getElementById('project-form');
if (projectForm) {
    projectForm.onsubmit = async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const oldText = btn.innerText;
        btn.innerText = 'Processing...';

        try {
            const imgFile = document.getElementById('p-img').files[0];
            let imgUrl = await handleUpload(imgFile, 'projects');

            const payload = {
                title: document.getElementById('p-title').value,
                tech_stack: document.getElementById('p-tech').value.split(',').map(t => t.trim()),
                description: document.getElementById('p-desc').value,
                link_github: document.getElementById('p-link').value
            };

            // Jika ada gambar baru, tambahkan ke payload
            if (imgUrl) payload.image_url = imgUrl;

            let result;
            if (editingProjectId) {
                // LOGIKA UPDATE
                result = await supabase.from('projects').update(payload).eq('id', editingProjectId);
            } else {
                // LOGIKA INSERT
                result = await supabase.from('projects').insert([payload]);
            }

            if (result.error) throw result.error;

            alert(editingProjectId ? "Project Updated!" : "Project Added!");
            
            // Reset Form & Mode
            editingProjectId = null;
            btn.innerText = "Add Project";
            btn.style.background = "#006661";
            e.target.reset();
            refreshLists();
        } catch (err) {
            alert("Error: " + err.message);
        } finally {
            btn.innerText = editingProjectId ? "Update Project" : "Add Project";
        }
    };
}

// Profile Submit
document.getElementById('profile-form').onsubmit = async (e) => {
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

window.onload = refreshLists;
