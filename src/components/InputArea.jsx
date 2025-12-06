// src/components/InputArea.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const InputArea = ({ categories, addTodo }) => {
  const [inputText, setInputText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('工作');
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
    setSelectedCategory('工作');
    setValidated(false); 
  };

  // 過濾掉「完成」類別
  const availableCategories = categories.filter(item => item !== "完成");

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title text-center text-secondary">新增待辦事項</h5>
        
        <form onSubmit={handleSubmit} className={validated ? 'was-validated' : ''} noValidate>
          <div className="row g-3 align-items-end">
            
            {/* 1. 輸入框 */}
            <div className="col-12 col-md-6">
              <label htmlFor="todoInput" className="form-label">待辦事項內容</label>
              <input
                id="todoInput"
                type="text"
                className="form-control"
                placeholder="請輸入待辦事項內容"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                required
              />
              <div className="invalid-feedback">待辦事項內容不可為空。</div>
            </div>

            {/* 2. 類別選擇 (單選按鈕) */}
            <div className="col-12 col-md-4">
              <label className="form-label d-block mb-2">選擇類別</label>
              <div className="btn-group w-100" role="group" aria-label="類別選擇">
                {availableCategories.map((category) => (
                  <React.Fragment key={category}>
                    <input
                      type="radio"
                      className="btn-check"
                      name="category"
                      id={`category-${category}`}
                      value={category}
                      checked={selectedCategory === category}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      required
                    />
                    <label
                      className={`btn btn-outline-primary ${
                        selectedCategory === category ? 'active' : ''
                      }`}
                      htmlFor={`category-${category}`}
                    >
                      {category === '工作' ? '💼 工作' : category === '生活' ? '🏡 生活' : category}
                    </label>
                  </React.Fragment>
                ))}
              </div>
              {validated && selectedCategory === '' && (
                <div className="text-danger small mt-1">請務必選擇對應的類別。</div>
              )}
            </div>

            {/* 3. 送出按鈕 (Button) */}
            <div className="col-12 col-md-2">
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