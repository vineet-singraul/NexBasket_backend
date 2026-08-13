const { AddStore,showOnlyOwnerStore, deleteOwnerStore,EditOwnerDetails,getSingleOwner } = require("../controllers/Store/store.controller.js");
const express = require("express");
const router = express.Router();
const { isOwner } = require("../middlewares/IsOwnerAuth.js");
const { protect } = require("../middlewares/auth.middleware.js");
const upload = require("../middlewares/upload.middleware.js");

router.post(
  "/AddStore",
  protect,
  protect,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  AddStore,
);

router.get("/showOnlyOwnerStore/:id",protect,protect, showOnlyOwnerStore)

router.delete("/deleteOwnerStore/:id",protect,isOwner,deleteOwnerStore)

router.put(
  "/EditOwnerDetails",
  protect,
  isOwner,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  EditOwnerDetails,
);

router.get("/getSingleOwner/:id",protect,isOwner,getSingleOwner)

module.exports = router;