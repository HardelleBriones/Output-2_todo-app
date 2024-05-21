import { config } from "./config";

export const fetchTasks = async (status) => {
  const res = await fetch(`${config.API_URL}/tasks?status=${status}`);
  const data = await res.json();
  return data;
};

export const deleteTask = async (id) => {
  await fetch(`${config.API_URL}/tasks/${id}`, {
    method: "DELETE",
  });
  return;
};

export const addTask = async (newTask) => {
  console.log(newTask, "******************");
  await fetch(`${config.API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTask),
  });
  return;
};

export const updateTaskStatus = async (updatedStatus) => {
  // Fetch the current task data
  const response = await fetch(`${config.API_URL}/tasks/${updatedStatus.id}`);
  const task = await response.json();
  // Update the status field
  task.status = updatedStatus.status;
  // Send the updated task data back to the server
  await fetch(`${config.API_URL}/tasks/${task.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  return;
};
