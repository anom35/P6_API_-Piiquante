const mongoose = require('mongoose');

const mongoose2 = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const MongooseErrors = require('mongoose-errors');
mongoose2.plugin(mongodbErrorHandler);

// schéma d'un objet sauce
const sauceSchema = mongoose2.Schema({
	userId: { type: String, required: true },
	name: { type: String, required: true },
	manufacturer: { type: String, required: true },
	description: { type: String, required: true },
	mainPepper: { type: String, required: true },
	imageUrl: { type: String, required: true },
	heat: { type: Number, required: true },
	likes: { type: Number, default: 0 },
	dislikes: { type: Number, default: 0 },
	usersLiked: { type: [String] },
	usersDisliked: { type: [String] },
});

// étend la gestion des contrôle d'erreurs
sauceSchema.plugin(MongooseErrors);
sauceSchema.plugin(mongodbErrorHandler);

module.exports = mongoose2.model('Sauce', sauceSchema);
