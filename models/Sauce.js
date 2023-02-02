const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
	userId: { type: String, required: true }, // identifiant MongoDb
	name: { type: String, required: true }, // nom de la sauce
	manufactured: { type: String, required: true }, // fabricant de la sauce
	description: { type: String, required: true }, // description
	mainPepper: { type: String, required: true }, // le principal ingrédient de la sauce
	imageUrl: { type: String, required: true }, // URL de l'image
	heat: { type: Number, required: true }, // nombre de 1 à 10 décrivant la sauce
	likes: { type: Number, required: true }, // nombre d'utilisateurs qui aiment
	dislikes: { type: Number, required: true }, // nombre d'utilisateurs qui n'aiment pas la sauce
	usersLiked: { type: [String] }, // tableau des identifiants des personnes qui aiment
	usersDisliked: { type: [String] }, // tableau des identifiants des personnes qui n'aiment pas
});

module.exports = mongoose.model('Sauce', sauceSchema);
