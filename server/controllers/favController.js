const db = require("../models/database.js");

const favController = {};

favController.getFavs = async (req, res, next) => {
  try {
    const userQuery = "SELECT user_id FROM users WHERE username = $1";
    const userValues = [req.params.id];

    const userResponse = await db.query(userQuery, userValues);
    console.log(userResponse.rows[0]);
    console.log("sanitycheck", userResponse.rows[0].user_id);

    const allFaves = `SELECT * FROM favtable JOIN businesses ON favtable.business_id = businesses.business_id WHERE user_id = $1`;
    const values = [userResponse.rows[0].user_id];
    const response = await db.query(allFaves, values);
    console.log(response.rows);
    res.locals.favs = response.rows;
    //send the necessary response back
    return next();
  } catch (error) {
    console.log("error in getSaves controller");
    return next(error);
  }
};

// favController.getFavs = (req, res, next) => {
//   try {
//     const { user_id } = req.body;
//     const values = [user_id];
//     const getFavs = `SELECT b.name, b.address, b.ratings
// FROM favorites f
// JOIN businesses b ON f.business_id = b.business_id
// WHERE f.user_id = $1`;
//     db.query(getFavs, values).then((favorites) => {
//       console.log(favorites.rows);
//       res.locals.favs = favorites.rows;
//       next();
//     });
//   } catch (error) {
//     return next(error);
//   }
// };

favController.addFav = async (req, res, next) => {
  const { business_id } = res.locals.business;
  try {
    const userQuery = "SELECT user_id FROM users WHERE username = $1";
    const userValues = [res.locals.username];
    const userResponse = await db.query(userQuery, userValues);
    const postFaved =
      "INSERT INTO favtable (user_id, business_id) VALUES ($1, $2)";

    const postValues = [userResponse.rows[0].user_id, business_id];
    db.query(postFaved, postValues);
    next();
  } catch (error) {
    console.log("error in addFavs controller");
  }
};

favController.removeFav = async (req, res, next) => {
  const { business_id } = res.locals.business;
  console.log("entered removeFav");
  try {
    const userQuery = "SELECT user_id FROM users WHERE username = $1";
    const userValues = [res.locals.username];
    console.log("removeFav username");

    const userResponse = await db.query(userQuery, userValues);
    console.log("removeFav response", userResponse);

    const removeFav = `DELETE FROM favtable WHERE user_id = $1 AND business_id = $2`;
    const values = [userResponse.rows[0].user_id, business_id];
    console.log("removeFav response row", userResponse.rows[0]);

    db.query(removeFav, values);
    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = favController;
