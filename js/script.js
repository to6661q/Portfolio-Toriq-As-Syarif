// SMOOTH SCROLLING
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
// NAVBAR BACKGROUND VHANGE ON SCROLL
window.addEventListener('scroll', function() {
    const nav = document.querySelector('#navbar');
    if (window.scrollY > 150) {
        nav.style.opacity = 0.9;
    } else {
        nav.style.opacity = 1;
    }
});
