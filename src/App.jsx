// src/App.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from './utils/supabaseClient'; // 確保路徑正確
import TodoList from './pages/TodoList';
import Auth from './components/Auth'; // 剛才建立的登入組件

function App() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. 初始化：檢查目前的登入狀態
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // 2. 監聽：當登入、登出或密碼更改時，自動更新 session 狀態
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 載入中畫面（避免切換時閃爍）
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {/* 根據 session 是否存在來決定顯示內容 */}
      {!session ? (
        <Auth />
      ) : (
        <TodoList session={session} />
      )}
    </>
  );
}

export default App;