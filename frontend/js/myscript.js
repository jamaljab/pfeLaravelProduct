document.addEventListener('DOMContentLoaded', () => {
    const categoriesSection = document.getElementById('categories-section');
    const productsSection = document.getElementById('products-section');
    const linkCategories = document.getElementById('link-categories');
    const linkProducts = document.getElementById('link-products');

    function setActiveLink(activeLink) {
        document.querySelectorAll('.navbar a').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    function showDefaultSection() {
        categoriesSection.style.display = 'none'; 
        productsSection.style.display = 'block';
        setActiveLink(linkProducts); 
    }

    linkCategories.addEventListener('click', () => {
        categoriesSection.style.display = 'block';
        productsSection.style.display = 'none';
        setActiveLink(linkCategories); 
    });

    linkProducts.addEventListener('click', () => {
        categoriesSection.style.display = 'none';
        productsSection.style.display = 'block';
        setActiveLink(linkProducts);
    });

    showDefaultSection();
});
