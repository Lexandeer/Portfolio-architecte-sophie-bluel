// Récupère les projets depuis l'API
export async function fetchProjets() {
    const reponse = await fetch("http://localhost:5678/api/works");
    const projets = await reponse.json();// .json() converti le texte(la réponse) en objet JS utilisable 
    return projets;
}

// Récupère les catégories depuis l'API
export async function fetchCategories() {
    const reponse = await fetch("http://localhost:5678/api/categories");
    const categories = await reponse.json(); 
    return categories;
}

// Ajoute dynamiquement les projets sur la page index 
export function ajouterProjets(projets) {  // Prend en paramètre la réponse de fetchProjets
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

// Ajoute dynamiquement les catégories pour trier les projets 
export function ajouterCategories(categories) { // Prend en paramètre la réponse de fetchCatégories

    const divCategorie = document.querySelector('.categorie');

    // On crée une boucle pour ajouter les catégories (filtres)
    categories.forEach(categorie => {
        const bouton = document.createElement('button');
        bouton.innerText = categorie.name;
        bouton.classList.add(`btn-${categorie.id}`); // On attribut une class aux boutons en fonction de leur catégories.
        // Ajout de l'ID de la catégorie comme attribut de données
        bouton.setAttribute('data-id', categorie.id); //<- permet de savoir sur quel bouton on clique
        divCategorie.appendChild(bouton);
    });
}

// Vérifie si l'utilisateur est connecté en vérifiant la présence du token dans le localStorage
export function estConnecte() {
    return localStorage.getItem('authToken') !== null;
}

// Gestion de la déconnexion
export function deconnecter() {
    localStorage.removeItem('authToken');
    window.location.href = "index.html"; // Recharge la page après déconnexion
}

// Affiche ou masque les éléments de modification en fonction de l'état de connexion
export function afficherApresConnexion() {
    const boutonModifier = document.querySelector('.js-modal-open');
    const boutonLogin = document.getElementById('login');
    const boutonLogout = document.getElementById('logout');
    const bandeauEdition = document.querySelector('.bandeau_edition');

    if (estConnecte()) {
        boutonModifier.style.display = 'block';
        boutonLogin.style.display = 'none';
        boutonLogout.style.display = 'block';
        bandeauEdition.style.display = 'flex';
    } else {
        boutonModifier.style.display = 'none';
        boutonLogin.style.display = 'block';
        boutonLogout.style.display = 'none';
        bandeauEdition.style.display = 'none';
    }
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
            <img id="preview" style="display:none;"/>
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
        <p class="error-message" style="color:red; display:none;"></p>
    `;
    modalContent.appendChild(form);

    // Récupérer les catégories et les ajouter au selecteur
    fetchCategories().then(categories => {      //Pour chaque catégories on ajoute une option au selecteur
        const selectCategorie = form.querySelector('#category');
        categories.forEach(categorie => {
            const option = document.createElement('option');
            option.value = categorie.id;
            option.textContent = categorie.name;
            selectCategorie.appendChild(option);
        });
    });

    // Permet de déclancher la fenêtre de selection de fichier lorsque l'on clique sur le bouton
    const addPhotoBtn = form.querySelector('.photo button');
    addPhotoBtn.addEventListener('click', (event) => {
        event.preventDefault();
        form.querySelector('#image').click();
    });

    // Ajoutez un écouteur d'événement pour l'input file pour afficher l'aperçu de l'image
    const imageInput = form.querySelector('#image');
    const previewImage = form.querySelector('#preview');
    const photoDiv = form.querySelector('.photo');
    const errorMessage = form.querySelector('.error-message'); // Récupère l'élément du message d'erreur

    imageInput.addEventListener('change', (event) => { // Ajoute un écouteur sur le champ de fichier qui se déclenche lorsque la sélection de fichier change.
        const file = event.target.files[0]; // On selectionne le fichier en question
        if (file) {                         
            if (file.size > 4 * 1024 * 1024) { // Vérifie si le fichier dépasse 4 Mo
                errorMessage.textContent = 'Le fichier dépasse la taille maximale de 4 Mo.';
                errorMessage.style.display = 'block'; // Affiche le message d'erreur
                imageInput.value = ''; // Réinitialise le champ de fichier
                console.log(errorMessage)
            } else {
                const reader = new FileReader();
                reader.onload = (e) => {  //définit ce qui se passe une fois le fichier lu
                    previewImage.src = e.target.result; //Affiche l'image une fois le fichier lu
                    previewImage.style.display = 'block'; // Affiche l'image de prévisualisation
                    photoDiv.style.padding = '0';

                    // Cache les autres éléments
                    form.querySelector('.photo i').style.display = 'none';
                    form.querySelector('.photo label').style.display = 'none';
                    form.querySelector('.photo p').style.display = 'none';
                };
                reader.readAsDataURL(file);
                errorMessage.style.display = 'none'; // Cache le message d'erreur si le fichier est valide
            }
        }
    });

    // Mettre à jour le texte du bouton
    addPictureBtn.textContent = 'Valider';

    // On s'assure de ne pas avoir plusieurs écouteurs
    addPictureBtn.removeEventListener('click', afficherEtat2);
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
    errorMessage.textContent = 'Remplissez tous les champs'; // Préremplir le message d'erreur

    console.log("FormData before validation:", Array.from(formData.entries())); // Log to check FormData entries before validation

    // On vérifie que tous les champs soient bien remplis
    if (!formData.get('image') || !formData.get('title') || !formData.get('category')) {
        console.log("Erreur : Tous les champs ne sont pas remplis.");
        errorMessage.style.display = 'block'; // Affiche le message d'erreur
        errorMessage.style.color = 'red';
        console.log("Message d'erreur message après affichage:", errorMessage); 
        return;
    }

    try {
        const authToken = localStorage.getItem('authToken');
        console.log("Authorization token:", authToken); // Log to check the authorization token

        const response = await fetch("http://localhost:5678/api/works", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });

        console.log("Response status:", response.status); // Log to check response status

        if (response.ok) {
            const newProjet = await response.json();
            ajouterProjets([newProjet]); // On ajoute le nouveau projet à la galerie sur la page d'accueil
            modal.style.display = 'none'; // On ferme la modale après l'ajout réussi
        } else {
            const error = await response.json();
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block'; // Affiche le message d'erreur de l'API
            errorMessage.style.color = 'red';
            console.log("Erreur de l'API:", error.message); // Log to check error message from API
        }
    } catch (error) {
        errorMessage.textContent = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        errorMessage.style.display = 'block'; // Affiche le message d'erreur générique
        errorMessage.style.color = 'red';
        console.log("Erreur de catch:", error); // Log to check catch error
    }
}