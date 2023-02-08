const multer = require('multer');

// types MIME pris en charge
const MIME_TYPES = {
	'image/jpg': 'jpg',
	'image/jpeg': 'jpg',
	'image/png': 'png',
};

// gestion des fichiers images
const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, 'images');
	},
	filename: (req, file, callback) => {
		// remplace le . par un _ afin d'y ajouter la date en secondes
		const name = file.originalname.split('.').join('_');
		const extension = MIME_TYPES[file.mimetype];
		callback(null, name + '_' + Date.now() + '.' + extension);
	},
});

module.exports = multer({ storage }).single('image');
