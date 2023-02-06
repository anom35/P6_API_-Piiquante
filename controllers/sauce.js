const Sauce = require('../models/sauce');
const fs = require('fs');

// Récuperer la liste de toutes les sauces
exports.getAllSauces = (req, res, next) => {
	Sauce.find()
		.then((sauces) => res.status(200).json(sauces))
		.catch((error) => res.status(400).json({ error: error }));
};

// Récuperer une seule sauce
exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => res.status(200).json(sauce))
		.catch((error) => res.status(404).json({ error: error }));
};

// Créer une sauce
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;
	console.log(req.file.filename);
	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
	});
	sauce
		.save()
		.then(() => res.status(201).json({ message: 'Sauce enregistré !' }))
		.catch((error) => res.status(400).json({ error }));
};

// Modifier une sauce
exports.modifySauce = (req, res, next) => {
	// cherche l'image de l'article et la supprime du dossier /images/ avant la modification
	Sauce.findOne({ _id: req.params.id }).then((sauce) => {
		const oldImage = sauce.imageUrl.split('/')[4];
		fs.unlink(`images/${oldImage}`, () => {});
	});
	let sauceObject = {};
	if (req.file != undefined) {
		sauceObject = {
			...JSON.parse(req.body.sauce),
			imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
		};
	} else {
		sauceObject = { ...req.body };
	}
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

exports.likeOrNotLike = (req, res, next) => {
	let likeString = req.body.like.toString();
	console.log(likeString, ' - ', typeof likeString);

	switch (likeString) {
		case '1': {
			// met un Like
			Sauce.updateOne(
				{
					_id: req.params.id, // Met à jour l'ID de l'article
				},
				{
					$inc: { likes: req.body.like++ }, // Incrémente le champs "nombre d'utilisateurs qui ont mis un like"
					$push: { usersLiked: req.body.userId }, // Enregistre l'ID de l'utilisateur dans le table de ceux qui ont aimés
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
					_id: req.params.id,
				},
				{
					$inc: { dislikes: req.body.like++ * -1 },
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
								_id: req.params.id,
							},
							{
								$pull: { usersLiked: req.body.userId },
								$inc: { likes: -1 },
							}
						)
							.then((sauce) => {
								res.status(200).json({ message: 'Like supprimé !' });
							})
							.catch((error) => res.status(400).json({ error }));
					}
					// test si le userId est dans le tableau des personnes qui ont kisliké la sauce
					else if (sauce.usersDisliked.includes(req.body.userId)) {
						Sauce.updateOne(
							{
								_id: req.params.id,
							},
							{
								$pull: { usersDisliked: req.body.userId },
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
