"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LayoutDashboard, Target, Mail, Zap, MessageCircle, MapPin, Phone, LogOut } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const params = useParams();
  const currentLangCode = (params?.lang as string) || "ar";
  const isRtl = currentLangCode === 'ar';

  const [user, setUser] = useState<any>(null);
  const [targetUrl, setTargetUrl] = useState("");
  const [targetMarket, setTargetMarket] = useState("Kenya, Africa");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push(`/${currentLangCode}/login`);
      else setUser(session.user);
    };
    checkUser();
  }, [router, currentLangCode]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(`/${currentLangCode}/login`);
  };

  const handleStartHunt = async () => {
    if (!targetUrl.includes("http")) return alert("Please enter a valid URL");
    setLoading(true); 
    setResults(null);

    try {
      console.log("🚀 جاري إرسال الطلب إلى السيرفر...");
      
      const response = await fetch("/api/generate-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_description: targetUrl,
          target_market: targetMarket, 
          user_email: user?.email || "walidtaha384@gmail.com"
        }),
      });

      console.log("📥 حالة الرد من السيرفر:", response.status);
      const responseData = await response.json();
      console.log("📦 البيانات المستلمة:", responseData);

      // مطابقة هيكل JSON القادم من الباك إند بدقة
      const actualData = responseData.data || responseData;

      if (response.ok && actualData && actualData.leads) {
        if (actualData.leads.length === 0) {
          setResults({ error: "اكتمل البحث بنجاح، ولكن لم يتم العثور على عملاء لهذا الرابط في الوقت الحالي." });
        } else {
          setResults({ leads: actualData.leads });
        }
      } else if (responseData && responseData.error) {
        setResults({ error: responseData.error });
      } else if (actualData && actualData.error) {
        setResults({ error: actualData.error });
      } else {
        setResults({ error: "فشل في جلب البيانات من السيرفر. تأكد من عمل السيرفر الألماني." });
      }
    } catch (error: any) {
      console.error("❌ خطأ برمجي أثناء الاتصال:", error);
      setResults({ error: error.message || "حدث خطأ غير متوقع في الشبكة" });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = (phone: string, message: string) => {
    if (!phone || phone === "N/A") return alert("Phone not available");
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (!user) return <div className="min-h-screen bg-slate-950 flex justify-center items-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;

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
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-400 rounded-xl font-medium border border-blue-500/25">
            <LayoutDashboard className="w-5 h-5" /> {isRtl ? 'الصيد الجديد' : 'New Hunt'}
          </button>
          <button onClick={() => router.push(`/${currentLangCode}/pricing`)} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 hover:text-white rounded-xl font-medium">
            <Target className="w-5 h-5" /> {isRtl ? 'الباقات والاشتراك' : 'Pricing'}
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex justify-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg">
            <LogOut className="w-4 h-4" /> {isRtl ? 'تسجيل الخروج' : 'Logout'}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8 max-w-6xl mx-auto">
        <div className="mb-10">
          <h3 className="text-3xl font-bold text-white mb-2">{isRtl ? 'استكشاف الأسواق العالمية' : 'Global Market Hunter'}</h3>
          <p className="text-slate-400">{isRtl ? 'أدخل رابط منتجك وحدد السوق لنبحث عن العملاء ونجهز المراسلة.' : 'Enter your product URL and target market to hunt leads.'}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl mb-8">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">{isRtl ? 'رابط منتجك' : 'Product URL'}</label>
              <input type="url" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} placeholder="https://..." className="w-full rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-white focus:border-blue-500 outline-none" disabled={loading} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">{isRtl ? 'السوق المستهدف (الدولة)' : 'Target Market'}</label>
              <input type="text" value={targetMarket} onChange={(e) => setTargetMarket(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-white focus:border-blue-500 outline-none" disabled={loading} />
            </div>
          </div>
          <button onClick={handleStartHunt} disabled={loading || !targetUrl} className={`w-full rounded-xl px-6 py-4 font-bold text-white flex justify-center gap-2 ${loading ? 'bg-slate-700' : 'bg-blue-600 hover:bg-blue-500'}`}>
            <Zap className={`w-5 h-5 ${loading ? 'animate-pulse' : ''}`} /> {loading ? (isRtl ? 'جاري الاستكشاف بالذكاء الاصطناعي...' : 'Hunting...') : (isRtl ? 'بدء الصيد الشامل' : 'Start Global Hunt')}
          </button>
        </div>

        {results && results.error && (
          <div className="bg-red-950/40 border border-red-900 rounded-2xl p-6 mb-8 text-red-400 flex flex-col gap-2 shadow-lg">
            <h4 className="font-bold text-lg text-red-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              {isRtl ? 'تنبيه' : 'Notice'}
            </h4>
            <p className="text-sm">{results.error}</p>
          </div>
        )}

        {results && results.leads && (
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-emerald-400">{isRtl ? 'العملاء المكتشفون:' : 'Discovered Leads:'}</h4>
            {results.leads.map((lead: any, idx: number) => (
              <div key={idx} className="bg-slate-900 border border-slate-700 rounded-2xl p-6 flex flex-col lg:flex-row gap-6 shadow-lg">
                <div className="lg:w-1/3 space-y-3">
                  <h5 className="text-xl font-bold text-white">{lead.company_name}</h5>
                  <div className="flex items-start gap-2 text-slate-400 text-sm">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-red-400" /> <span>{lead.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Phone className="w-4 h-4 text-emerald-400" /> <span dir="ltr">{lead.phone_number}</span>
                  </div>
                  <div className="inline-block bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-full">
                    اللغة: {lead.target_language}
                  </div>
                </div>

                <div className="lg:w-2/3 flex flex-col gap-4">
                  <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-emerald-400 flex items-center gap-2"><MessageCircle className="w-4 h-4"/> مسودة WhatsApp</span>
                      <button onClick={() => handleWhatsApp(lead.phone_number, lead.drafted_whatsapp)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-lg flex items-center gap-2">
                        إرسال واتساب <MessageCircle className="w-3 h-3"/>
                      </button>
                    </div>
                    <p className="text-sm text-slate-300 whitespace-pre-wrap">{lead.drafted_whatsapp}</p>
                  </div>

                  <div className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-blue-400 flex items-center gap-2"><Mail className="w-4 h-4"/> مسودة البريد</span>
                    </div>
                    <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans">{lead.drafted_email}</pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}