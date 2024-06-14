export async function fetchProjets() {
    const reponse = await fetch("http://localhost:5678/api/works");
    const projets = await reponse.json();
    return projets;
}

export async function fetchCategories() {
    const reponse = await fetch("http://localhost:5678/api/categories");
    const categories = await reponse.json();
    return categories;
}

export function ajouterCategories(categories) {

    const divCategorie = document.querySelector('.categorie');

    // On crée une boucle pour ajouter les catégories (filtres)
    categories.forEach(categorie => {
        const bouton = document.createElement('button');
        bouton.innerText = categorie.name;
        bouton.classList.add(`btn-${categorie.id}`);
        // Ajout de l'ID de la catégorie comme attribut de données
        bouton.setAttribute('data-id', categorie.id); 
        divCategorie.appendChild(bouton);
    });
}

export function ajouterProjets(projets) {
    const gallery = document.querySelector("#portfolio .gallery");
    gallery.innerHTML = ''; // Effacer le contenu existant avant d'ajouter les nouveaux projets

    projets.forEach(projet => {
        const figure = document.createElement('figure');

        const imageElement = document.createElement("img");
        imageElement.src = projet.imageUrl;
        imageElement.alt = projet.title;

        const figcaptionElement = document.createElement("figcaption");
        figcaptionElement.innerText = projet.title;

        figure.appendChild(imageElement);
        figure.appendChild(figcaptionElement);

        gallery.appendChild(figure);
    });
}

// Fonction pour afficher l'état 1 de la modale
export function afficherEtat1(modalContent, addPictureBtn, backModalBtn) {
    // On nettoie le contenu
    modalContent.innerHTML = '';

    // On ajoute le titre
    const titre = document.createElement('h2');
    titre.textContent = 'Galerie photo';
    modalContent.appendChild(titre);

    // On ajoute la div container pour les photos
    const photosContainer = document.createElement('div');
    photosContainer.classList.add('photos-container');
    modalContent.appendChild(photosContainer);

    // On ajoute les images des projets
    fetchProjets().then(projets => {
        projets.forEach(projet => {
            const projetWrapper = document.createElement('div');
            projetWrapper.classList.add('projet-wrapper');

            const img = document.createElement('img');
            img.src = projet.imageUrl;
            img.alt = projet.title;

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';

            // Ajout de l'écouteur d'événement pour la suppression
            deleteBtn.addEventListener('click', async () => {
                await supprimerProjet(projet.id, projetWrapper);
            });

            projetWrapper.appendChild(img);
            projetWrapper.appendChild(deleteBtn);
            photosContainer.appendChild(projetWrapper);
        });
    });

    // Mettre à jour le texte du bouton
    addPictureBtn.textContent = 'Ajouter une photo';
    // Cacher le bouton de retour
    backModalBtn.style.display = 'none';

    // On s'assure de ne pas avoir plusieurs écouteurs
    addPictureBtn.removeEventListener('click', formSubmit);
    addPictureBtn.addEventListener('click', () => {
        afficherEtat2(modalContent, backModalBtn, addPictureBtn);
    });
}

// Fonction pour afficher l'état 2 de la modale
export function afficherEtat2(modalContent, backModalBtn, addPictureBtn, modal) {
    // On nettoie le contenu
    modalContent.innerHTML = '';

    // On ajoute le titre
    const titre = document.createElement('h2');
    titre.textContent = 'Ajout photo';
    modalContent.appendChild(titre);

    // On affiche le bouton de retour
    backModalBtn.style.display = 'block';

    // On ajoute le formulaire d'ajout de photo
    const form = document.createElement('form');
    form.classList.add('modal-form');
    form.innerHTML = `
        <div class="photo">
            <i class="fa-regular fa-image"></i>
            <label for="image"><button>+ Ajouter photo</button></label>
            <p>jpg, png : 4mo max</p>
        </div>
        <input type="file" id="image" name="image" accept="image/*">
        <label for="title" class="label">Titre:</label>
        <input type="text" id="title" name="title">
        <label for="category" class="label">Catégorie:</label>
        <select id="category" name="category">
            <option value="">Sélectionnez une catégorie</option>
        </select>
        <p class="error-message" style="color:red;"></p>
    `;
    modalContent.appendChild(form);

    // Récupérer les catégories et les ajouter au dropdown
    fetchCategories().then(categories => {
        const selectCategorie = form.querySelector('#category');
        categories.forEach(categorie => {
            const option = document.createElement('option');
            option.value = categorie.id;
            option.textContent = categorie.name;
            selectCategorie.appendChild(option);
        });
    });

    // Ajoutez un gestionnaire d'événement pour le bouton "Ajouter photo"
    const addPhotoBtn = form.querySelector('.photo button');
    addPhotoBtn.addEventListener('click', (event) => {
        event.preventDefault();
        form.querySelector('#image').click();
    });

    // Mettre à jour le texte du bouton
    addPictureBtn.textContent = 'Valider';

    addPictureBtn.removeEventListener('click', formSubmit);
    addPictureBtn.addEventListener('click', (event) => {
        event.preventDefault();
        formSubmit(form, modal);
    });
}

// Gestion de la suppression des projets dans la modale(Etat1)
export async function supprimerProjet(projetId, projetWrapper) {
    try {
        const response = await fetch(`http://localhost:5678/api/works/${projetId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        if (response.ok) {
            // Supprimer l'élément de projet du DOM
            projetWrapper.remove();
            // Mettre à jour la liste des projets sur la page d'accueil
            const projets = await fetchProjets();
            ajouterProjets(projets);
        } else {
            console.error("Erreur lors de la suppression du projet:", await response.json());
        }
    } catch (error) {
        console.error("Erreur lors de la suppression du projet:", error);
    }
}

// Gestion de la soumission du formulaire
export async function formSubmit(form, modal) {
    const formData = new FormData(form);
    const errorMessage = form.querySelector('.error-message');
    errorMessage.textContent = ''; // Réinitialise le message d'erreur

    // On vérifie que tous les champs soient bien remplis
    if (!formData.get('image') || !formData.get('title') || !formData.get('category')) {
        errorMessage.textContent = 'Veuillez remplir tous les champs.';
        return;
    }

    // Vérifiez si le token est présent dans localStorage
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        errorMessage.textContent = 'Vous devez être connecté pour ajouter un projet.';
        return;
    }

    try {
        // Vérifiez que le token est bien passé dans l'en-tête Authorization
        console.log('Authorization:', `Bearer ${authToken}`);

        const response = await fetch("http://localhost:5678/api/works", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });

        console.log('Response:', response);

        if (response.ok) {
            const newProjet = await response.json();
            // On ajoute le nouveau projet à la galerie sur la page d'accueil
            ajouterProjets([newProjet]); 
            // On ferme la modale après l'ajout réussi
            modal.style.display = 'none'; 
            // On recharge la page pour afficher le nouveau projet
            window.location.reload();
        } else {
            if (response.status === 400) {
                errorMessage.textContent = 'Requête incorrecte. Veuillez vérifier les données envoyées.';
            } else if (response.status === 401) {
                errorMessage.textContent = 'Vous n\'êtes pas autorisé à effectuer cette action.';
            } else if (response.status === 500) {
                errorMessage.textContent = 'Erreur du serveur. Veuillez réessayer plus tard.';
            } else {
                const error = await response.json();
                errorMessage.textContent = error.message;
            }
        }
    } catch (error) {
        errorMessage.textContent = 'Une erreur est survenue. Veuillez réessayer plus tard.';
    }
}