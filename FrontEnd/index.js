//On importe les fonctions depuis utils.js
import { fetchProjets, fetchCategories, ajouterCategories, ajouterProjets, afficherEtat1} from './utils.js'


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




// Boîte modale
document.addEventListener('DOMContentLoaded', async () => {
    const openModalBtn = document.querySelector('a[href="#modal1"]');
    const modal = document.getElementById('modal1');
    const modalWrapper = modal.querySelector('.modal-wrapper');
    const modalContent = modal.querySelector('.modal-content');
    const closeModalBtn = modalWrapper.querySelector('.js-modal-close');
    const addPictureBtn = modalWrapper.querySelector('.js-add-picture');
    const backModalBtn = modalWrapper.querySelector('.js-modal-back');

    openModalBtn.addEventListener('click', (event) => {
        event.preventDefault();
        modal.style.display = 'flex';
        afficherEtat1(modalContent, addPictureBtn, backModalBtn);
    });

    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    backModalBtn.addEventListener('click', () => {
        afficherEtat1(modalContent, addPictureBtn, backModalBtn);
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});
