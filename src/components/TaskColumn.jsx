import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TaskColumn({ 
  column, 
  tasks, 
  onAddTask, 
  onEditTask, 
  onDeleteTask 
}) {
  const columnColors = {
    todo: "border-l-blue-500 bg-gradient-to-br from-blue-50 to-blue-100/70",
    inProgress: "border-l-amber-500 bg-gradient-to-br from-amber-50 to-amber-100/70",
    done: "border-l-green-500 bg-gradient-to-br from-green-50 to-green-100/70"
  };

  const columnTitles = {
    todo: "To Do",
    inProgress: "In Progress",
    done: "Done"
  };

  const taskCount = tasks.length;

  return (
    <div className="flex flex-col h-full w-full min-w-[300px] md:min-w-[350px] max-w-sm rounded-lg shadow-md bg-white border border-gray-200 overflow-hidden">
      <div className={`p-5 border-l-4 ${columnColors[column]} rounded-t-lg`}>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg">{columnTitles[column]}</h3>
            <span className="text-xs text-gray-500 font-medium">
              {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
            </span>
          </div>
          
          {column === "todo" && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onAddTask(column)}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          )}
        </div>
      </div>
      
      <Droppable droppableId={column}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`flex-grow overflow-y-auto p-4 transition-colors ${
              snapshot.isDraggingOver ? "bg-gray-50" : "bg-white"
            }`}
            style={{ minHeight: "200px" }}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
            {provided.placeholder}
            
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm py-12 italic border-2 border-dashed border-gray-200 rounded-lg">
                {column === "todo" ? "Add a task to get started" : "No tasks yet"}
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}