const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.get("/", cartController.getAll);
router.post("/items", cartController.create);
router.patch("/items/:producedId", cartController.update);
router.delete("/items/:producedId", cartController.remove);
router.delete("/", cartController.removeAll);


module.exports = router;