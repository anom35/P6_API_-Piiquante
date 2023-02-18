// importe le paquet http de NodeJs
const http = require('http');
// importe l'application express
const app = require('./app');

// test et renvois le port d'après les paramètres passés
const normalizePort = (val) => {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		return val;
	}
	if (port >= 0) {
		return port;
	}
	return false;
};

// défini le port d'écoute, en premier celui défini dans les variables d'environnement, sinon 3000
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// constante qui récupère la valeur d'erreur 
const errorHandler = (error) => {
	if (error.syscall !== 'listen') {
		throw error;
	}
	const address = server.address();
	const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
	switch (error.code) {
		// Autorisation refusée
		case 'EACCES':
			console.error(bind + ' requires elevated privileges.');
			process.exit(1);
			break;
		// Adresse déjà utilisée
		case 'EADDRINUSE':
			console.error(bind + ' is already in use.');
			process.exit(1);
			break;
		default:
			throw error;
	}
};

// création du serveur en passant l'application express
const server = http.createServer(app);

// gestion des erreur serveur
server.on('error', errorHandler);

// met en écoute et affiche dans la console le port utilisé
server.on('listening', () => {
	const address = server.address();
	const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
	console.log('Listening on ' + bind);
});

// serveur en écoute
server.listen(port);
