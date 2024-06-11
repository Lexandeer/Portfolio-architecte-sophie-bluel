//On importe les fonctions depuis utils.js
import { fetchProjets, fetchCategories, ajouterCategories, ajouterProjets } from './utils.js'

//On s'assure que le DOM soit chargé et analysé.
document.addEventListener('DOMContentLoaded', async () => {
    
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
            
            console.log(`bouton ${event.target.innerText} cliqué`);
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
    // On nettoie le contenue
    modalContent.innerHTML = '';

    // On ajoute le titre
    const titre = document.createElement('h2');
    titre.textContent = 'Galerie photo';
    modalContent.appendChild(titre);

    // On ajoute les images des projets
    fetchProjets().then(projets => { // <- .then(projets =>{) Permet de parcourir les projets une fois qu'ils ont été récupéré  
        projets.forEach(projet => {
            const img = document.createElement('img');
            img.src = projet.imageUrl;
            img.alt = projet.title;
            modalContent.appendChild(img);
        });
    });

    // Mettre à jour le texte du bouton
    addPictureBtn.textContent = 'Ajouter une photo';
    // Cacher le bouton de retour
    backModalBtn.style.display = 'none';

    // On s'assure de ne pas avoir plusieurs écouteurs
    addPictureBtn.removeEventListener('click', afficherEtat2); 
    addPictureBtn.addEventListener('click', afficherEtat2);
}

// Fonction pour afficher l'état 2 de la modale
function afficherEtat2() {
    // On nettoie le contenue
    modalContent.innerHTML = '';

    // On ajoute le titre
    const titre = document.createElement('h2');
    titre.textContent = 'Ajout photo';
    modalContent.appendChild(titre);

    //On affiche le bouton de retour
    backModalBtn.style.display = 'block';
   
    // On ajoute le formulaire d'ajout de photo
    const form = document.createElement('form');
    form.innerHTML = `
        <label for="photo">Photo:</label>
        <input type="file" id="photo" name="photo" accept="image/*">
        <label for="title">Titre:</label>
        <input type="text" id="title" name="title">
        <button type="submit">Valider</button>
    `;
    form.classList.add('modal-form');
    modalContent.appendChild(form);

    // Mettre à jour le texte du bouton
    addPictureBtn.textContent = 'Valider';

    addPictureBtn.removeEventListener('click', afficherEtat1); // S'assurer de ne pas avoir plusieurs écouteurs
    addPictureBtn.addEventListener('click', (event) => {
        if (addPictureBtn.textContent === 'Ajouter une photo') {
            afficherEtat2();
        } else if (addPictureBtn.textContent === 'Valider') {
            document.querySelector('.modal-form').submit();
        }
    });
}