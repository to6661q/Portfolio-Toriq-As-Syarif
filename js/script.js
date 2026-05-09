// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const nav = document.querySelector('#navbar');
    if (window.scrollY > 150) {
        nav.style.opacity = 0.9;
    } else {
        nav.style.opacity = 1;
    }
});
