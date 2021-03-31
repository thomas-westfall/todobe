const express = require('express');
const router = express.Router();
const { Todo } = require('../database/models');

// Create a todo
router.post('/', function(req, res, next) {
  const todo = req.body;
  Todo.create(todo)
  .then(function(todo) {
    res.json(todo);
  })
  .catch(function (err) {
    // respond with validation errors
    return res.status(422).send(err.errors[0].message);
  })
  .catch(function (err) {
    // every other error
    return res.status(400).send({
        message: err.message
    })
  })
});

// Get all todos
router.get('/', function(req, res, next) {
  Todo.findAll({
    })
    .then(todos =>
      {
        {
          res.status(200).json(todos);
        }
      })
    .catch(next)
});

// Get todo by id
router.get('/:id', function(req, res, next) {
  Todo.findOne({
    where: {id: req.params.id},
    })
    .then(todo =>
      {
        if(todo == null) 
        {
        res.status(404).send("Todo not found.");
        }
        else 
        {
          res.status(200).json(todo);
        }
      })
    .catch(next)
});

// Update todo
router.put('/:id', function(req, res, next) {
  Todo.findOne({
    where: {
      id: req.params.id,
    },
    },
    ).then(todo =>
      {
        if(todo == null) 
        {
        res.status(404).send("Todo does not exist");
      }
      else {
        todo.update(req.body)
        res.status(200).json(todo);
      }
      })
      .catch(next)
});

// Delete todo
router.delete('/:id', function(req, res, next) {
  Todo.findOne({
    where: {
      id: req.params.id,
    },
    },
    ).then(todo =>
      {
        if(todo == null) 
        {
        res.status(404).send("Todo does not exist");
      }
      else {
        todo.destroy();
        res.status(200);
      }
      })
      .catch(next)
});
module.exports = router;
