const express = require("express");
const todoRoutes = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./config/keys.js");
const Todo = require("./Models/todo.model");

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(config.mongoURI, { useNewUrlParser: true })
  .then(() => console.log("We are connected to MongoDB"))
  .catch(err => console.log(err));
function comparePriority(a, b) {
  if (a === b) return 0;
  if (a === "High") return -1;
  if (b === "High") return -1;
  if (a === "Medium") return -1;
  if (b === "Medium") return -1;
  return 0;
}

function compare(a, b) {
  //-------------------------------------------------------------same priority---------------------------------------------------------------------
  if (a.todo_priority === b.todo_priority) {
    if (a.todo_completed) {
      if (b.todo_completed) {
        // -------------------a and b completed---------------------------
        return (a.todo_description).localeCompare(b.todo_description);
      } else {
        //-------------------a completed , b not -------------------------
        return 1;
      }
    } else {
      if (b.todo_completed) {
        // -------------------a not completed , b completed-------------------
        return -1;
      } else {
        // -------------------a & b not completed-----------------------------
        return (a.todo_description).localeCompare(b.todo_description);
      }
    }
  }
  //-------------------------------------------------------------diff priority---------------------------------------------------------------------
  else {
    //not the same priority
    if (a.todo_completed) {
      if (!b.todo_completed) {
        //-------------------a completed , b not -------------------------
        return 1;
      } else {
        // -------------------a and b completed---------------------------
        return comparePriority(a.todo_priority, b.todo_priority);
      }
    } else {
      // -------------------a not completed , b completed-------------------
      if (b.todo_completed) {
        return -1;
      }
      // -------------------a & b not completed-----------------------------
      else {
        return comparePriority(a.todo_priority, b.todo_priority);
      }
    }
  }
}

todoRoutes.get("/", async (req, res) => {
  var todos = await Todo.find();
  if(todos.length>0)
    todos = todos.sort(compare);
  res.json(todos);
});


todoRoutes.route("/:id").get((req, res) => {
  var id = req.params.id;
  Todo.findById(id, (err, todo) => {
    res.json(todo);
  });
});

todoRoutes.route("/add").post((req, res) => {
  var todo = new Todo(req.body);
  todo
    .save()
    .then(todo => {
      res.status(200).json({ todo: "todo added successfully" });
    })
    .catch(err => {
      res.status(400).send("adding new todo failed");
    });
});

todoRoutes.route("/update/:id").post((req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (!todo) {
      res.status(404).send("data is not found");
    } else {
      todo.todo_description = req.body.todo_description;
      todo.todo_responsible = req.body.todo_responsible;
      todo.todo_priority = req.body.todo_priority;
      todo.todo_completed = req.body.todo_completed;

      todo
        .save()
        .then(todo => {
          res.json("Todo updated");
        })
        .catch(err => {
          res.status(400).send("update not possible");
        });
    }
  });
});

todoRoutes.delete("/delete/:id", async (req, res) => {
  try {
    const todoId = req.params.id;
    const todo = Todo.findOne({ todoId });
    if (!todo) return res.status(400).send({ error: "todo does not exist" });
    const deletedTodo = await Todo.findByIdAndRemove(todoId);
    res.json({
      msg: "Todo was deleted successfully",
      data: deletedTodo
    });
  } catch (error) {
    //error will be handled later
    console.log(error);
  }
});

app.use("/todos", todoRoutes);

app.listen(port, () => {
  console.log(`Server up and running on port ${port}`);
});
