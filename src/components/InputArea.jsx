// src/components/InputArea.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const InputArea = ({ categories, addTodo }) => {
  const [inputText, setInputText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setValidated(true);

    if (inputText.trim() === '' || selectedCategory === '') {
      return; 
    }

    addTodo(inputText.trim(), selectedCategory);

    // 清空表單
    setInputText('');
    setSelectedCategory('');
    setValidated(false); 
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title text-center text-secondary">新增待辦事項</h5>
        
        <form onSubmit={handleSubmit} className={validated ? 'was-validated' : ''} noValidate>
          <div className="row g-3">
            
            {/* 1. 輸入框 */}
            <div className="col-12 col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="請輸入待辦事項內容"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                required
              />
              <div className="invalid-feedback">待辦事項內容不可為空。</div>
            </div>

            {/* 2. 類別選擇 (Select) */}
            <div className="col-8 col-md-3">
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
              >
                <option value="" disabled>請選擇類別</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <div className="invalid-feedback">請務必選擇對應的類別。</div>
            </div>

            {/* 3. 送出按鈕 (Button) */}
            <div className="col-4 col-md-3">
              <button type="submit" className="btn btn-primary w-100">
                送出
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

InputArea.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  addTodo: PropTypes.func.isRequired,
};

export default InputArea;