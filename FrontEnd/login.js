
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async (event) =>{
        event.preventDefault();

        const email = document.getElementById('email');
        const password = document.getElementById('password');

        //On créer un objet avec les données de connexion
        const loginData = {
            email : email,
            password : password
        };

        try{
            //On envoie une requête POST à l'API d'authentification
            const reponse = await fetch("http://localhost:5678/users/login", {
                method: 'POST',
                headers: {
                    //On specifie que les données sont au format json
                    'Content-type': 'application/json'
                },
                //On converti l'objet loginData en JSON
                body: JSON.stringify(loginData)
            });
        
            if(reponse.ok){//Verifie si la réponse est réussie
                const data = await Response.json();//On extrait les données JSON de la réponse
                localStorage.setItem('authToken', data.token);//On stock le token dans le localStorage pour de futur utilisation
                window.location.href = "FrontEnd/index.html";//Si la connexion réussi on amène l'utilisateur sur la page d'accueil
            }else{
                const error = await Response.json;//On extrait les données de l'erreur 
                if(response.status === 404){
                    displayErrorMessage('Utilisateur non trouvé.'); // Message spécifique pour l'erreur 404
                }else if(response.status === 401){
                    displayErrorMessage('Email ou mot de passe incorrect.'); // Message spécifique pour l'erreur 401
                }else{
                    displayErrorMessage(error.message); //Message d'erreur de base 
                }
            }
        }catch(error){
            displayErrorMessage('Une erreur est survenue. Veuillez réessayer plus tard.'); // on affiche un message d'erreur générique en cas de problème quelconque
        }
    });
     // Fonction pour afficher un message d'erreur
     function displayErrorMessage(message) {
        const errorMessageElement = document.getElementById('error-message');
        errorMessageElement.innerText = message; // On met à jour le texte de l'élément de message d'erreur
     }
});