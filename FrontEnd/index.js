async function fetchProjets(){
    const reponse = await fetch("http://localhost:5678/api/works");
    const projets = await reponse.json();
    return projets;
}

let gallery = document.querySelector("#portfolio .gallery");

function ajouterProjets(projets){
    for(i = 0; i < projets.length; i++){
        const figure = document.createElement('figure')

        const imageElement = document.createElement("img");
        imageElement.src = projets[i].imageUrl;
        imageElement.alt = projets[i].title;

        const figcaptionElement = document.createElement("figcaption");
        figcaptionElement.innerText = projets[i].title;

        figure.appendChild(imageElement);
        figure.appendChild(figcaptionElement);

        gallery.appendChild(figure);
        
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const projets = await fetchProjets();
        ajouterProjets(projets);
    } catch (error) {
        console.error("Erreur lors de la récupération des projets:", error);
    }
});
    
