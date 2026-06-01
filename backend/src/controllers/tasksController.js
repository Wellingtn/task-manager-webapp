const { query } = require("../db");

function validateStatus(status) {
  return ["pendente", "concluida"].includes(status);
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

async function getAllTasks(req, res, next) {
  try {
    const { status } = req.query;
    let sql = "SELECT * FROM tasks";
    const params = [];

    if (status) {
      if (!validateStatus(status)) {
        return res.status(400).json({ message: "Status inválido." });
      }
      sql += " WHERE status = ?";
      params.push(status);
    }

    sql += " ORDER BY created_at DESC";
    const tasks = await query(sql, params);
    return res.json(tasks);
  } catch (error) {
    next(error);
  }
}

async function getTaskById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "ID inválido." });
    }

    const rows = await query("SELECT * FROM tasks WHERE id = ?", [id]);

    if (!rows.length) {
      return res.status(404).json({ message: "Tarefa não encontrada." });
    }

    return res.json(rows[0]);
  } catch (error) {
    next(error);
  }
}

async function createTask(req, res, next) {
  try {
    const title = normalizeText(req.body.title);
    const description = normalizeText(req.body.description);

    if (!title) {
      return res.status(400).json({ message: "O título é obrigatório." });
    }

    if (title.length > 255) {
      return res.status(400).json({ message: "O título deve ter no máximo 255 caracteres." });
    }

    const result = await query(
      "INSERT INTO tasks (title, description, status) VALUES (?, ?, 'pendente')",
      [title, description || null]
    );

    const rows = await query("SELECT * FROM tasks WHERE id = ?", [result.insertId]);
    return res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
}

async function updateTask(req, res, next) {
  try {
    const id = Number(req.params.id);
    const title = normalizeText(req.body.title);
    const description = normalizeText(req.body.description);
    const status = normalizeText(req.body.status);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "ID inválido." });
    }

    if (!title) {
      return res.status(400).json({ message: "O título é obrigatório." });
    }

    if (title.length > 255) {
      return res.status(400).json({ message: "O título deve ter no máximo 255 caracteres." });
    }

    if (!validateStatus(status)) {
      return res.status(400).json({ message: "Status inválido." });
    }

    const existing = await query("SELECT id FROM tasks WHERE id = ?", [id]);
    if (!existing.length) {
      return res.status(404).json({ message: "Tarefa não encontrada." });
    }

    await query(
      "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?",
      [title, description || null, status, id]
    );

    const rows = await query("SELECT * FROM tasks WHERE id = ?", [id]);
    return res.json(rows[0]);
  } catch (error) {
    next(error);
  }
}

async function deleteTask(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "ID inválido." });
    }

    const result = await query("DELETE FROM tasks WHERE id = ?", [id]);

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Tarefa não encontrada." });
    }

    return res.json({ message: "Tarefa excluída com sucesso." });
  } catch (error) {
    next(error);
  }
}

async function updateTaskStatus(req, res, next) {
  try {
    const id = Number(req.params.id);
    const status = normalizeText(req.body.status);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "ID inválido." });
    }

    if (!validateStatus(status)) {
      return res.status(400).json({ message: "Status inválido." });
    }

    const existing = await query("SELECT id FROM tasks WHERE id = ?", [id]);
    if (!existing.length) {
      return res.status(404).json({ message: "Tarefa não encontrada." });
    }

    await query("UPDATE tasks SET status = ? WHERE id = ?", [status, id]);
    const rows = await query("SELECT * FROM tasks WHERE id = ?", [id]);

    return res.json(rows[0]);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus
};
