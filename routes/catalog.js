const express = require("express");
const router = express.Router();

// Require controller modules.
const economyCar_controller = require("../controllers/economyCarController");
const luxuryCar_controller = require("../controllers/luxuryCarController");

/// EconomyCar ROUTES ///

// GET catalog home page.
router.get("/", economyCar_controller.index);

// GET request for creating a economyCar. NOTE This must come before routes that display economyCar (uses id).
router.get("/economyCar/create", economyCar_controller.economyCar_create_get);

// POST request for creating economyCar.
router.post("/economyCar/create", economyCar_controller.economyCar_create_post);

// GET request to delete economyCar.
router.get(
  "/economyCar/:id/delete",
  economyCar_controller.economyCar_delete_get
);

// POST request to delete economyCar.
router.post(
  "/economyCar/:id/delete",
  economyCar_controller.economyCar_delete_post
);

// GET request to update economyCar.
router.get(
  "/economyCar/:id/update",
  economyCar_controller.economyCar_update_get
);

// POST request to update economyCar.
router.post(
  "/economyCar/:id/update",
  economyCar_controller.economyCar_update_post
);

// GET request for one economyCar.
router.get("/economyCar/:id", economyCar_controller.economyCar_detail);

// GET request for list of all economyCar items.
router.get("/economyCar", economyCar_controller.economyCar_list);

/// luxuryCar ROUTES ///

// GET request for creating a luxuryCar. NOTE This must come before route that displays luxuryCar (uses id).
router.get("/luxuryCar/create", luxuryCar_controller.luxuryCar_create_get);

// POST request for creating luxuryCar.
router.post("/luxuryCar/create", luxuryCar_controller.luxuryCar_create_post);

// GET request to delete luxuryCar.
router.get("/luxuryCar/:id/delete", luxuryCar_controller.luxuryCar_delete_get);

// POST request to delete luxuryCar.
router.post(
  "/luxuryCar/:id/delete",
  luxuryCar_controller.luxuryCar_delete_post
);

// GET request to update luxuryCar.
router.get("/luxuryCar/:id/update", luxuryCar_controller.luxuryCar_update_get);

// POST request to update luxuryCar.
router.post(
  "/luxuryCar/:id/update",
  luxuryCar_controller.luxuryCar_update_post
);

// GET request for one luxuryCar.
router.get("/luxuryCar/:id", luxuryCar_controller.luxuryCar_detail);

// GET request for list of all luxuryCar.
router.get("/luxuryCar", luxuryCar_controller.luxuryCar_list);

module.exports = router;
