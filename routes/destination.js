const express = require("express");
const router = express.Router();
const {
  getAllDestinations,
  getADestination,
  createADestination,
  updateADestination,
  deleteADestination,
} = require("../controllers/destination");

router.route("/").get(getAllDestinations).post(createADestination);
router
  .route("/:id")
  .get(getADestination)
  .patch(updateADestination)
  .delete(deleteADestination);

module.exports = router;
