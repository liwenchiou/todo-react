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
    <div className="flex justify-center ">
      <div className="container">
        <h5 className="text-3xl text-center text-secondary mb-8">新增待辦事項</h5>

        <form onSubmit={handleSubmit} className={validated ? 'was-validated' : ''} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end p-4 bg-white rounded-xl shadow-sm border border-gray-100">

            {/* 1. 輸入框 - 桌機佔 5/12 */}
            <div className="lg:col-span-5 space-y-1.5">
              <label htmlFor="todoInput" className="block text-sm font-semibold text-gray-600 ml-1">
                待辦事項
              </label>
              <input
                id="todoInput"
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                placeholder="要做點什麼？"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                required
              />
            </div>

            {/* 2. 類別選擇 - 桌機佔 5/12 */}
            <div className="lg:col-span-5 space-y-1.5">
              <label className="block text-sm font-semibold text-gray-600 ml-1">
                分類
              </label>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                {availableCategories.map((category) => (
                  <label
                    key={category}
                    className={`flex-1 cursor-pointer text-center py-2 px-2 rounded-md text-sm font-medium transition-all duration-200
            ${selectedCategory === category
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'}
          `}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      name="category"
                      value={category}
                      checked={selectedCategory === category}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      required
                    />
                    {category === '工作' ? '💼 工作' : category === '生活' ? '🏡 生活' : category}
                  </label>
                ))}
              </div>
            </div>

            {/* 3. 送出按鈕 - 桌機佔 2/12 */}
            <div className="lg:col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-2.5 rounded-lg shadow-md transition-all whitespace-nowrap"
              >
                新增
              </button>
            </div>

            {/* 錯誤訊息 (跨滿全行顯示) */}
            {validated && selectedCategory === '' && (
              <div className="lg:col-span-12 text-red-500 text-xs mt-[-10px] ml-1">
                * 請務必選擇一個類別
              </div>
            )}
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