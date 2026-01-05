// src/App.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import InputArea from '../components/InputArea';
import ListSection from '../components/ListSection';
import { supabase } from '../utils/supabaseClient'

const CATEGORIES = ['工作', '生活', '完成'];

function TodoList({ session }) {
    const [todos, setTodos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 1. 資料載入 (從 Supabase 讀取)
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const { data, error } = await supabase
                    .from('todos')
                    .select('*')
                    .eq('user_id', session.user.id) // 匹配 ID
                    .order('timestamp', { ascending: false });

                if (error) throw error;

                if (data) {
                    setTodos(data);
                }
            } catch (error) {
                console.error('載入失敗:', error.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []); // 僅在組件掛載時執行一次

    // 3. 核心操作函數

    // 新增待辦事項
    const addTodo = async (text, category) => {
        if (!text || !category) return;
        const { data, error } = await supabase
            .from('todos')
            .insert([{ text, category, isCompleted: false, user_id: session.user.id }])
            .select()
        if (error) {
            console.error("寫入錯誤：", error.message);
            console.error("詳細資訊：", error.details);
            alert(`儲存失敗: ${error.message}`);
        } else {
            console.log("寫入成功：", data);
        }
        // const newTodo = {
        //     id: Date.now().toString(),
        //     text,
        //     category,
        //     isCompleted: false,
        //     timestamp: Date.now(),
        // };
        setTodos(prevTodos => [data[0], ...prevTodos]);
    };

    // 切換完成狀態
    const toggleComplete = async (id) => {
        // 1. 找到該筆待辦事項目前的狀態
        const todoToUpdate = todos.find(t => t.id === id);
        if (!todoToUpdate) return;

        const newStatus = !todoToUpdate.isCompleted;

        // 2. 樂觀更新 (Optimistic Update)：先更新 UI 讓使用者覺得反應很快
        setTodos(prevTodos =>
            prevTodos.map(todo =>
                todo.id === id ? { ...todo, isCompleted: newStatus } : todo
            )
        );

        // 3. 同步到 Supabase 資料庫
        const { error } = await supabase
            .from('todos')
            .update({ isCompleted: newStatus }) // 更新欄位
            .eq('id', id); // 匹配 ID

        // 4. 錯誤處理：如果資料庫更新失敗，把 UI 改回原樣並報錯
        if (error) {
            console.error('更新失敗:', error.message);
            alert('無法更新狀態，請稍後再試');

            setTodos(prevTodos =>
                prevTodos.map(todo =>
                    todo.id === id ? { ...todo, isCompleted: !newStatus } : todo
                )
            );
        }
    };

    // 1. 刪除待辦事項
    const deleteTodo = async (id) => {
        // 先記住原本的資料，以防萬一需要回滾
        const originalTodos = [...todos];

        // 樂觀更新：立即從畫面移除
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));

        const { error } = await supabase
            .from('todos')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('刪除失敗:', error.message);
            setTodos(originalTodos); // 失敗時恢復原狀
            alert('刪除失敗，請檢查網路連線');
        }
    };

    // 2. 編輯待辦事項內容
    const editTodo = async (id, newText) => {
        if (!newText.trim()) return;

        // 樂觀更新
        setTodos(prevTodos =>
            prevTodos.map(todo =>
                todo.id === id ? { ...todo, text: newText.trim() } : todo
            )
        );

        const { error } = await supabase
            .from('todos')
            .update({ text: newText.trim() })
            .eq('id', id);

        if (error) {
            console.error('編輯失敗:', error.message);
            // 這裡可以選擇重新從資料庫獲取一次資料，以確保 UI 內容正確
            alert('編輯內容儲存失敗');
        }
    };

    // 3. 拖曳改變類別 (DnD)
    const changeCategory = async (id, newCategory, shouldSetCompleted = null) => {
        const todoToUpdate = todos.find(t => t.id === id);
        if (!todoToUpdate) return;

        const finalCompletedStatus = shouldSetCompleted !== null ? shouldSetCompleted : todoToUpdate.isCompleted;
        // 使用 ISO 字串符合 PostgreSQL 格式
        const newTimestamp = new Date().toISOString();

        // 樂觀更新 UI
        setTodos(prevTodos =>
            prevTodos.map(todo =>
                todo.id === id
                    ? {
                        ...todo,
                        category: newCategory,
                        isCompleted: finalCompletedStatus,
                    }
                    : todo
            )
        );

        // 同步到 Supabase
        const { error } = await supabase
            .from('todos')
            .update({
                category: newCategory,
                isCompleted: finalCompletedStatus,
            })
            .eq('id', id);

        if (error) {
            console.error('類別更新失敗:', error.message);
            alert('更改類別失敗，正在恢復...');
            // 這裡建議重新抓取整個列表，因為 DnD 排序較為複雜，手動恢復 prev 狀態容易出錯
            fetchTodos();
        }
    };

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

        <div className="">
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

export default TodoList;