import dotenv from "dotenv";
import mongoose from "mongoose";
import { myModel } from "./schema.js";
import express from "express";
dotenv.config();

const url = process.env.DB_URI;
const app = express();
app.use(express.json());

async function connectToDb() {
  try {
    await mongoose.connect(url);
    console.log("Successfully connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}
connectToDb();



app.get("/", async (req, res) => {
  const task = await myModel.find();
  res.json(task);
});

app.post("/", async (req, res) => {
  const thing = req.body.thing;
  const reg = req.body.reg;
  if (thing && reg) {
    const task = new myModel({
      thing,
      reg,
    });
    await task.save();
    res.sendStatus(201);
  } else {
    res.sendStatus(400);
  }
});

app.delete("/:id", async (req, res) => {
  const taskId = req.params.id;
  if (!taskId) {
    return res.status(400).json({ error: "Task ID is required for delete operation" });
  }

  try {
    // Find the task by ID and delete it
    const deletedTask = await myModel.findByIdAndDelete(taskId);

    if (deletedTask) {
      res.json({ message: "Task deleted successfully", deletedTask });
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
});


app.put("/:id", async (req, res) => {
  const taskId = req.params.id;
  const updatedThing = req.body.thing;
  const updatedReg = req.body.reg;

  if (!taskId || (!updatedThing && !updatedReg)) {
    return res.status(400).json({ error: "Task ID and at least one field to update are required" });
  }

  try {
    // Find the task by ID and update it
    const updatedTask = await myModel.findByIdAndUpdate(
      taskId,
      { $set: { thing: updatedThing, reg: updatedReg } },
      { new: true } // This ensures that the updated document is returned
    );

    if (updatedTask) {
      res.json({ message: "Task updated successfully", updatedTask });
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.listen(8080, () => {
  console.log("Server running on port 8080");
});


