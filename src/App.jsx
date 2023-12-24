import { useState, useEffect, useCallback } from "react";
import TodoItem from "./TodoItem";
import "./index.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState("");
  const [deadline, setDeadline] = useState("");
  const [completedTasks, setCompletedTasks] = useState([]);

  const removeTaskWithIndex = (index, isCompleted) => {
    setTasks((currentValue) => {
      const updatedArray = currentValue.filter((_, i) => i !== index);
      return updatedArray;
    });

    if (isCompleted) {
      setCompletedTasks((currentValue) =>
        currentValue.filter((completedIndex) => completedIndex !== index)
      );
    }
  };

  const updateTaskStatus = useCallback(() => {
    const currentDate = new Date();
    const updatedTasks = tasks.map((task, index) => {
      const deadlineDate = new Date(task.deadline);


      const isCompleted = completedTasks.includes(index);

      if (isCompleted) {
        return { ...task, status: "completed" };
      } else if (deadlineDate < currentDate) {
        return { ...task, status: "overdue" };
      } else {
        return { ...task, status: "pending" };
      }
    });

    setTasks(updatedTasks);
  }, [tasks, completedTasks]);

  const handleButtonClick = () => {
    if (!currentTask.trim() || !deadline) {
      console.log("Task and deadline are required!");
      return;
    }

    const newTask = {
      text: currentTask,
      deadline: new Date(deadline.replace("T", " ")),
      completed: false,
    };
    setTasks((currentValue) => [...currentValue, newTask]);

    
    setCurrentTask("");
    setDeadline("");
  };

  useEffect(() => {
    updateTaskStatus();
  }, [tasks, completedTasks, updateTaskStatus]);

  
  const sortedTasks = tasks.slice().sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  return (
    <main className="text-center bg-pink-300 min-h-screen">
      <h1 className="text-black text-4xl font-bold py-10">TASK MANAGEMENT</h1>
      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={currentTask}
            onChange={(e) => setCurrentTask(e.target.value)}
            placeholder="Add A New Task"
            className="p-4 w-48 border border-blue-800 rounded-md"
          />
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="p-4 border border-blue-800 rounded-md"
          />
          <button
            onClick={handleButtonClick}
            className="bg-gray-700 text-white p-4 rounded-md"
          >
            ADD
          </button>
        </div>
        <ol id="taskList" className="space-y-3 p-6 max-w-lg mx-auto">
          {sortedTasks.map((task, index) => (
            <TodoItem
              key={index}
              todo={task.text}
              removeTaskWithIndex={() => removeTaskWithIndex(index, task.completed)}
              index={index}
              status={task.status}
              deadline={task.deadline}
              completed={completedTasks.includes(index)}
            />
          ))}
        </ol>
      </div>
    </main>
  );
};

export default App;
