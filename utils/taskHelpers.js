// Adds display info (deadline status, readable date) to tasks.
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Turn "2026-11-20" into a local date. new Date("2026-11-20") would
// read it as UTC and can show the wrong day in your timezone.
function parseLocalDate(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

// Whole days from today to the due date (negative = past due).
function daysUntil(dueDate) {
  return Math.round((parseLocalDate(dueDate) - startOfToday()) / MS_PER_DAY);
}

function describeDays(days) {
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  if (days > 1) return `Due in ${days} days`;
  if (days === -1) return "1 day overdue";
  return `${Math.abs(days)} days overdue`;
}

// Add status, label and a readable date to one task.
function decorate(task) {
  const days = daysUntil(task.dueDate);
  let status = "upcoming";
  if (task.completed) status = "done";
  else if (days < 0) status = "overdue";
  else if (days <= 2) status = "soon";

  return {
    ...task,
    days,
    status,
    statusLabel: task.completed ? "Completed" : describeDays(days),
    dueDisplay: parseLocalDate(task.dueDate).toLocaleDateString("en-CA", {
      weekday: "short", year: "numeric", month: "short", day: "numeric",
    }),
  };
}

// Today as "YYYY-MM-DD", used as the date picker's minimum.
function todayISO() {
  const t = startOfToday();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

// Sort functions: soonest deadline first, ties broken by priority.
const SORTS = {
  due: (a, b) => a.dueDate.localeCompare(b.dueDate) || PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority],
};

module.exports = { decorate, todayISO, SORTS };