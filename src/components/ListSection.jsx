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
    if (targetCategory === '完成' && !draggedTodo.isCompleted) {
      return;
    }

    // 規則 2: 如果從「完成」清單拖到「工作」或「生活」，設定 isCompleted = false
    if (draggedTodo.isCompleted && (targetCategory === '工作' || targetCategory === '生活')) {
      changeCategory(active.id, targetCategory, false);
      return;
    }

    // 其他情況：工作 <-> 生活之間的拖動
    if (draggedTodo.category !== targetCategory && categories.includes(targetCategory)) {
      changeCategory(active.id, targetCategory);
    }
  };

  // 篩選與排序邏輯
  const lists = categories.reduce((acc, category) => {
    if (category === '完成') {
      const THREE_DAYS_IN_MS = 3 * 24 * 60 * 60 * 1000;
      const now = new Date(); // 獲取當前時間物件
      acc[category] = todos
        .filter(todo => {
        // 將字串格式轉換為毫秒時間戳
        const todoTime = new Date(todo.timestamp).getTime();
        const isWithinThreeDays = (now.getTime() - todoTime) <= THREE_DAYS_IN_MS;
        
        return todo.isCompleted && isWithinThreeDays;
    })
        .sort((a, b) => b.timestamp - a.timestamp);
    } else {
      acc[category] = todos
        .filter(todo => todo.category === category && !todo.isCompleted)
        .sort((a, b) => b.timestamp - a.timestamp);
    }
    return acc;
  }, {});

  return (
    <div className='container mx-auto'>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {/* 標題：使用 Tailwind 設定顏色與字體 */}
        <h2 className="mt-12 mb-6 text-2xl font-bold text-blue-600 flex items-center gap-2 justify-center">
          <span className="text-3xl ">📑</span> 待辦事項清單
        </h2>

        {/* 佈局核心：
        - grid: 使用網格佈局
        - grid-cols-1: 手機版預設 1 欄
        - lg:grid-cols-12: 桌機版切分為 12 欄
        - gap-6: 卡片之間的間距
      */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {categories.map(category => (
            <div
              key={category}
              className={`
              col-span-1 
              lg:col-span-6 
              ${category === '完成' ? 'lg:col-span-12 mt-4' : ''}
            `}
            >
              {/* 上面的邏輯解釋：
              1. 預設寬度 (lg:col-span-6) 會讓「工作」與「生活」在桌機版並排顯示。
              2. 判斷如果是「完成」類別，則佔滿全寬 (lg:col-span-12)，這樣版面會比較平衡。
              3. 如果你希望三個都一樣大並排，請將上面的 ${category === '完成' ? ... } 移除，只留 lg:col-span-6。
            */}
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
    </div>

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