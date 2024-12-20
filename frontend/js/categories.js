document.addEventListener('DOMContentLoaded', () => {
    const categoryForm = document.getElementById('category-form');
    const categoriesList = document.getElementById('categories-list');
    const editCategoryModal = document.getElementById('edit-category-modal');
    const deleteCategoryModal = document.getElementById('delete-category-modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const closeDeleteModalBtn = document.getElementById('cancel-delete-btn');
    const editCategoryForm = document.getElementById('edit-category-form');
    const editCategoryIdInput = document.getElementById('edit-category-id');
    const editCategoryNameInput = document.getElementById('edit-category-name');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

    axios.defaults.baseURL = 'http://127.0.0.1:8000';

    async function loadCategories() {
        try {
            const response = await axios.get('/api/categories');
            console.log(response); 
            const categories = response.data;

            categoriesList.innerHTML = '';

            categories.forEach(category => {
                const categoryCard = document.createElement('div');
                categoryCard.classList.add('category-card');
            
                const categoryTitle = document.createElement('span');
                categoryTitle.textContent = category.name;
                categoryTitle.classList.add('category-title');
            
                const buttonRow = document.createElement('div');
                buttonRow.classList.add('button-row');
            
                const editButton = document.createElement('button');
                editButton.textContent = 'Modifier';
                editButton.classList.add('edit-btn');
                editButton.addEventListener('click', () => editCategory(category.id, category.name)); 
            
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Supprimer';
                deleteButton.classList.add('delete-btn');
                deleteButton.addEventListener('click', () => confirmDeleteCategory(category.id)); 
            
                buttonRow.appendChild(editButton);
                buttonRow.appendChild(deleteButton);
            
                categoryCard.appendChild(categoryTitle);
                categoryCard.appendChild(buttonRow);
            
                categoriesList.appendChild(categoryCard);
            });
        } catch (error) {
            console.error('Erreur de chargement des catégories', error);
        }
    }


    function editCategory(categoryId, currentName) {
        editCategoryIdInput.value = categoryId;
        editCategoryNameInput.value = currentName;

        editCategoryModal.style.display = 'flex';
    }


    closeModalBtn.addEventListener('click', () => {
        if (editCategoryModal) {
            editCategoryModal.style.display = 'none'; 
        }
        if (deleteCategoryModal) {
            deleteCategoryModal.style.display = 'none';
        }
    });



    closeDeleteModalBtn.addEventListener('click', () => {
        if (deleteCategoryModal) {
            deleteCategoryModal.style.display = 'none';
        }
    });



    editCategoryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const categoryId = editCategoryIdInput.value;
        const newCategoryName = editCategoryNameInput.value;

        try {
            await axios.put(`/api/categories/${categoryId}`, { name: newCategoryName });
            loadCategories();
            editCategoryModal.style.display = 'none'; 
            showMessage('Catégorie modifiée avec succès.', 'success');
        } catch (error) {
            console.error('Erreur lors de la modification de la catégorie', error);
            showMessage('Erreur lors de la modification de la catégorie.', 'error');
        }
    });



    let categoryToDelete = null;
    function confirmDeleteCategory(categoryId) {
        categoryToDelete = categoryId; 
        deleteCategoryModal.style.display = 'flex';
    }


    confirmDeleteBtn.addEventListener('click', async () => {
        if (categoryToDelete) {
            try {
                await axios.delete(`/api/categories/${categoryToDelete}`);
                loadCategories(); 
                deleteCategoryModal.style.display = 'none'; 
                showMessage('Catégorie supprimée avec succès.', 'success');
            } catch (error) {
                console.error('Erreur lors de la suppression de la catégorie', error);
                showMessage('Erreur lors de la suppression de la catégorie.', 'error');
            }
            
        }
    });


    categoryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const categoryName = document.getElementById('category-name').value;

        try {
            await axios.post('/api/categories', { name: categoryName });
            loadCategories();
            categoryForm.reset();
            showMessage('Catégorie ajoutée avec succès.', 'success');
        } catch (error) {
            console.error('Erreur d\'ajout de catégorie', error);
            showMessage('Erreur lors de l\'ajout de la catégorie.', 'error');
        }
        
    });


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
    
    

    loadCategories();
});
