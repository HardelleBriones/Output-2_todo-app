import React, { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { useContext } from "react";
import { ThemeContext } from "../App";
import { fetchTasks, deleteTask, updateTaskStatus } from "../services/events";
import { MdOutlineDeleteForever } from "react-icons/md";
import DeleteModal from "./DeleteModal";
import { TbFaceIdError } from "react-icons/tb";
import { useQueryClient } from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";
import { useQuery, useMutation } from "@tanstack/react-query";
const TaskList = () => {
  //query client
  const queryClient = useQueryClient();

  //use context
  const darkTheme = useContext(ThemeContext);

  //use states
  const [status, setStatus] = useState("InComplete");
  const [taskIdToDelete, setTaskIdToDelete] = useState(null);
  const [showFullNote, setShowFullNote] = useState(false);

  // Define the character limit for truncation
  const maxLength = 100;

  // Fetch tasks query
  const todosQuery = useQuery({
    queryKey: ["todos", status],
    queryFn: () => fetchTasks(status),
  });

  // Mutation for deleting a task
  const deleteTodoMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    },
  });

  // Mutation for updating task status
  const updateTodoMutation = useMutation({
    mutationFn: updateTaskStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    },
  });

  //dark mode background
  const darkModeBackground = () => {
    return darkTheme
      ? "flex flex-col items-center bg-gray-500 min-h-screen w-full"
      : "flex flex-col items-center bg-white min-h-screen w-full";
  };

  // Toggle full note visibility
  const toggleShowFullNote = () => {
    setShowFullNote(!showFullNote);
  };

  //for modal handling
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleOpenModal = (id) => {
    setTaskIdToDelete(id);
    setOpenDeleteModal(true);
  };

  const handleCloseModal = () => {
    setTaskIdToDelete(null);
    setOpenDeleteModal(false);
  };

  // Handle deleting a task
  const handleDelete = async () => {
    try {
      await deleteTodoMutation.mutateAsync(taskIdToDelete);
      setOpenDeleteModal(false);
      toast.warning("Task Deleted");
    } catch (error) {
      console.log("error in deleting task", error);
    }
  };

  // Handle marking task as done
  const handleOnClickDone = async (id) => {
    try {
      const newStatus = "Complete";
      const updateTaskStatus = {
        id: id,
        status: newStatus,
      };
      await updateTodoMutation.mutateAsync(updateTaskStatus);
      toast.success("Task Completed");
    } catch (error) {
      console.log("error in updating task", error);
    }
  };

  return (
    <>
      <div className={darkModeBackground()}>
        <div className="w-full max-w-3xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:justify-between">
            <h1 className="my-6 font-medium text-3xl md:text-5xl text-center md:text-left">
              My Todo List
            </h1>

            <select
              id="status"
              className="ml-2 mt-4 md:mt-0 border border-gray-300 rounded px-3 py-1"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="InComplete">InProgress</option>
              <option value="Complete">Completed</option>
            </select>
          </div>
          {todosQuery.isLoading ? (
            <div className="flex flex-col justify-center items-center h-64">
              <CircularProgress size={100} color="common" />
              <span className="mt-4 text-xl">Loading...</span>
            </div>
          ) : todosQuery.isError ? (
            <div className="flex flex-col justify-center items-center h-64">
              <TbFaceIdError size={100} />
              <span className="mt-4 text-xl">
                Error: {JSON.stringify(todosQuery.error)}
              </span>
            </div>
          ) : (
            todosQuery.data.map((task) => (
              <div
                className="flex flex-col md:flex-row bg-gray-300 rounded-lg mb-4 hover:bg-blue-400"
                key={task.id}
              >
                <div className="w-full md:w-1/4 px-6 py-4">{task.task}</div>
                <div className="w-full md:w-1/2 px-6 py-4 break-wordss">
                  <p className="text-gray-800">
                    {showFullNote || task.note.length <= maxLength
                      ? task.note
                      : `${task.note.substring(0, maxLength)}...`}
                  </p>
                  {task.note.length > maxLength && (
                    <button
                      className="text-indigo-600 hover:text-indigo-800 mt-2 focus:outline-none focus:underline"
                      onClick={toggleShowFullNote}
                    >
                      {showFullNote ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>
                <div className="w-full md:w-1/4 px-6 py-4 text-center">
                  <p className="text-gray-800">{task.date}</p>
                </div>
                <div className="w-full md:w-1/12 px-6 py-4 flex justify-center">
                  <div className="flex space-x-4">
                    {status !== "Complete" && (
                      <FaCheckCircle
                        size={30}
                        className="text-green-400 transition duration-200 ease-in-out hover:text-green-600 cursor-pointer"
                        onClick={() => handleOnClickDone(task.id)}
                      />
                    )}
                    <MdOutlineDeleteForever
                      size={30}
                      onClick={() => handleOpenModal(task.id)}
                      className="text-red-400 transition duration-200 ease-in-out hover:text-red-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            ))
          )}

          <DeleteModal open={openDeleteModal} onClose={handleCloseModal}>
            <div className="text-center w-56">
              <MdOutlineDeleteForever
                size={50}
                className="text-red-500 mx-auto"
              />
              <div className="mx-auto my-4 w-48">
                <h3 className="text-lg font-black text-gray-800">
                  Confirm delete
                </h3>
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this item?
                </p>
                <div className="flex gap-4">
                  <button
                    className="btn btn-danger w-full"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-light w-full"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </DeleteModal>
        </div>
      </div>
    </>
  );
};

export default TaskList;
