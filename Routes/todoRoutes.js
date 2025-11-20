import express from "express";
import {
    createTodo,
    getAllTodo,
    updateTodo,
    deleteTodo
} from "../controllers/todoController.js";
import auth from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/todo",auth, createTodo);
router.get("/todo",auth, getAllTodo);
router.put("/todo/:id",auth, updateTodo);
router.delete("/todo/:id",auth, deleteTodo);

export default router