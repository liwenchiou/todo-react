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

    const targetCategory = over.id;
    
    // 規則 1: 禁止將工作或生活的項目拖到「完成」清單
    // 檢查 isCompleted 而不是 category，因為完成清單顯示所有 isCompleted=true 的項目
    if (targetCategory === '完成' && !draggedTodo.isCompleted) {
        return; // 阻止拖動
      }
  
      // 規則 2: 如果從「完成」清單拖到「工作」或「生活」，設定 isCompleted = false
      // 檢查 isCompleted 而不是 category，因為完成清單中的項目 category 可能還是「工作」或「生活」
      if (draggedTodo.isCompleted && (targetCategory === '工作' || targetCategory === '生活')) {
        changeCategory(active.id, targetCategory, false); // false 表示未完成
        return;
      }
  
      // 其他情況：工作 <-> 生活之間的拖動（保持 isCompleted 狀態）
      if (draggedTodo.category !== targetCategory && categories.includes(targetCategory)) {
        changeCategory(active.id, targetCategory); // 不指定 shouldSetCompleted，保持原值
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
              changeCategory={changeCategory}
            />
          </div>
        ))}
      </div>
    </DndContext>
  );
};

ListSection.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.object).isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleComplete: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  editTodo: PropTypes.func.isRequired,
  changeCategory: PropTypes.func.isRequired,
};

export default ListSection;