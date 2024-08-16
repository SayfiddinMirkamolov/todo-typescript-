import React, { useEffect, useState } from 'react';
import TodoItem from './components/TodoItem';
import { Container, TextField, Button, Typography } from '@mui/material';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  time: string;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:3000/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);

  const addTodo = () => {
    if (newTodo.trim()) {
      const newTodoItem: Todo = { 
        id: Date.now(), 
        title: newTodo, 
        completed: false, 
        time: new Date().toLocaleString()
      };
      fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodoItem)
      }).then(() => {
        setTodos([...todos, newTodoItem]);
        setNewTodo("");
      });
    }
  };

  const deleteTodo = (id: number) => {
    fetch(`http://localhost:3000/todos/${id}`, { method: "DELETE" })
      .then(() => setTodos(todos.filter(todo => todo.id !== id)));
  };

  const toggleTodo = (id: number) => {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
      fetch(`http://localhost:3000/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed })
      }).then(() => {
        setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
      });
    }
  };

  const editTodo = (id: number, newTitle: string) => {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
      fetch(`http://localhost:3000/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle })
      }).then(() => {
        setTodos(todos.map(t => t.id === id ? { ...t, title: newTitle } : t));
      });
    }
  };

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        TODO LIST
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        label="Add Task"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={addTodo}
        sx={{ mb: 4 }}
      >
        Add Task
      </Button>

      <TextField
        fullWidth
        variant="outlined"
        label="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 4 }}
      />

      {filteredTodos.map((todo) => (
        <TodoItem 
          key={todo.id}
          id={todo.id}
          title={todo.title}
          completed={todo.completed}
          time={todo.time}
          onDelete={deleteTodo}
          onToggle={toggleTodo}
          onEdit={editTodo}
        />
      ))}
    </Container>
  );
};

export default App;
