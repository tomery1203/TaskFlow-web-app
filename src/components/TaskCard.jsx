
import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { 
  MoreHorizontal, 
  AlertTriangle, 
  AlertCircle,
  Clock
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function TaskCard({ task, index, onEdit, onDelete }) {
  const priorityIcons = {
    high: <AlertTriangle className="h-3 w-3 text-red-500" />,
    medium: <AlertCircle className="h-3 w-3 text-amber-500" />,
    low: <Clock className="h-3 w-3 text-blue-500" />
  };

  const priorityColors = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    low: "bg-blue-100 text-blue-800 border-blue-200"
  };

  const getFormattedDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-3 border transition-all ${
            snapshot.isDragging 
              ? "shadow-lg ring-2 ring-blue-300" 
              : "shadow-sm hover:shadow hover:border-gray-300"
          }`}
          style={{ 
            ...provided.draggableProps.style,
          }}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1 mr-2">
                <h4 className="font-medium text-gray-900 mb-2">
                  {task.title}
                </h4>
                {task.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                )}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-8 w-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(task.id)}
                    className="text-red-600"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              {task.created_timestamp && (
                <span className="text-xs text-gray-400">
                  {getFormattedDate(task.created_timestamp)}
                </span>
              )}
              
              {task.priority && (
                <Badge variant="outline" className={`text-xs rounded-full px-2 py-0 h-5 border ${priorityColors[task.priority]}`}>
                  {priorityIcons[task.priority] && (
                    <span className="mr-1">{priorityIcons[task.priority]}</span>
                  )}
                  {task.priority}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
}
