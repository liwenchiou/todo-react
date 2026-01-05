import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const Auth = () => {
    const [isSignUp, setIsSignUp] = useState(false); // 切換登入或註冊
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                // 註冊邏輯
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                alert('註冊成功！請檢查信箱確認驗證信（若有開啟電子郵件驗證）。');
            } else {
                // 登入邏輯
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-xl border border-gray-100">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {isSignUp ? '建立新帳號' : '歡迎回來'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {isSignUp ? '加入我們，開始管理你的待辦事項' : '請登入以存取你的清單'}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleAuth}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">電子郵件</label>
                            <input
                                type="email"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">密碼</label>
                            <input
                                type="password"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? '處理中...' : isSignUp ? '立即註冊' : '登入'}
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                    >
                        {isSignUp ? '已經有帳號了？點此登入' : '還沒有帳號？立即註冊'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;