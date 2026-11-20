var store = require("../models/taskStore");
var { decorate, SORTS } = require("../utils/taskHelpers");
var { decorate, todayISO, SORTS } = require("../utils/taskHelpers");
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
 res.render('index', { title: 'StudyFlow' });
});

/* GET /tasks page. */
router.get('/tasks', function(req, res, next) {
 const tasks = store.getAll().map(decorate);
 const open = tasks.filter((t) => !t.completed);
  res.render("tasks", {
    title: "My Tasks - StudyFlow",
    // Upcoming tasks for the landing-page table, soonest deadline first
    upcoming: open.sort(SORTS.due),
  });
});

/* GET /add - show the empty form */
router.get("/add", function (req, res) {
  res.render("add", {
    title: "Add Task - StudyFlow",
    values: { priority: "medium" },
    errors: [],
    minDate: todayISO(),
  });
});

/* POST /create - validate, save, then go to the task list */
router.post("/create", function (req, res) {
  const { values, errors } = store.validate(req.body);
  if (errors.length) {
    // Show the form again with the user's input and the problems found
    return res.status(400).render("add", {
      title: "Add Task - StudyFlow",
      values,
      errors,
      minDate: todayISO(),
    });
  }
  store.create(values);
  res.redirect("/tasks");
});

module.exports = router;
