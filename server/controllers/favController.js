const db = require('../models/database.js');

const favController = {};

favController.getFavs = (req, res, next) => {
  try {
    const { user_id } = req.body;
    const values = [user_id];
    const getFavs = `SELECT b.name, b.address, b.ratings
FROM favorites f
JOIN businesses b ON f.business_id = b.business_id
WHERE f.user_id = $1`;
    db.query(getFavs, values).then((favorites) => {
      console.log(favorites.rows);
      res.locals.favs = favorites.rows;
      next();
    });
  } catch (error) {
    return next(error);
  }
};

favController.addFav = (req, res, next) => {
  try {
    const { user_id, business_id } = req.body;
    const values = [user_id, business_id];
    const addFav = `INSERT INTO favorites (user_id, business_id) VALUES ($1, $2)`;
    db.query(addFav, values).then((fav) => {
      console.log(fav);
      res.locals.fav = fav;
    });
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = favController;