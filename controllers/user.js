const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Créer un compte utilisateur
exports.signup = (req, res, next) => {
	bcrypt
		.hash(req.body.password, 10) // crypte en faisant 10 passes
		.then((hash) => {
			// créer une instance du model User
			const user = new User({
				email: req.body.email,
				password: hash,
			});
			user.save() // créer un nouvel utilisateur
				.then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
				.catch((error) => {
					res.status(400).json({ error: 'Paire Identifiant/mot de passe incorrect !' });
				});
		})
		.catch((error) => {
			res.status(500).json({ error });
		});
};

// Connexion à un compte utilisateur
exports.login = (req, res, next) => {
	// cherche si un utilisateur utilise déjà cet adresse mail
	User.findOne({ email: req.body.email })
		.then((user) => {
			// si aucun utilisateur n'a été trouvé
			if (!user) {
				return res.status(401).json({ error: 'Paire Identifiant/mot de passe incorrect !' });
			}
			bcrypt
				// si un utilisateur est trouvé, il compare le hash du mot de passe enregistré, et celui de la requête.
				.compare(req.body.password, user.password)
				.then((valid) => {
					// mot de passe incorrect !
					if (!valid) {
						return res.status(401).json({ error: 'Paire Identifiant/mot de passe incorrect !' });
					}
					// utilisateur authentifié !
					res.status(200).json({
						userId: user._id,
						// assigne un token aux utilisateurs authentifiés, cela les autorisent à utiliser les routes, CRUD, ...
						token: jwt.sign({ userId: user._id }, process.env.TOKEN_KEY, { expiresIn: '24h' }),
					});
				})
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};
