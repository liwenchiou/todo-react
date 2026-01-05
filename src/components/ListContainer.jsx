// src/components/ListContainer.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * 輔助元件：渲染單一待辦事項項目 (TodoItem)
 */
const TodoItem = ({ todo, category, toggleComplete, deleteTodo, editTodo }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(todo.text);

  // 當 todo.text 更新時，同步更新編輯文字狀態
  React.useEffect(() => {
    setEditText(todo.text);
  }, [todo.text]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (editText.trim()) {
      editTodo(todo.id, editText);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(todo.text);
    }
  };

  const handleBlur = (e) => {
    const relatedTarget = e.relatedTarget;
    // 如果焦點移動到「儲存」按鈕上，不觸發自動儲存以免衝突
    if (relatedTarget && relatedTarget.closest('.save-btn')) {
      return;
    }
    handleSave();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`確定要刪除待辦事項：「${todo.text}」嗎？`)) {
      deleteTodo(todo.id);
    }
  };

  const isCompletedList = category === '完成';

  return (
    <li
      ref={setNodeRef}
      style={style}
      onClick={() => !isEditing && toggleComplete(todo.id)}
      className={`
        relative flex items-center justify-between p-4 border-b border-gray-100 last:border-0 transition-all
        ${todo.isCompleted ? 'bg-gray-50 text-gray-400' : 'bg-white hover:bg-blue-50/40 text-gray-700'}
        ${isDragging ? 'z-50 shadow-xl ring-2 ring-blue-500 bg-white rounded-lg opacity-90 scale-[1.02]' : 'opacity-100'}
      `}
      {...attributes}
    >
      <div className="flex items-center flex-grow min-w-0">
        {/* 1. 拖動手柄 */}
        <div
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="p-2 mr-1 text-gray-300 hover:text-blue-500 cursor-grab active:cursor-grabbing"
        >
          <span className="text-xl select-none">⋮⋮</span>
        </div>

        {/* 2. Checkbox 區域 */}
        <div className="flex items-center mr-3" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={todo.isCompleted}
            onChange={() => toggleComplete(todo.id)}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-all"
          />
        </div>

        {/* 3. 文字內容 / 編輯輸入框 */}
        <div className="flex-grow min-w-0 pr-2">
          {isEditing ? (
            <input
              type="text"
              className="w-full px-2 py-1 text-sm border-2 border-blue-500 rounded outline-none shadow-sm focus:bg-white"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-2 overflow-hidden">
              <span className={`truncate text-base ${todo.isCompleted ? 'line-through opacity-60' : 'font-medium'}`}>
                {todo.text}
              </span>

              {/* 完成清單中的類別標籤 */}
              {isCompletedList && todo.category && todo.category !== '完成' && (
                <span className={`
                  shrink-0 px-2 py-0.5 rounded text-[10px] font-bold
                  ${todo.category === '工作' ? 'bg-blue-100 text-blue-600' :
                    todo.category === '生活' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}
                `}>
                  {todo.category === '工作' ? '💼 工作' : todo.category === '生活' ? '🏡 生活' : todo.category}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. 操作按鈕區域 */}
      {!isCompletedList && (
        <div className="flex gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="save-btn p-2 bg-green-500 hover:bg-green-600 text-white rounded-md shadow-sm transition-colors"
            >
              💾
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
              disabled={todo.isCompleted}
              className={`p-2 rounded-md transition-all ${todo.isCompleted
                ? 'opacity-0 pointer-events-none'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'
                }`}
            >
              ✏️
            </button>
          )}
          <button
            onClick={handleDelete}
            className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-all"
          >
            🗑️
          </button>
        </div>
      )}
    </li>
  );
};

/**
 * 主要元件：列表容器 (ListContainer)
 */
const ListContainer = ({ category, todos, toggleComplete, deleteTodo, editTodo }) => {
  const { setNodeRef, isOver } = useDroppable({ id: category });

  // 根據類別動態決定 Header 顏色
  const headerStyles = {
    '工作': 'bg-blue-600',
    '生活': 'bg-emerald-600',
    '完成': 'bg-slate-700'
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* 列表頭部 */}
      <div className={`py-4 px-6 text-center font-bold text-white shadow-sm ${headerStyles[category] || 'bg-gray-600'}`}>
        <div className="flex items-center justify-center gap-2">
          <span>{category === '工作' ? '💼 工作清單' : category === '生活' ? '🏡 生活清單' : '🎉 完成清單'}</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-normal">
            {todos.length}
          </span>
        </div>
      </div>

      {/* 列表內容區域 */}
      <div className="flex-grow overflow-y-auto bg-gray-50/30">
        <ul
          ref={setNodeRef}
          className={`
            min-h-[180px] transition-all duration-300
            ${isOver ? 'bg-blue-50 ring-2 ring-inset ring-blue-200' : 'bg-transparent'}
          `}
        >
          {todos.length === 0 ? (
            <li className="flex flex-col items-center justify-center py-12 px-6 text-center text-gray-400">
              <div className="text-3xl mb-2 opacity-30">📭</div>
              <p className="text-xs">
                目前沒有項目<br />
                可將事項拖曳至此分類
              </p>
            </li>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                category={category}
                toggleComplete={toggleComplete}
                deleteTodo={deleteTodo}
                editTodo={editTodo}
              />
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

ListContainer.propTypes = {
  category: PropTypes.string.isRequired,
  todos: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleComplete: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  editTodo: PropTypes.func.isRequired,
};

export default ListContainer;