import React, { useState } from 'react';
import {
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  TextField,
  ListItemSecondaryAction,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

interface TodoItemProps {
  id: number;
  title: string;
  completed: boolean;
  time: string;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onEdit: (id: number, newTitle: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ id, title, completed, time, onDelete, onToggle, onEdit }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>(title);

  const handleEditSave = () => {
    onEdit(id, editTitle);
    setIsEditing(false);
  };

  return (
    <ListItem>
      <Checkbox
        edge="start"
        checked={completed}
        onChange={() => onToggle(id)}
      />
      {isEditing ? (
        <TextField
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          variant="outlined"
          size="small"
        />
      ) : (
        <ListItemText
          primary={title}
          secondary={time}
          style={{ textDecoration: completed ? 'line-through' : 'none' }}
        />
      )}
      <ListItemSecondaryAction>
        {isEditing ? (
          <IconButton edge="end" onClick={handleEditSave}>
            <SaveIcon />
          </IconButton>
        ) : (
          <IconButton edge="end" onClick={() => setIsEditing(true)}>
            <EditIcon />
          </IconButton>
        )}
        <IconButton edge="end" onClick={() => onDelete(id)}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default TodoItem;
