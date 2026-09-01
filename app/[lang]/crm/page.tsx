"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LayoutDashboard, Target, Mail, MessageCircle, Clock, CheckCircle, Briefcase, Phone, Home, LogOut } from "lucide-react";

export default function CRMDashboard() {
  const router = useRouter();
  const params = useParams();
  const currentLangCode = (params?.lang as string) || "ar";
  const isRtl = currentLangCode === 'ar';

  const [user, setUser] = useState<any>(null);
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, closed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push(`/${currentLangCode}/login`);
        return;
      }
      setUser(session.user);

      // جلب البيانات الحقيقية من قاعدة بيانات Supabase
      const { data, error } = await supabase
        .from('rfq_leads')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (data) {
        setRfqs(data);
        setStats({
          total: data.length,
          pending: data.filter(d => d.status === 'pending').length,
          closed: data.filter(d => d.status === 'closed').length
        });
      }
      setLoading(false);
    };
    fetchRealData();
  }, [router, currentLangCode]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(`/${currentLangCode}/login`);
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-CA');
  };

  if (!user || loading) return <div className="min-h-screen bg-slate-950 flex justify-center items-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className={`flex h-screen bg-slate-950 text-slate-200 font-sans ${isRtl ? 'dir-rtl' : 'dir-ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <aside className="w-64 bg-slate-900 border-x border-slate-800 flex flex-col hidden md:flex shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm">E</div>
            <h1 className="text-xl font-bold text-white">Expora</h1>
          </div>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
          <button onClick={() => router.push(`/${currentLangCode}`)} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 hover:text-white rounded-xl font-medium">
            <Home className="w-5 h-5" /> {isRtl ? 'الصفحة الرئيسية' : 'Home'}
          </button>
          <button onClick={() => router.push(`/${currentLangCode}/dashboard`)} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 hover:text-white rounded-xl font-medium">
            <Target className="w-5 h-5" /> {isRtl ? 'الصيد الجديد' : 'New Hunt'}
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-400 rounded-xl font-medium border border-blue-500/25">
            <Briefcase className="w-5 h-5" /> {isRtl ? 'إدارة الصفقات (CRM)' : 'Deals & RFQs'}
          </button>
          <button onClick={() => router.push(`/${currentLangCode}/pricing`)} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 hover:text-white rounded-xl font-medium">
            <LayoutDashboard className="w-5 h-5" /> {isRtl ? 'الباقات والاشتراك' : 'Pricing'}
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex justify-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg">
            <LogOut className="w-4 h-4" /> {isRtl ? 'تسجيل الخروج' : 'Logout'}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8 max-w-6xl mx-auto">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h3 className="text-3xl font-bold text-white mb-2">{isRtl ? 'إدارة الصفقات وعروض الأسعار' : 'RFQs & Pipeline Management'}</h3>
            <p className="text-slate-400">{isRtl ? 'بيانات حقيقية مباشرة من قاعدة البيانات للعملاء الذين تم اصطيادهم.' : 'Real live data from database for hunted leads.'}</p>
          </div>
        </div>

        {/* Real Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl"><Mail className="w-6 h-6"/></div>
              <div>
                <p className="text-sm text-slate-400">{isRtl ? 'إجمالي العملاء المستخرجين' : 'Total Extracted Leads'}</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl"><Clock className="w-6 h-6"/></div>
              <div>
                <p className="text-sm text-slate-400">{isRtl ? 'بانتظار الرد (RFQ)' : 'Pending RFQs'}</p>
                <p className="text-2xl font-bold text-white">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl"><CheckCircle className="w-6 h-6"/></div>
              <div>
                <p className="text-sm text-slate-400">{isRtl ? 'صفقات ناجحة' : 'Closed Deals'}</p>
                <p className="text-2xl font-bold text-white">{stats.closed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Real Pipeline List */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          {rfqs.length === 0 ? (
             <div className="p-10 text-center text-slate-400">
               {isRtl ? 'لم تقم باصطياد أي عميل بعد. اذهب إلى صفحة "الصيد الجديد" لتبدأ.' : 'No leads hunted yet. Go to "New Hunt" to start.'}
             </div>
          ) : (
            <table className="w-full text-left border-collapse" dir={isRtl ? 'rtl' : 'ltr'}>
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-400 text-sm">
                  <th className="p-6 font-medium">{isRtl ? 'الشركة' : 'Company'}</th>
                  <th className="p-6 font-medium">{isRtl ? 'التواصل' : 'Contact'}</th>
                  <th className="p-6 font-medium">{isRtl ? 'الحالة' : 'Status'}</th>
                  <th className="p-6 font-medium">{isRtl ? 'تاريخ الصيد' : 'Hunted On'}</th>
                </tr>
              </thead>
              <tbody>
                {rfqs.map((rfq) => (
                  <tr key={rfq.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                    <td className="p-6">
                      <p className="font-bold text-white text-lg">{rfq.company_name}</p>
                      <p className="text-xs text-slate-500">{rfq.location}</p>
                    </td>
                    <td className="p-6 space-y-1">
                      <p className="text-sm text-slate-300 flex items-center gap-2"><Mail className="w-3 h-3 text-slate-500"/> {rfq.email}</p>
                      <p className="text-sm text-slate-300 flex items-center gap-2"><Phone className="w-3 h-3 text-slate-500"/> <span dir="ltr">{rfq.phone}</span></p>
                    </td>
                    <td className="p-6">
                      {rfq.status === 'pending' && <span className="bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-xs font-bold">{isRtl ? 'تم الإرسال - بانتظار الرد' : 'Sent - Pending'}</span>}
                      {rfq.status === 'closed' && <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">{isRtl ? 'تم الإغلاق' : 'Closed Won'}</span>}
                    </td>
                    <td className="p-6 text-sm text-slate-400">{formatDate(rfq.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}