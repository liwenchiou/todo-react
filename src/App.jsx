// src/App.jsx
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputArea from './components/InputArea';
import ListSection from './components/ListSection';

const CATEGORIES = ['工作', '生活', '完成'];

function App() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. 資料載入 (從 LocalStorage 讀取)
  useEffect(() => {
    const loadData = () => {
      const storedTodos = JSON.parse(localStorage.getItem('react-todo-list')) || [];
      setTodos(storedTodos);
      setIsLoading(false);
    };
    setTimeout(loadData, 1000); // 模擬載入延遲 1 秒
  }, []);

  // 2. 資料儲存 (更新到 LocalStorage)
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('react-todo-list', JSON.stringify(todos));
    }
  }, [todos, isLoading]);

  // 3. 核心操作函數

  // 新增待辦事項
  const addTodo = (text, category) => {
    if (!text || !category) return;
    const newTodo = {
      id: Date.now().toString(), 
      text,
      category,
      isCompleted: false,
      timestamp: Date.now(),
    };
    setTodos(prevTodos => [newTodo, ...prevTodos]);
  };

  // 切換完成狀態
  const toggleComplete = (id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  };

  // 刪除待辦事項
  const deleteTodo = (id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  // 編輯待辦事項內容
  const editTodo = (id, newText) => {
    if (!newText.trim()) return;
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, text: newText.trim() } : todo
      )
    );
  };
  
  // 拖曳改變類別 (DnD)
  const changeCategory = (id, newCategory) => {
    setTodos(prevTodos =>
        prevTodos.map(todo => 
            todo.id === id 
                ? { 
                    ...todo, 
                    category: newCategory,
                    timestamp: Date.now(), // 更新時間戳，讓它成為新類別的第一個項目
                  } 
                : todo
        )
    );
  }

  // 4. 渲染邏輯
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <Header />
      <InputArea categories={CATEGORIES} addTodo={addTodo} />
      <ListSection 
        todos={todos} 
        categories={CATEGORIES} 
        toggleComplete={toggleComplete}
        deleteTodo={deleteTodo}
        editTodo={editTodo}
        changeCategory={changeCategory}
      />
    </div>
  );
}

export default App;