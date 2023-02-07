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
					console.log('erreur: ', error.statusCode); //! à supprimer
					res.status(400).json({ error: 'Paire Identifiant/mot de passe incorrect !' });
				});
		})
		.catch((error) => {
			res.status(500).json({ error });
		});
};

// Connexion à un compte utilisateur
exports.login = (req, res, next) => {
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (!user) {
				return res.status(401).json({ error: 'Paire Identifiant/mot de passe incorrect !' });
			}
			bcrypt
				.compare(req.body.password, user.password)
				.then((valid) => {
					if (!valid) {
						return res.status(401).json({ error: 'Paire Identifiant/mot de passe incorrect !' });
					}
					res.status(200).json({
						userId: user._id,
						token: jwt.sign({ userId: user._id }, process.env.TOKEN_KEY, { expiresIn: '24h' }),
					});
				})
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};
