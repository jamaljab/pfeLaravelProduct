document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('add-product-form');
    const editProductForm = document.getElementById('edit-product-form');
    const confirmDeleteBtn = document.getElementById('confirm-deleteProduct-btn');
    const addProductBtn = document.getElementById('add-product-btn');
    const editProductModal = document.getElementById('edit-product-modal');
    const deleteProductModal = document.getElementById('delete-product-modal');
    const addProductModal = document.getElementById('add-product-modal');
    const productsList = document.getElementById('products-list');   
    const canceldeleteProductbtn = document.querySelector('#cancel-deleteProduct-btn');
    const closeBtns = document.querySelectorAll('.close-btn');
    const imagePreview = document.getElementById('image-preview');   
    const priceSortSelect = document.getElementById('price-sort');

    let products = []; 


    addProductBtn.addEventListener('click', async () => {
        productForm.reset();
        imagePreview.style.display = 'none';
        addProductModal.style.display = 'block';
        await loadCategories();
    });



    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    window.addEventListener('click', (e) => {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none'; 
            }
        });
    });
    canceldeleteProductbtn.addEventListener('click', () => {
        if (deleteProductModal) {
            deleteProductModal.style.display = 'none';
        }
    });




    async function loadProducts() {
        try {
            const response = await axios.get('/api/products');
            products = response.data;
            const categoryFilter = document.getElementById('category-filter');

            categoryFilter.innerHTML = '<option value="">Tous les produits</option>';
            
            const categories = new Set();
            
            productsList.innerHTML = ''; 
            
            products.forEach(product => {
                categories.add(product.category.id);
                const categoryOption = `<option value="${product.category.id}">${product.category.name}</option>`;
                if (!categoryFilter.innerHTML.includes(categoryOption)) {
                    categoryFilter.innerHTML += categoryOption;
                }
            });
            
            filterProducts('');
        } catch (error) {
            console.error('Erreur de chargement des produits', error);
        }
    }



    function displayProducts(products) {
        productsList.innerHTML = '';
        products.forEach(product => {
            const productCard = createProductCard(product);
            productsList.appendChild(productCard);
        });
    }



    function createProductCard(product) {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        
        const productImage = document.createElement('img');
        productImage.src = product.image ? `http://localhost:8000/images/${product.image}` : '/image/defaultImage.png';
        productImage.alt = product.name;
        
        const productName = document.createElement('h3');
        productName.textContent = product.name;
        
        const productDescription = document.createElement('p');
        productDescription.textContent = product.description;
        
        const productPrice = document.createElement('p');
        productPrice.textContent = `Prix: ${product.price} dh`;
        
        const productCategory = document.createElement('p');
        productCategory.textContent = `Catégorie: ${product.category.name}`;
        
        const buttonRow = document.createElement('div');
        buttonRow.classList.add('button-row');
        
        const editButton = document.createElement('button');
        editButton.textContent = 'Modifier';
        editButton.classList.add('edit-btn');
        editButton.addEventListener('click', () => editProduct(product.id, product.name, product.description, product.price, product.category.id));
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Supprimer';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', () => confirmDeleteProduct(product.id));
        
        buttonRow.appendChild(editButton);
        buttonRow.appendChild(deleteButton);
        
        productCard.appendChild(productImage);
        productCard.appendChild(productName);
        productCard.appendChild(productDescription);
        productCard.appendChild(productPrice);
        productCard.appendChild(productCategory);
        productCard.appendChild(buttonRow);
        
        return productCard;
    }



    function filterProducts(categoryId) {
        const filteredProducts = categoryId ? products.filter(product => product.category.id == categoryId) : products;
        displayProducts(filteredProducts);
    }



    const categoryFilter = document.getElementById('category-filter');
    categoryFilter.addEventListener('change', (e) => {
        filterProducts(e.target.value);
    });




    async function loadCategories() {
        try {
            const response = await axios.get('/api/categories');
            const categories = response.data;
            const categorySelectAdd = document.querySelector('select[name="category_id"]');
            const categorySelectUpdate = document.getElementById('edit-product-category');
    
            categorySelectAdd.innerHTML = '<option value="">Sélectionner une catégorie</option>';
            categorySelectUpdate.innerHTML = '<option value="">Sélectionner une catégorie</option>';
    
            categories.forEach(category => {
                const option = `<option value="${category.id}">${category.name}</option>`;
                categorySelectAdd.innerHTML += option;
                categorySelectUpdate.innerHTML += option;
            });
        } catch (error) {
            console.error('Erreur de chargement des catégories', error);
        }
    }




    function editProduct(productId, currentName, currentDescription, currentPrice, currentCategoryId) {
        document.getElementById('edit-product-id').value = productId;
        document.getElementById('edit-product-name').value = currentName;
        document.getElementById('edit-product-description').value = currentDescription;
        document.getElementById('edit-product-price').value = currentPrice;
    
        loadCategories().then(() => {
            document.getElementById('edit-product-category').value = currentCategoryId;
            editProductModal.style.display = 'flex';
        });
    }




    editProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const productId = document.getElementById('edit-product-id').value;
        const newProductName = document.getElementById('edit-product-name').value;
        const newProductDescription = document.getElementById('edit-product-description').value;
        const newProductPrice = document.getElementById('edit-product-price').value;
        const newProductCategorie = document.getElementById('edit-product-category').value;
        
        try {
            await axios.put(`/api/products/${productId}`, { 
                name: newProductName,
                description: newProductDescription,
                price: newProductPrice,
                category_id: newProductCategorie,
            });
            loadProducts();
            editProductModal.style.display = 'none';
            showMessage('Produit modifié avec succès', 'success');
        } catch (error) {
            console.error('Erreur de mise à jour du produit', error);
            showMessage('Erreur lors de la modification du produit', 'error');
        }
    });
    





    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(productForm);
        try {
            await axios.post('/api/products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            loadProducts();
            addProductModal.style.display = 'none';
            showMessage('Produit ajouté avec succès', 'success');
        } catch (error) {
            console.error('Erreur d\'ajout du produit', error);
            showMessage('Erreur lors de l\'ajout du produit', 'error');
        }
    });





    function confirmDeleteProduct(productId) {
        productToDelete = productId;
        deleteProductModal.style.display = 'block';
    }

    confirmDeleteBtn.addEventListener('click', async () => {
        if (productToDelete) {
            try {
                await axios.delete(`/api/products/${productToDelete}`);
                loadProducts();
                productToDelete = null;
                deleteProductModal.style.display = 'none';
                showMessage('Produit supprimé avec succès', 'success');
            } catch (error) {
                console.error('Erreur de suppression du produit', error);
                showMessage('Erreur lors de la suppression du produit', 'error');
            }
        }
    });
    






    document.querySelector('input[name="image"]').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                imagePreview.style.display = 'block';
                imagePreview.src = reader.result;
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.style.display = 'none';
        }
    });





    priceSortSelect.addEventListener('change', function() {
        const selectedOrder = priceSortSelect.value;
        const sortedProducts = sortProductsByPrice(products, selectedOrder);
        displayProducts(sortedProducts);
    });



    function sortProductsByPrice(products, order) {
        return products.sort((a, b) => {
            if (order === 'asc') {
                return a.price - b.price;
            } else if (order === 'desc') {
                return b.price - a.price;
            }
            return 0;
        });
    }




    function showMessage(message, type) {
        const messageContainer = document.getElementById('message-container');
        messageContainer.textContent = message;
        
        if (type === 'success') {
            messageContainer.style.backgroundColor = 'green';
            messageContainer.style.color = 'white';
        } else if (type === 'error') {
            messageContainer.style.backgroundColor = 'red';
            messageContainer.style.color = 'white';
        }
        
        messageContainer.style.display = 'block';
        
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 3000);
    }
    


    
    loadProducts();
});
