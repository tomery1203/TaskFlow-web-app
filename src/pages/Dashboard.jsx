
import React, { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import TaskColumn from "../components/TaskColumn";
import TaskDialog from "../components/TaskDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, CheckCircle2, Loader2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

// Unique ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState("todo");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [persistSuccess, setPersistSuccess] = useState(false);

  useEffect(() => {
    // Load tasks from localStorage
    const loadTasks = () => {
      setIsLoading(true);
      try {
        const storedTasks = localStorage.getItem("tasks");
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error("Error loading tasks from localStorage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  useEffect(() => {
    // Save tasks to localStorage whenever they change
    const saveTasks = async () => {
      if (tasks.length > 0) {
        setIsSaving(true);
        try {
          localStorage.setItem("tasks", JSON.stringify(tasks));
          // Show success indicator briefly
          setPersistSuccess(true);
          setTimeout(() => setPersistSuccess(false), 2000);
        } catch (error) {
          console.error("Error saving tasks to localStorage:", error);
        } finally {
          setIsSaving(false);
        }
      }
    };

    if (!isLoading && tasks.length > 0) {
      saveTasks();
    }
  }, [tasks, isLoading]);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside of a droppable area
    if (!destination) return;

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Find the task that was dragged
    const draggedTask = tasks.find(task => task.id === draggableId);
    if (!draggedTask) return;

    // Create a new array without the dragged task
    const newTasks = tasks.filter(task => task.id !== draggableId);

    // Insert the task at the new position with the new status
    const updatedTask = {
      ...draggedTask,
      status: destination.droppableId
    };

    // Find where to insert the task in the destination column
    const tasksInDestination = newTasks.filter(task => task.status === destination.droppableId);
    const insertionIndex = tasksInDestination.length === 0 || destination.index > tasksInDestination.length 
      ? newTasks.length 
      : newTasks.findIndex(t => t.status === destination.droppableId) + destination.index;

    // Insert the updated task
    newTasks.splice(insertionIndex, 0, updatedTask);
    setTasks(newTasks);
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setDefaultStatus("todo");  // Always set to todo
    setIsTaskDialogOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      // Update existing task
      setTasks(tasks.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...taskData } 
          : task
      ));
    } else {
      // Create new task
      const newTask = {
        ...taskData,
        id: generateId(),
        created_timestamp: Date.now()
      };
      setTasks([...tasks, newTask]);
    }
  };

  const clearCompletedTasks = () => {
    setTasks(tasks.filter(task => task.status !== "done"));
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Task Board</h1>
              <p className="text-gray-500 mt-1">
                Drag and drop your tasks to manage your workflow
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {isSaving && (
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Saving...
                </span>
              )}
              
              {persistSuccess && (
                <motion.span 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-green-600 flex items-center gap-1"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  Saved
                </motion.span>
              )}
              
              <div className="flex gap-2">
                {getTasksByStatus("done").length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={clearCompletedTasks}
                    className="flex items-center gap-1 text-gray-600 border-gray-300"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Clear Completed</span>
                  </Button>
                )}
                
                <Button
                  onClick={handleAddTask}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-1 shadow-sm"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>New Task</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-500">Loading your tasks...</span>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-auto pb-8">
              <TaskColumn
                column="todo"
                tasks={getTasksByStatus("todo")}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
              
              <TaskColumn
                column="inProgress"
                tasks={getTasksByStatus("inProgress")}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
              
              <TaskColumn
                column="done"
                tasks={getTasksByStatus("done")}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>
          </DragDropContext>
        )}

        <TaskDialog
          isOpen={isTaskDialogOpen}
          onClose={() => setIsTaskDialogOpen(false)}
          onSave={handleSaveTask}
          editingTask={editingTask}
          defaultStatus={defaultStatus}
        />
      </div>
    </div>
  );
}
