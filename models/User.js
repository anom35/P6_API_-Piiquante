const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const MongooseErrors = require('mongoose-errors');
mongoose.plugin(mongodbErrorHandler);

// Schéma utilisateur
const userSchema = mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

// interdit de créer plusieurs comptes avec la même adresse email.
userSchema.plugin(uniqueValidator);

// étend la gestion des contrôle d'erreurs
userSchema.plugin(MongooseErrors);
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
