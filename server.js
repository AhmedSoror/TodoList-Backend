const express=require('express');
const todoRoutes = express.Router();
const bodyParser=require('body-parser');
const cors=require('cors');
const mongoose=require('mongoose');
const config = require("./config/keys.js");
const Todo=require("./Models/todo.model");

const app=express();
const port=4000;

app.use(cors());
app.use(bodyParser.json());
  
mongoose
  .connect(config.mongoURI, { useNewUrlParser: true })
  .then(() => console.log("We are connected to MongoDB"))
  .catch(err => console.log(err)
);

todoRoutes.get("/",async(req,res)=>{
  Todo.find(function(err,todos){
      if(err){
          console.log(err);
      }
      else{
          res.json(todos);
      }
  })
});

todoRoutes.route('/:id').get((req,res)=>{
  var id=req.params.id;
  Todo.findById(id,(err,todo)=>{
    res.json(todo);
  })
})
todoRoutes.route('/add').post((req,res)=>{
  var todo=new Todo(req.body);
  todo.save()
      .then(todo=>{
        res.status(200).json({'todo':'todo added successfully'});
      })
      .catch(err=>{
        res.status(400).send('adding new todo failed');
      })
})
todoRoutes.route('/update/:id').post((req,res)=>{
  Todo.findById(req.params.id,(err,todo)=>{
    if(!todo){
      res.status(404).send('data is not found');
    }
    else{
      todo.todo_description = req.body.todo_description;
      todo.todo_responsible = req.body.todo_responsible;
      todo.todo_priority = req.body.todo_priority;
      todo.todo_completed = req.body.todo_completed;

      todo.save()
          .then(todo=>{
            res.json('Todo updated')
          })
          .catch(err=>{
            res.status(400).send("update not possible");
          });
    }
  })
})

app.use('/todos', todoRoutes);


app.listen(port,()=>{
    console.log(`Server up and running on port ${port}`);
    
})
