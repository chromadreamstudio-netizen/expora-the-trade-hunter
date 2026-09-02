"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LayoutDashboard, Zap, Search, Loader2, ArrowLeft, Target, Briefcase, Plus, X } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "ar";
  const isRtl = lang === "ar";

  const [user, setUser] = useState<any>(null);
  const [productUrl, setProductUrl] = useState("");
  const [targetMarket, setTargetMarket] = useState("");
  const [supplierPhone, setSupplierPhone] = useState("");
  const [supplierEmail, setSupplierEmail] = useState("");
  
  const [step, setStep] = useState(1); // 1 = Input, 2 = Keywords Review
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push(`/${lang}/login`);
      else {
        setUser(session.user);
        setSupplierEmail(session.user.email);
      }
    };
    checkUser();
  }, [router, lang]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productUrl) return alert(isRtl ? "أدخل رابط المنتج" : "Enter product link");
    setLoading(true);
    try {
      const res = await fetch("http://178.105.30.59:8000/api/analyze-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_url: productUrl, target_market: targetMarket || "Global" })
      });
      const data = await res.json();
      if (data.keywords) {
        setKeywords(data.keywords);
        setStep(2);
      }
    } catch (err) {
      alert("Error analyzing URL");
    }
    setLoading(false);
  };

  const handleHunt = async () => {
    if (keywords.length === 0) return alert(isRtl ? "أضف كلمة مفتاحية واحدة على الأقل" : "Add at least one keyword");
    setLoading(true);
    
    const searchQuery = `${keywords.join(" OR ")} in ${targetMarket || "Global"}`;
    
    try {
      const res = await fetch("http://178.105.30.59:8000/api/generate-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          search_query: searchQuery,
          product_description: productUrl,
          target_market: targetMarket,
          supplier_email: supplierEmail,
          supplier_phone: supplierPhone
        })
      });
      
      const data = await res.json();
      if (res.ok && data.data?.leads) {
        // حفظ الصفقات في قاعدة البيانات
        for (const lead of data.data.leads) {
          await supabase.from("rfq_leads").insert({
            user_id: user.id,
            company_name: lead.company_name,
            email: lead.company_email,
            phone: lead.phone_number,
            location: lead.location,
            website: lead.website_url,
            status: 'pending'
          });
        }
        // الانتقال التلقائي للـ CRM
        router.push(`/${lang}/crm`);
      } else {
        alert(data.error || "Hunt failed");
        setLoading(false);
      }
    } catch (err) {
      alert("Server connection error");
      setLoading(false);
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col items-center pt-20 px-4 ${isRtl ? 'dir-rtl' : 'dir-ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl w-full text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{isRtl ? 'استكشاف الأسواق العالمية' : 'Global Market Exploration'}</h2>
        <p className="text-slate-400">{isRtl ? 'سيقوم الذكاء الاصطناعي بتحليل منتجك، استنتاج الكلمات المفتاحية، وجلب العملاء لك.' : 'AI will analyze your product, extract keywords, and hunt clients.'}</p>
      </div>

      <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        {step === 1 ? (
          <form onSubmit={handleAnalyze} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">{isRtl ? 'رابط منتجك' : 'Product Link'}</label>
                <input required type="url" value={productUrl} onChange={(e)=>setProductUrl(e.target.value)} placeholder="https://your-product.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">{isRtl ? 'السوق المستهدف' : 'Target Market'}</label>
                <input type="text" value={targetMarket} onChange={(e)=>setTargetMarket(e.target.value)} placeholder={isRtl ? "مثال: السعودية, تركيا..." : "e.g., Saudi Arabia, UK"} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">{isRtl ? 'بريد استقبال الردود' : 'Reply Email'}</label>
                <input type="email" value={supplierEmail} onChange={(e)=>setSupplierEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">{isRtl ? 'رقم واتساب للتواصل' : 'WhatsApp Number'}</label>
                <input type="text" value={supplierPhone} onChange={(e)=>setSupplierPhone(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none" />
              </div>
            </div>
            
            <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 disabled:bg-slate-700">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              {loading ? (isRtl ? 'جاري تحليل الموقع...' : 'Analyzing Website...') : (isRtl ? 'تحليل المنتج واستخراج الكلمات' : 'Analyze Product & Extract Keywords')}
            </button>
          </form>
        ) : (
          <div className="space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="text-center">
              <div className="inline-flex p-3 bg-emerald-500/10 text-emerald-400 rounded-full mb-4"><Zap className="w-8 h-8" /></div>
              <h3 className="text-xl font-bold text-white mb-2">{isRtl ? 'تم تحليل موقعك بنجاح' : 'Website Analyzed Successfully'}</h3>
              <p className="text-sm text-slate-400">{isRtl ? 'استنتج الذكاء الاصطناعي هذه الكلمات المفتاحية للبحث عن المشترين. راجعها وعدلها إن شئت.' : 'AI extracted these B2B keywords. Review and edit them.'}</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl">
              <div className="flex flex-wrap gap-3 mb-6">
                {keywords.map((kw, i) => (
                  <span key={i} className="flex items-center gap-2 bg-blue-600/10 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-lg text-sm font-medium">
                    {kw}
                    <button onClick={() => setKeywords(keywords.filter((_, idx) => idx !== i))} className="hover:text-red-400"><X className="w-4 h-4" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={newKeyword} onChange={(e)=>setNewKeyword(e.target.value)} onKeyDown={(e)=>e.key === 'Enter' && addKeyword()} placeholder={isRtl ? "إضافة كلمة مفتاحية أخرى..." : "Add another keyword..."} className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:border-blue-500 outline-none" />
                <button onClick={addKeyword} className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl"><Plus className="w-4 h-4 text-white" /></button>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="px-6 py-4 rounded-xl border border-slate-800 text-slate-400 hover:text-white font-medium flex items-center gap-2">
                <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} /> {isRtl ? 'رجوع' : 'Back'}
              </button>
              <button disabled={loading} onClick={handleHunt} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 disabled:bg-slate-700">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Target className="w-5 h-5" />}
                {loading ? (isRtl ? 'جاري صيد العملاء...' : 'Hunting Clients...') : (isRtl ? 'اعتماد وبدء الصيد' : 'Confirm & Start Hunt')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}