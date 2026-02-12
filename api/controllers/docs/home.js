module.exports = {
    friendlyName: 'Home',
    description: 'Home page of the application.',
    inputs: {},
    exits: {
        success: {
            description: 'Home page served'
        }
    },
    fn: async function (inputs) {
        const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CYBERINCUB POINTAGE API</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f9;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            background: white;
            padding: 2rem 3rem;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 600px;
        }
        h1 {
            color: #2c3e50;
            margin-bottom: 1rem;
        }
        p {
            line-height: 1.6;
            margin-bottom: 1.5rem;
            color: #555;
        }
        .note {
            background-color: #e8f4fd;
            border-left: 5px solid #3498db;
            padding: 10px 15px;
            text-align: left;
            margin-bottom: 2rem;
            font-size: 0.95rem;
        }
        .btn {
            display: inline-block;
            background-color: #3498db;
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        .btn:hover {
            background-color: #2980b9;
        }
        footer {
            margin-top: 2rem;
            font-size: 0.8rem;
            color: #aaa;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Bienvenue sur l'API CYBERINCUB</h1>
        <p>
            Cette API gère le système de pointage et de gestion pour Cyberincub. 
            Vous pouvez accéder à toutes les fonctionnalités via les endpoints sécurisés.
        </p>
        
        <div class="note">
            <strong>Note :</strong> Pour utiliser cette API, vous devez être authentifié. 
            Veuillez consulter la documentation pour obtenir les détails sur les endpoints disponibles et les méthodes d'authentification.
        </div>

        <a href="/api/v1/docs" class="btn">Accéder à la documentation</a>

        <footer>
            &copy; ${new Date().getFullYear()} Cyberincub. Tous droits réservés.
        </footer>
    </div>
</body>
</html>
    `;
        this.res.send(html);
    }
};
