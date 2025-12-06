// src/components/ListContainer.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ----------------------------------------
// 輔助元件：渲染單一待辦事項項目 (TodoItem)
// ----------------------------------------
const TodoItem = ({ todo, toggleComplete, deleteTodo, editTodo }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(todo.text);

  // 當 todo.text 更新時，同步更新 editText
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
    opacity: isDragging ? 0.5 : 1,
  };

  // 儲存編輯內容
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
  
  // 處理按下 Enter 鍵儲存
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(todo.text); // 取消編輯，恢復原值
    }
  };

  // 處理輸入框失去焦點（但不在點擊儲存按鈕時觸發）
  const handleBlur = (e) => {
    // 檢查是否點擊的是儲存按鈕
    const relatedTarget = e.relatedTarget;
    if (relatedTarget && relatedTarget.closest('button.btn-success')) {
      return; // 如果是點擊儲存按鈕，不處理 blur
    }
    handleSave();
  };

  // 處理刪除確認 (包含確認提示)
  const handleDelete = (e) => {
    e.stopPropagation(); // 阻止事件冒泡到 li，避免觸發切換狀態
    const isConfirmed = window.confirm(`確定要刪除待辦事項：「${todo.text}」嗎？`);
    if (isConfirmed) {
        deleteTodo(todo.id);
    }
  };

  // 處理編輯按鈕點擊
  const handleEditClick = (e) => {
    e.stopPropagation(); // 阻止事件冒泡
    setIsEditing(true);
  };

  // 點擊整個 Item 時切換狀態
  const handleClickItem = () => {
    // 只有在非編輯模式下才切換狀態
    if (!isEditing) {
        toggleComplete(todo.id);
    }
  };

  return (
    <li
      ref={setNodeRef}
      className={`list-group-item d-flex align-items-center justify-content-between 
        ${todo.isCompleted ? 'bg-light text-muted' : ''}
        ${isDragging ? 'bg-warning border border-primary' : ''}`}
      {...attributes}
      onClick={handleClickItem}
      style={{ 
        ...style,
        cursor: 'default',
      }}
    >
      
      <div className="d-flex align-items-center flex-grow-1">
        {/* 拖動手柄區域 */}
        <div 
          {...listeners}
          style={{ 
            cursor: 'grab',
            padding: '8px',
            marginRight: '8px',
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <span style={{ fontSize: '18px' }}>⋮⋮</span>
        </div>

        {/* 點擊 Checkbox 時，阻止事件冒泡 */}
        <input 
          className="form-check-input me-3" 
          type="checkbox" 
          checked={todo.isCompleted} 
          onChange={(e) => { 
              e.stopPropagation(); 
              toggleComplete(todo.id);
          }}
        />
        
        {/* 編輯模式切換 */}
        {isEditing ? (
          <input
            type="text"
            className="form-control form-control-sm me-2"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleBlur} 
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()} // 阻止在輸入框點擊時觸發切換狀態
            autoFocus 
          />
        ) : (
          <span 
            style={{ textDecoration: todo.isCompleted ? 'line-through' : 'none', wordBreak: 'break-all' }}
            className="me-auto"
          >
            {todo.text}
          </span>
        )}
      </div>
      
      {/* 操作按鈕 (阻止整個按鈕區域的點擊事件冒泡) */}
      <div onClick={(e) => e.stopPropagation()}> 
        {isEditing ? (
          <button 
            className="btn btn-success btn-sm me-2" 
            onClick={handleSave}
            type="button"
          >
            💾 儲存
          </button>
        ) : (
          <button 
            className="btn btn-info btn-sm me-2" 
            onClick={handleEditClick}
            disabled={todo.isCompleted} 
          >
            ✏️ 編輯
          </button>
        )}
        
        <button 
          className="btn btn-danger btn-sm" 
          onClick={handleDelete}
        >
          🗑️ 刪除
        </button>
      </div>

    </li>
  );
};

// ----------------------------------------
// 主要元件：列表容器
// ----------------------------------------

const ListContainer = ({ 
  category, 
  todos, 
  toggleComplete, 
  deleteTodo, 
  editTodo 
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: category,
  });

  return (
    <div className="card shadow h-100">
      <div className="card-header bg-dark text-white text-center">
        {category === '工作' ? '💼 工作清單' : '🏡 生活清單'} ({todos.length} 項)
      </div>
      <div className="card-body p-0">
        <ul
          ref={setNodeRef}
          className={`list-group list-group-flush ${isOver ? 'bg-light border border-primary' : ''}`}
          style={{ minHeight: '150px' }} 
        >
          {todos.length === 0 ? (
            <li className="list-group-item text-center text-muted py-4">
              此處尚無待辦事項。拖曳項目到此處可更改類別。
            </li>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
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