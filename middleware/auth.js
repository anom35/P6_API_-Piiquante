const jwt = require('jsonwebtoken');

//
module.exports = (req, res, next) => {
	try {
		// transforme authorization du header en tableau, et récupère le 2è élément (token), le 1er étant (bearer)
		const token = req.headers.authorization.split(' ')[1];
		// vérifie si le token récupéré correspond au token généré, même s'il est différent
		const decodedToken = jwt.verify(token, `${process.env.TOKEN_KEY}`);
		// decodedToken = {
		//		userId: '564654dqs4d65s46546',
		//		iat: 1675853746,
		//		exp: 1675940146
		// }
		// iat = heure d'emission du JWT, exp = expriration
		const userId = decodedToken.userId;
		if (req.body.userId && req.body.userId !== userId) {
			throw 'Identification non valide !';
		} else {
			next();
		}
	} catch (error) {
		res.status(401).json({ error: 'Non-authentifiée !' });
	}
};
