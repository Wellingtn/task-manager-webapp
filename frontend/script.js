const taskForm = document.getElementById("taskForm");
const taskIdInput = document.getElementById("taskId");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const statusInput = document.getElementById("status");
const statusField = document.getElementById("statusField");
const submitButton = document.getElementById("submitButton");
const cancelEditButton = document.getElementById("cancelEditButton");
const formTitle = document.getElementById("formTitle");
const formMessage = document.getElementById("formMessage");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const loading = document.getElementById("loading");
const refreshButton = document.getElementById("refreshButton");
const filterButtons = document.querySelectorAll(".filter-button");

let currentFilter = "todas";

function getApiUrl(path = "") {
  return `/api/tasks${path}`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(date);
}

function showMessage(message, isError = false) {
  formMessage.textContent = message;
  formMessage.style.color = isError ? "#dc2626" : "#64748b";
}

function resetForm() {
  taskIdInput.value = "";
  titleInput.value = "";
  descriptionInput.value = "";
  statusInput.value = "pendente";
  formTitle.textContent = "Nova tarefa";
  submitButton.textContent = "Salvar tarefa";
  cancelEditButton.classList.add("hidden");
  statusField.classList.add("hidden");
  showMessage("");
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Erro ao processar solicitação.");
  }

  return data;
}

function createTaskCard(task) {
  const article = document.createElement("article");
  article.className = "task-card";

  article.innerHTML = `
    <div class="task-card-header">
      <div>
        <h3 class="task-title">${escapeHtml(task.title)}</h3>
        <p class="task-description">${escapeHtml(task.description || "Sem descrição.")}</p>
      </div>
      <span class="badge ${task.status === "concluida" ? "badge-concluida" : "badge-pendente"}">
        ${task.status === "concluida" ? "Concluída" : "Pendente"}
      </span>
    </div>

    <div class="task-meta">
      <div>Criada em: ${formatDate(task.created_at)}</div>
      <div>Atualizada em: ${formatDate(task.updated_at)}</div>
    </div>

    <div class="task-actions">
      <button class="action-button edit" type="button">Editar</button>
      <button class="action-button ${task.status === "concluida" ? "reopen" : "complete"}" type="button">
        ${task.status === "concluida" ? "Reabrir" : "Concluir"}
      </button>
      <button class="action-button delete" type="button">Excluir</button>
    </div>
  `;

  const [editButton, statusButton, deleteButton] = article.querySelectorAll("button");

  editButton.addEventListener("click", () => fillFormForEdit(task));
  statusButton.addEventListener("click", () => toggleTaskStatus(task));
  deleteButton.addEventListener("click", () => removeTask(task.id));

  return article;
}

function fillFormForEdit(task) {
  taskIdInput.value = task.id;
  titleInput.value = task.title;
  descriptionInput.value = task.description || "";
  statusInput.value = task.status;
  formTitle.textContent = `Editando tarefa #${task.id}`;
  submitButton.textContent = "Atualizar tarefa";
  cancelEditButton.classList.remove("hidden");
  statusField.classList.remove("hidden");
  showMessage("Modo de edição ativado.");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function loadTasks() {
  loading.classList.remove("hidden");
  taskList.innerHTML = "";
  emptyState.classList.add("hidden");

  try {
    let queryString = "";

    if (currentFilter !== "todas") {
      queryString = `?status=${encodeURIComponent(currentFilter)}`;
    }

    const tasks = await request(getApiUrl(queryString));
    renderTasks(tasks);
  } catch (error) {
    taskList.innerHTML = `<p class="empty-state">${escapeHtml(error.message)}</p>`;
  } finally {
    loading.classList.add("hidden");
  }
}

function renderTasks(tasks) {
  taskList.innerHTML = "";

  if (!tasks.length) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");
  tasks.forEach((task) => taskList.appendChild(createTaskCard(task)));
}

async function createTask(payload) {
  await request(getApiUrl(), {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

async function updateTask(id, payload) {
  await request(getApiUrl(`/${id}`), {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

async function toggleTaskStatus(task) {
  try {
    const newStatus = task.status === "concluida" ? "pendente" : "concluida";

    await request(getApiUrl(`/${task.id}/status`), {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus })
    });

    await loadTasks();
  } catch (error) {
    alert(error.message);
  }
}

async function removeTask(id) {
  const confirmed = window.confirm("Tem certeza que deseja excluir esta tarefa?");
  if (!confirmed) return;

  try {
    await request(getApiUrl(`/${id}`), {
      method: "DELETE"
    });

    if (Number(taskIdInput.value) === Number(id)) {
      resetForm();
    }

    await loadTasks();
  } catch (error) {
    alert(error.message);
  }
}

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim()
  };

  const id = taskIdInput.value.trim();
  const isEditing = Boolean(id);

  if (isEditing) {
    payload.status = statusInput.value;
  }

  try {
    showMessage(isEditing ? "Atualizando tarefa..." : "Salvando tarefa...");
    if (isEditing) {
      await updateTask(id, payload);
      showMessage("Tarefa atualizada com sucesso.");
    } else {
      await createTask(payload);
      showMessage("Tarefa criada com sucesso.");
    }

    resetForm();
    await loadTasks();
  } catch (error) {
    showMessage(error.message, true);
  }
});

cancelEditButton.addEventListener("click", resetForm);
refreshButton.addEventListener("click", loadTasks);

filterButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    await loadTasks();
  });
});

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

resetForm();
loadTasks();
