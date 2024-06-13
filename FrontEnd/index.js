//On importe les fonctions depuis utils.js
import { fetchProjets, fetchCategories, ajouterCategories, ajouterProjets } from './utils.js'


// Vérifie si l'utilisateur est connecté en vérifiant la présence du token dans le localStorage
function estConnecte() {
    return localStorage.getItem('authToken') !== null;
}

// Affiche ou masque les éléments de modification en fonction de l'état de connexion
function afficherModal() {
    const boutonModifier = document.querySelector('.js-modal-open');
    const boutonLogout = document.getElementById('logout');

    if (estConnecte()) {
        boutonModifier.style.display = 'block';
        boutonLogout.style.display = 'block';
    } else {
        boutonModifier.style.display = 'none';
        boutonLogout.style.display = 'none';
    }
}

// Gestion de la déconnexion
function deconnecter() {
    localStorage.removeItem('authToken');
    window.location.href = "index.html"; // Recharge la page après déconnexion
}

// Ajout de l'écouteur d'événement pour le bouton de déconnexion
document.getElementById('logout').addEventListener('click', (event) => {
    event.preventDefault();
    deconnecter();
});


//On s'assure que le DOM soit chargé et analysé.
document.addEventListener('DOMContentLoaded', async () => {
    afficherModal()
    
    const portFolio = document.getElementById("portfolio");
    const gallery = document.querySelector("#portfolio .gallery");

    // Initialisation de la div pour les catégories
    const divCategorie = document.createElement('div');
    divCategorie.classList.add('categorie');

    // On insère la div catégorie avant la div gallery
    portFolio.insertBefore(divCategorie, gallery);

    //On créer le bouton "Tous".
    const tous = document.createElement('button');
    tous.classList.add('btn-0');
    tous.innerText = "Tous";
    // Ajout de l'ID pour "Tous"
    tous.setAttribute('data-id', 0); 
    divCategorie.appendChild(tous);

    let projets = [];
    let categories = [];

    // Récupération et affichage des projets
    try {
        projets = await fetchProjets();
        ajouterProjets(projets);
    } catch (error) {
        console.error("Erreur lors de la récupération des projets:", error);
    }

    // Récupération et affichage des catégories
    try {
        categories = await fetchCategories();
        ajouterCategories(categories)
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
    }

    // Sélection des boutons après leur création
    const tousBtn = document.querySelector('.btn-0');
    const objetsBtn = document.querySelector('.btn-1');
    const appartementsBtn = document.querySelector('.btn-2');
    const hotelsEtRestaurantsBtn = document.querySelector('.btn-3');

    const boutons = [tousBtn, objetsBtn, appartementsBtn, hotelsEtRestaurantsBtn];
    
    // Ajout des écouteurs d'événements aux boutons de filtre
    boutons.forEach(bouton => {
        bouton.addEventListener("click", async function(event) {

            //On réinitialise la couleur des boutons
            boutons.forEach(btn => {
                btn.style.backgroundColor = '';
                btn.style.color = '';
            });
            // On change la couleur de fond du bouton et la couleur du texte
            bouton.style.backgroundColor = '#1D6154';
            bouton.style.color = 'white';

            //On recupère l'ID du bouton cliqué
            const idCategorie = event.target.getAttribute('data-id');
            
            // Filtrage des projets
            const projetsFiltres = idCategorie == 0 ? projets : projets.filter(projet => projet.categoryId == idCategorie);

            // Affichage des projets filtrés
            ajouterProjets(projetsFiltres);
            
        });
    });
});




// Boîte modale :

const openModalBtn = document.querySelector('a[href="#modal1"]');
const modal = document.getElementById('modal1');
const modalWrapper = modal.querySelector('.modal-wrapper');
const modalContent = modal.querySelector('.modal-content');
const closeModalBtn = modalWrapper.querySelector('.js-modal-close');
const addPictureBtn = modalWrapper.querySelector('.js-add-picture');
const backModalBtn = modalWrapper.querySelector('.js-modal-back');
    
//On affiche la modal
openModalBtn.addEventListener('click', (event) => {
    event.preventDefault();
    modal.style.display = 'flex';
    afficherEtat1()
});

//On ferme la modale au clique sur la croix
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none'; // Cache la modale
});

// Retour à l'état 1 de la modale
backModalBtn.addEventListener('click', () => {
    afficherEtat1()
});

 //on ferme la modale en cliquant en dehors de la modale et on change le display
 window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Fonction pour afficher l'état 1 de la modale
function afficherEtat1() {
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
    addPictureBtn.addEventListener('click', afficherEtat2);
}

// Fonction pour afficher l'état 2 de la modale
function afficherEtat2() {
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
            <label for="photo"><button>+ Ajouter photo</button></label>
            <p>jpg, png : 4mo max</p>
        </div>
        <input type="file" id="photo" name="photo" accept="image/*">
        <label for="title" class="label">Titre:</label>
        <input type="text" id="title" name="title">
        <label for="categorie" class="label">Catégorie:</label>
        <select id="categorie" name="categorie">
            <option value="">Sélectionnez une catégorie</option>
        </select>
        <p class="error-message" style="color:red;"></p>
    `;
    modalContent.appendChild(form);

    // Récupérer les catégories et les ajouter au dropdown
    fetchCategories().then(categories => {
        const selectCategorie = form.querySelector('#categorie');
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
        form.querySelector('#photo').click();
    });


    // Mettre à jour le texte du bouton
    addPictureBtn.textContent = 'Valider';

    addPictureBtn.removeEventListener('click', afficherEtat2); 
    addPictureBtn.addEventListener('click', (event) => {
        event.preventDefault();
        formSubmit(form);
    });
}

// Gestion de la suppression des projets dans la modale(Etat1)
async function supprimerProjet(projetId, projetWrapper) {
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

// Gestion du clic sur le bouton "Ajouter une photo" ou "Valider"
function addPictureClick(event) {
    event.preventDefault();
    if (addPictureBtn.textContent === 'Ajouter une photo') {
        afficherEtat2();
    } else if (addPictureBtn.textContent === 'Valider') {
        formSubmit(document.querySelector('.modal-form'));
    }
}

// Gestion de la soumission du formulaire
async function formSubmit(form) {
    const formData = new FormData(form);
    const errorMessage = form.querySelector('.error-message');
    errorMessage.textContent = ''; // Réinitialise le message d'erreur

    // On vérifie que tous les champs soient bien remplis 
    if (!formData.get('photo') || !formData.get('title') || !formData.get('categorie')) {
        errorMessage.textContent = 'Veuillez remplir tous les champs.';
        return;
    }

    // Log des données du formulaire
    console.log('FormData entries:');
    formData.forEach((value, key) => {
        console.log(key, value);
    });

    // Vérifiez que le token est présent
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        errorMessage.textContent = 'Vous devez être connecté pour ajouter un projet.';
        return;
    }

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });

        // Log de la réponse brute
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (response.ok) {
            const newProjet = await response.json();
            console.log('New project:', newProjet); // Log des données du nouveau projet
            // On ajoute le nouveau projet à la galerie sur la page d'accueil
            ajouterProjets([newProjet]); 
            // On ferme la modale après l'ajout réussi
            modal.style.display = 'none'; 
            // On recharge la page pour afficher le nouveau projet
            window.location.reload();
        } else if (response.status === 400) {
            const error = await response.json();
            console.error('Bad Request:', error);
            errorMessage.textContent = 'Requête incorrecte. Veuillez vérifier les données envoyées.';
        } else if (response.status === 401) {
            console.error('Unauthorized:', await response.json());
            errorMessage.textContent = 'Vous n\'êtes pas autorisé à effectuer cette action.';
        } else if (response.status === 500) {
            console.error('Server Error:', await response.text());
            errorMessage.textContent = 'Erreur du serveur. Veuillez réessayer plus tard.';
        } else {
            const error = await response.json();
            console.error('Other Error:', error);
            errorMessage.textContent = error.message;
        }
    } catch (error) {
        console.error('Catch Error:', error);
        errorMessage.textContent = 'Une erreur est survenue. Veuillez réessayer plus tard.';
    }
}
