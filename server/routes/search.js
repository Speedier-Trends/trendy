const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");

router.get(
  "/",
  searchController.getBusinesses,
  
  (req, res, next) => {
    return res.json(res.locals.businesses);
  }
);

module.exports = router;
