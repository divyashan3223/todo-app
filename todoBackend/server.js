// !Using express
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
// create a instance of express
const app = express();
app.use(express.json());
app.use(cors());

//! define a route

// app.get("/", (req, res) => {
//   // console.log(res);
//   res.send("hello world");
// });
// !memory storage for todo items
// let todos = [];

//TODO connecting mongodb----------------------------------------------------------------
mongoose
  .connect("mongodb://localhost:27017/mern-app")
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));
// TODO create a schema------------------------------------------------------------
const todoSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  description: String,
});
// TODO create a model using schema-------------------------------------------------------
const todoModel = mongoose.model("Todo", todoSchema);
//! create a post
app.post("/todos", async (req, res) => {
  const { title, description } = req.body;
  // const newTodo = {
  //   id: todos.length + 1,
  //   title,
  //   description,
  try {
    const newTodo = new todoModel({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//! create a get method

app.get("/todos", async (req, res) => {
  try {
    const todos = await todoModel.find();
    res.json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
app.put("/todos/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const id = req.params.id;
    const updatedTodo = await todoModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
      },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: "todo not found" });
    }
    res.json(updatedTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
app.delete("/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

const port = 8000;
app.listen(port, () => {
  console.log("server is listing port", port);
});
