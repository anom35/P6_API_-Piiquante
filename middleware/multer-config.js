const multer = require('multer');

const MIME_TYPES = {
	'image/jpg': 'jpg',
	'image/jpeg': 'jpg',
	'image/png': 'png',
};

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, 'images');
	},
	filename: (req, file, callback) => {
		const name = file.originalname.split('.').join('_'); // remplace le . par un _ afin d'y ajouter la date en secondes
		const extension = MIME_TYPES[file.mimetype];
		callback(null, name + '_' + Date.now() + '.' + extension);
	},
});

module.exports = multer({ storage }).single('image');
