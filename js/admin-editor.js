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
