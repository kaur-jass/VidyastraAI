const express = require("express");

const router = express.Router();

const controller = require("./AITutorController");

// const {
// protect,
// authorize
// }=require("../../../common/middlewares/authMiddleware");

// // AI Endpoint
// router.post(
// "/ask",
// protect,
// authorize(["student"]),
// controller.askAI
// );

// // Chat
// router.post(
// "/",
// protect,
// authorize(["student"]),
// controller.createChat
// );

// router.post(
// "/:id/message",
// protect,
// authorize(["student"]),
// controller.sendMessage
// );

// // History
// router.get(
// "/history",
// protect,
// authorize(["student"]),
// controller.getHistory
// );

// // CRUD
// router.get(
// "/:id",
// protect,
// authorize(["student"]),
// controller.getConversation
// );

// router.delete(
// "/:id",
// protect,
// authorize(["student"]),
// controller.deleteConversation
// );

// module.exports=router;

// AI Endpoint
router.post(
"/ask",
controller.askAI
);

// Chat
router.post(
"/",
controller.createChat
);

router.post(
"/:id/message",
controller.sendMessage
);

// History
router.get(
"/history",
controller.getHistory
);

// CRUD
router.get(
"/:id",
controller.getConversation
);

router.delete(
"/:id",
controller.deleteConversation
);

module.exports=router;