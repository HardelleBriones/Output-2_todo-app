import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";
import { addTask } from "../services/events";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { TextField, Button } from "@mui/material";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useForm, Controller } from "react-hook-form";

const NewTask = () => {
  //use navigate
  const navigate = useNavigate();

  //query client
  const queryClient = useQueryClient();

  // Mutation to add a new task
  const newTodoMutation = useMutation({
    mutationFn: addTask,
    onSuccess: () => {
      queryClient.invalidateQueries(["todos", "InComplete"]);
    },
  });

  // React Hook Form setup
  const form = useForm({
    defaultValues: {
      task: "",
      note: "",
      date: dayjs(),
    },
  });

  const { register, control, handleSubmit, setValue, formState } = form;
  const { errors, isSubmitting } = formState;

  // Handle form submission
  const handleOnSubmit = async (data) => {
    const formattedDate = dayjs(data.date).format("YYYY-MM-DD hh:mm A");
    const newTask = {
      task: data.task,
      note: data.note,
      date: formattedDate,
      status: "InComplete",
    };

    try {
      await newTodoMutation.mutateAsync(newTask);
      setValue("task", "");
      setValue("note", "");
      setValue("date", dayjs());
      return navigate("/");
    } catch (error) {
      console.log("error adding task", error);
    }
  };

  const darkTheme = useContext(ThemeContext);

  const darkModeBackground = () => {
    return darkTheme
      ? "bg-gray-500 min-h-screen w-full"
      : "bg-indigo-500 min-h-screen w-full ";
  };

  const darkModeForm = () => {
    return darkTheme
      ? "w-130 p-6 mt-6 mb-6  bg-gray-600 rounded-md"
      : "w-130 p-6 mt-6 mb-6  bg-blue-300 rounded-md ";
  };

  return (
    <div className={darkModeBackground()}>
      <div className="flex justify-center items-center">
        <div className={darkModeForm()}>
          <h1>Add New Task</h1>
          <hr className="mt-3" />
          <form onSubmit={handleSubmit(handleOnSubmit)} noValidate>
            <div className="mt-3">
              <TextField
                id="task"
                label="Task"
                variant="filled"
                fullWidth
                {...register("task", {
                  required: "Task is required",
                })}
              />
              <p className="text-red-500 mt-3">{errors.task?.message}</p>
            </div>
            <div>
              <br />
              <TextField
                id="note"
                label="Note"
                multiline
                rows={10}
                variant="filled"
                sx={{ width: "350px" }}
                {...register("note")}
              />
            </div>
            <br />
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      label="Due date"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  )}
                />
              </LocalizationProvider>
            </div>
            <br />
            <div className="flex justify-center mt-5">
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                Add Task
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewTask;
