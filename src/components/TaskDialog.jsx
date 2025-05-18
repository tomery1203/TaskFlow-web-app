
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TaskDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  editingTask, 
  defaultStatus 
}) {
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "todo", // Always default to todo for new tasks
    priority: "medium"
  });

  useEffect(() => {
    if (editingTask) {
      setTask(editingTask);
    } else {
      setTask({
        title: "",
        description: "",
        status: "todo", // Always use todo for new tasks
        priority: "medium"
      });
    }
  }, [editingTask, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!task.title.trim()) return;
    
    // If it's a new task, always set status to todo
    // If editing, keep the current status
    const taskToSave = editingTask 
      ? task 
      : { ...task, status: "todo" };
    
    onSave(taskToSave);
    onClose();
  };

  const dialogTitle = editingTask ? "Edit Task" : "Create New Task";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{dialogTitle}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={task.title}
              onChange={handleChange}
              placeholder="Task title"
              autoFocus
              className="border-gray-300"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={task.description || ""}
              onChange={handleChange}
              placeholder="Add details about this task..."
              rows={3}
              className="border-gray-300 resize-none"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {editingTask && (
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={task.status}
                  onValueChange={value => handleSelectChange("status", value)}
                >
                  <SelectTrigger id="status" className="border-gray-300">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="inProgress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className={`grid gap-2 ${!editingTask ? 'col-span-2' : ''}`}>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={task.priority}
                onValueChange={value => handleSelectChange("priority", value)}
              >
                <SelectTrigger id="priority" className="border-gray-300">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="mr-2 border-gray-300">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {editingTask ? "Save Changes" : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
