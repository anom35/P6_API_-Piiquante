const Sauce = require('../models/sauce');
const fs = require('fs');

// Récuperer la liste de toutes les sauces
exports.getAllSauces = (req, res, next) => {
	Sauce.find()
		.then((sauces) => res.status(200).json(sauces))
		.catch((error) => res.status(400).json({ error: error }));
};

// Récuperer une seule sauce en testant l'authentification de l'utilisateur
exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => res.status(200).json(sauce))
		.catch((error) => res.status(404).json({ error: error }));
};

// Créer une sauce avec l'UserID de l'utilisateur
exports.createSauce = async (req, res, next) => {
	const sauceObject = await JSON.parse(req.body.sauce);
	delete sauceObject._id;
	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
	});
	sauce
		.save()
		.then(() => res.status(201).json({ message: 'Sauce enregistré !' }))
		.catch((error) => res.status(400).json({ error }));
};

// Modifier une sauce, uniquement autorisé par l'utilisateur qui l'a créée
exports.modifySauce = (req, res, next) => {
	// test si un fichier image est fourni, mais en réalité elle est devenue obligatoire pour pouvoir validé la création
	let sauceObject = {};
	if (req.file != undefined) {
		sauceObject = {
			...JSON.parse(req.body.sauce),
			imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
		};
	} else {
		sauceObject = { ...req.body };
	}
	const IsImageUrl = sauceObject.imageUrl;

	// Si changement d'image, cherche l'image de l'article et la supprime du dossier /images
	// Si IsImageUrl est inexistant, alors juste modification du texte, on continue.
	if (IsImageUrl != undefined) {
		Sauce.findOne({ _id: req.params.id }).then((sauce) => {
			const oldImage = sauce.imageUrl.split('/')[4];
			fs.unlink(`images/${oldImage}`, () => {});
		});
	}
	// met à jour les données (filtre, données)
	Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
		.then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
		.catch((error) => res.status(400).json({ error }));
};

// Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			const filename = sauce.imageUrl.split('/images/')[1];
			fs.unlink(`images/${filename}`, () => {
				Sauce.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
					.catch((error) => res.status(400).json({ error: error }));
			});
		})
		.catch((error) => res.status(500).json({ error }));
};

// gère les Likes et Dislikes des sauces
exports.likeAndDislike = (req, res, next) => {
	let likeString = req.body.like.toString();

	switch (likeString) {
		case '1': {
			// met un Like
			Sauce.updateOne(
				{
					// enregistre l'ID de l'utilisateur
					_id: req.params.id, 
				},
				{
					// Incrémente le champs "nombre d'utilisateurs qui ont mis un Like"
					$inc: { likes: req.body.like++ }, 
					// Enregistre l'ID de l'utilisateur dans le table de ceux qui ont aimés
					$push: { usersLiked: req.body.userId }, 
				}
			)
				.then((sauce) => res.status(200).json({ message: 'Like ajouté !' }))
				.catch((error) => res.status(400).json({ error }));
			break;
		}

		case '-1': {
			// met un Dislike
			Sauce.updateOne(
				{
					// enregistre l'ID de l'utilisateur
					_id: req.params.id,
				},
				{
					// Incrémente le champs "nombre d'utilisateurs qui ont mis un Dislike"
					$inc: { dislikes: req.body.like++ * -1 },
					// Enregistre l'ID de l'utilisateur dans le table de ceux qui n'ont aimés
					$push: { usersDisliked: req.body.userId },
				}
			)
				.then((sauce) => res.status(200).json({ message: 'Dislike ajouté !' }))
				.catch((error) => res.status(400).json({ error }));
			break;
		}

		default: {
			// supprime un Like ou un Dislike
			Sauce.findOne({ _id: req.params.id })
				.then((sauce) => {
					// test si le userId est dans le tableau des personnes qui ont liké la sauce
					if (sauce.usersLiked.includes(req.body.userId)) {
						Sauce.updateOne(
							{
								// enregistre l'ID de l'utilisateur
								_id: req.params.id,
							},
							{
								// enregistre l'ID de l'utilisateur dans le table de ceux qui ont aimés
								$pull: { usersLiked: req.body.userId },
								// supprime le Like
								$inc: { likes: -1 },
							}
						)
							.then((sauce) => {
								res.status(200).json({ message: 'Like supprimé !' });
							})
							.catch((error) => res.status(400).json({ error }));
					}
					// test si le userId est dans le tableau des personnes qui ont Disliké la sauce
					else if (sauce.usersDisliked.includes(req.body.userId)) {
						Sauce.updateOne(
							{
								// enregistre l'ID de l'utilisateur
								_id: req.params.id,
							},
							{
								// enregistre l'ID de l'utilisateur dans le table de ceux qui n'ont aimés
								$pull: { usersDisliked: req.body.userId },
								// supprime le Dislike
								$inc: { dislikes: -1 },
							}
						)
							.then((sauce) => {
								res.status(200).json({ message: 'Dislike supprimé !' });
							})
							.catch((error) => res.status(400).json({ error }));
					}
				})
				.catch((error) => res.status(400).json({ error }));
		}
	}
};
