"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "ar";
  const isRtl = lang === 'ar';

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) alert(error.message);
    else router.push(`/${lang}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-3xl font-bold mb-2 text-center">تسجيل الدخول</h2>
        <p className="text-slate-400 text-center mb-8 text-sm">مرحباً بك مجدداً في Expora the trade hunter</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute top-3.5 left-3 w-5 h-5 text-slate-500" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white pl-10 focus:border-blue-500 outline-none" placeholder="name@example.com" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute top-3.5 left-3 w-5 h-5 text-slate-500" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white pl-10 focus:border-blue-500 outline-none" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2">
            {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}