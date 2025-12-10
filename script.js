function toggleMenu() {
    const navLinks = document.getElementById("navLinks");
    navLinks.classList.toggle("active");
}

function navigateTo(page) {
    showPage(page);
    // Close mobile menu after navigation
    const navLinks = document.getElementById("navLinks");
    navLinks.classList.remove("active");
}

function showPage(page) {
    const pages = ["home", "cakes", "snacks", "contact"];
    pages.forEach((p) => {
        const element = document.getElementById(p + "-page");
        if (element) {
            element.classList.add("hidden");
        }
    });

    const targetPage = document.getElementById(page + "-page");
    if (targetPage) {
        targetPage.classList.remove("hidden");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function handleSubmit(e) {
    e.preventDefault();
    alert("Thank you for your message! We will get back to you soon.");
    e.target.reset();
}
