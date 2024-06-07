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