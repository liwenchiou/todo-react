// src/components/ListSection.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { DndContext, closestCenter } from '@dnd-kit/core';
import ListContainer from './ListContainer';

const ListSection = ({ 
  todos, 
  categories, 
  toggleComplete, 
  deleteTodo, 
  editTodo,
  changeCategory
}) => {
  // 處理拖曳結束的邏輯
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // 找到被拖動的待辦事項
    const draggedTodo = todos.find(todo => todo.id === active.id);
    if (!draggedTodo) return;

    // 檢查是否拖到不同的類別
    const targetCategory = over.id;
    if (draggedTodo.category !== targetCategory && categories.includes(targetCategory)) {
      changeCategory(active.id, targetCategory);
    }
  };
  
  // 篩選待辦事項並按時間戳降序排序
  const lists = categories.reduce((acc, category) => {
    if(category === '完成') {
      // 「完成」列表：顯示所有 isCompleted=true 的項目
      acc[category] = todos
          .filter(todo => todo.isCompleted)
          .sort((a, b) => b.timestamp - a.timestamp);
    } else {
      // 其他類別（工作、生活）：只顯示 isCompleted=false 且屬於該類別的項目
      acc[category] = todos
          .filter(todo => todo.category === category && !todo.isCompleted)
          .sort((a, b) => b.timestamp - a.timestamp);
    }
    return acc;
  }, {});

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <h2 className="mt-5 mb-3 text-primary">📑 待辦事項清單</h2>
      <div className="row">
        {categories.map(category => (
          <div key={category} className="col-12 col-lg-6 mb-4">
            <ListContainer 
              category={category}
              todos={lists[category]} 
              toggleComplete={toggleComplete}
              deleteTodo={deleteTodo}
              editTodo={editTodo}
            />
          </div>
        ))}
      </div>
    </DndContext>
  );
};

// ... existing code ...

ListSection.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.object).isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleComplete: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  editTodo: PropTypes.func.isRequired,
  changeCategory: PropTypes.func.isRequired,
};

export default ListSection;