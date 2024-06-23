document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');//récupération dans le DOM

    //Ecouteur sur les champs mdp et email 
    loginForm.addEventListener('submit', async (event) =>{
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        //On créer un objet avec les données de connexion
        const loginData = {
            email : email,
            password : password
        };

        try{
            //On envoie une requête POST à l'API d'authentification
            const reponse = await fetch("http://localhost:5678/api/users/login", {
                method: 'POST',
                headers: {
                    //On specifie que les données sont au format json
                    'Content-type': 'application/json'
                },
                //On converti l'objet loginData en JSON pour que le mdp et l'email soient lisible par l'API
                body: JSON.stringify(loginData)
            });
        
            if(reponse.ok){//Verifie si la réponse est réussie
                const data = await reponse.json();//On extrait les données JSON de la réponse
                localStorage.setItem('authToken', data.token);//On stock le token dans le localStorage pour de futur utilisation
                window.location.href = "index.html";//Si la connexion réussi on amène l'utilisateur sur la page d'accueil
            }else{
                const error = await reponse.json;//On extrait les données de l'erreur 
                if(reponse.status === 404){
                    afficherMessageErreur('Utilisateur non trouvé.'); // Message spécifique pour l'erreur 404
                }else if(reponse.status === 401){
                    afficherMessageErreur('Email ou mot de passe incorrect.'); // Message spécifique pour l'erreur 401
                }else{
                    afficherMessageErreur(error.message); //Message d'erreur de base 
                }
            }
        }catch(error){
            afficherMessageErreur('Une erreur est survenue. Veuillez réessayer plus tard.'); // on affiche un message d'erreur générique si la requête à l'API échoue
        }
    });
    
     // Fonction pour afficher un message d'erreur
     function afficherMessageErreur(message) {
        const errorMessageElement = document.getElementById('error-message');
        errorMessageElement.innerText = message; // On met à jour le texte de l'élément de message d'erreur
     }
});