const express = require('express');
// const bodyParser = require('body-parser');

// déclaration de mongoose
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

// déclaration des routes et controleurs
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// utilisation du chemin et variables d'environnement
const path = require('path');
const varEnv = require('dotenv').config();

// déclaration d'express
const app = express();
app.use(express.json());

// connexion à la base de donnée avec des variables d'environnement
mongoose
	.connect(`mongodb+srv://${process.env.MDB_USER}:${process.env.MDB_PASSWORD}@${process.env.MDB_PROJET}/?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('Connexion à MongoDB réussie !'))
	.catch(() => console.log('Connexion à MongoDB échouée !'));

// middleware qui ne contient pas de route
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});

// app.use(bodyParser.json());

// routes
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

// route pour le dossier images
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
