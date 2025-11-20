import mongoose from "mongoose";
import Todo from "../models/todo.js";

export const createTodo = async (req,res) => {
    try {
        const {title, description, dueOn} = req.body;

        if(!title || !description || !dueOn){
            return res.status(400).json({
                success: false,
                message: "All fields are Required"
            })
        }

        const parsedDueOn = new Date(dueOn);
         if (isNaN(parsedDueOn.getTime())) {
             return res.status(400).json({ success: false, message: "Invalid dueOn date" });
            }

        const todo = await Todo.create({
            title,
            description,
            dueOn: parsedDueOn,
            userId: req.user._id
        })

        return res.status(201).json({
            success: true,
            message: "Todo Created Successfully",
            Todo: todo
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getAllTodo = async (req,res) => {
    try {
        const todos = await Todo.find({userId: req.user._id}).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            todos,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Helper: validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: "Invalid ID" });

    // 1. find the todo
    const todo = await Todo.findById(id);
    if (!todo) return res.status(404).json({ success: false, message: "Todo not found" });

    // 2. ownership check
    if (String(todo.userId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "Forbidden: you don't own this todo" });
    }

    // 3. Option A: apply update from req.body safely (whitelist fields)
    const allowed = ["title", "description", "status", "dueOn"];
    allowed.forEach((field) => {
      if (field in req.body) todo[field] = req.body[field];
    });

    // Validate and save
    const updated = await todo.save();

    return res.status(200).json({ success: true, message: "Todo updated", todo: updated });
  } catch (err) {
    console.error("updateTodo error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: "Invalid ID" });

    const todo = await Todo.findById(id);
    if (!todo) return res.status(404).json({ success: false, message: "Todo not found" });

    if (String(todo.userId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "Forbidden: you don't own this todo" });
    }

    await Todo.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: "Todo deleted" });
  } catch (err) {
    console.error("deleteTodo error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
