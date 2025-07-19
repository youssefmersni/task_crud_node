const express = require('express');
const router = express.Router();
const Task = require('../models/Task').default;

// GET all tasks (with optional search and flash messages)
router.get('/', async (req, res) => {
  try {
    const query = req.query.q || '';
    const tasks = await Task.find({ title: { $regex: query, $options: 'i' } });

    res.render('index', {
      tasks,
      query,
      success: req.flash('success_msg'),
      error: req.flash('error_msg')
    });
  } catch (err) {
    res.status(500).send('Error loading tasks');
  }
});

// GET form to create new task
router.get('/new', (req, res) => {
  res.render('new');
});

// POST create new task
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    await Task.create({ title, description });

    req.flash('success_msg', 'Task created successfully');
    res.redirect('/tasks');
  } catch (err) {
    req.flash('error_msg', 'Failed to create task');
    res.redirect('/tasks');
  }
});

// POST delete task
router.post('/:id/delete', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Task deleted successfully');
    res.redirect('/tasks');
  } catch (error) {
    req.flash('error_msg', 'Could not delete task');
    res.redirect('/tasks');
  }
});

// GET edit form
router.get('/:id/edit', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send('Task not found');
    res.render('edit', { task });
  } catch (err) {
    res.status(500).send('Error loading edit form');
  }
});

// POST update task
router.post('/:id/edit', async (req, res) => {
  try {
    const { title, description } = req.body;
    await Task.findByIdAndUpdate(req.params.id, { title, description });

    req.flash('success_msg', 'Task updated successfully');
    res.redirect('/tasks');
  } catch (err) {
    req.flash('error_msg', 'Error updating task');
    res.redirect('/tasks');
  }
});

// POST toggle done/undone
router.post('/:id/toggle', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    task.done = !task.done;
    await task.save();

    req.flash('success_msg', `Task marked as ${task.done ? 'done' : 'not done'}`);
    res.redirect('/tasks');
  } catch (error) {
    req.flash('error_msg', 'Error toggling task status');
    res.redirect('/tasks');
  }
});

module.exports = router;
