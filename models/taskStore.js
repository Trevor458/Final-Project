// Saves tasks to a JSON file so they survive server restarts.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DATA_FILE = process.env.TASKS_FILE || path.join(__dirname, "..", "data", "tasks.json");
const PRIORITIES = ["low", "medium", "high"];

// Read every task. A missing file just means "no tasks yet".
function readAll() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

// Write to a temp file, then rename, so a crash can't corrupt the data.
function writeAll(tasks) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  const tmp = DATA_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(tasks, null, 2));
  fs.renameSync(tmp, DATA_FILE);
}

// Clean up the raw form input and collect any error messages.
function validate(input = {}) {
  const errors = [];
  const values = {
    title: String(input.title || "").trim(),
    course: String(input.course || "").trim(),
    description: String(input.description || "").trim(),
    dueDate: String(input.dueDate || "").trim(),
    priority: String(input.priority || "medium").toLowerCase(),
  };

  if (!values.title) errors.push("Task title is required.");
  else if (values.title.length > 100) errors.push("Title must be 100 characters or fewer.");
  if (values.course.length > 50) errors.push("Course must be 50 characters or fewer.");
  if (values.description.length > 500) errors.push("Notes must be 500 characters or fewer.");
  if (!values.dueDate) errors.push("A due date is required.");
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(values.dueDate) || isNaN(Date.parse(values.dueDate))) {
    errors.push("Due date is not a valid date.");
  }
  if (!PRIORITIES.includes(values.priority)) errors.push("Priority must be low, medium, or high.");

  return { values, errors };
}

function getAll() {
  return readAll();
}

// Add a new task (already validated) and save it.
function create(values) {
  const tasks = readAll();
  const task = {
    id: crypto.randomUUID(),
    ...values,
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
  tasks.push(task);
  writeAll(tasks);
  return task;
}

module.exports = { validate, getAll, create };