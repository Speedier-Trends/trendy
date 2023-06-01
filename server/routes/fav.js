const express = require("express");
const router = express.Router();
const favController = require("../controllers/favController");
const businessController = require("../controllers/businessController");

router.get("/:id", favController.getFavs, (req, res, next) => {
  res.status(200).json(res.locals.favs);
});

router.post(
  "/",
  businessController.addBusiness,
  favController.addFav,
  (req, res, next) => {
    res.sendStatus(200);
  }
);

router.delete(
  "/",
  businessController.addBusiness,
  favController.removeFav,
  (req, res, next) => {
    res.sendStatus(200);
  }
);

module.exports = router;
