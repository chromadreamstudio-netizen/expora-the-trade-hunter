"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { Globe, Target, Zap, ChevronDown, ArrowRight, ShieldCheck, Users, MessageCircle, Briefcase } from "lucide-react";

export default function LandingPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentLangCode = (params?.lang as string) || "ar";
  const isRtl = currentLangCode === 'ar';

  const [langOpen, setLangOpen] = useState(false);

  const languages = [
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  ];

  const currentLangName = languages.find(l => l.code === currentLangCode)?.name || "العربية";

  const switchLanguage = (newLangCode: string) => {
    setLangOpen(false);
    if (currentLangCode === newLangCode) return;
    const newPath = pathname.replace(`/${currentLangCode}`, `/${newLangCode}`);
    router.push(newPath);
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#020617] text-white font-sans selection:bg-blue-500/30" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Header */}
      <header className="flex h-20 items-center justify-between px-6 md:px-12 border-b border-slate-800/60 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center font-bold">E</div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Expora<span className="text-blue-500">.ai</span>
          </h1>
        </div>
        
        <nav className="hidden md:flex gap-8 items-center">
          <Link href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            {isRtl ? 'كيف نعمل؟' : 'How it works?'}
          </Link>
          <Link href={`/${currentLangCode}/pricing`} className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1">
            <Zap className="w-4 h-4 text-yellow-500"/>
            {isRtl ? 'الأسعار والباقات' : 'Pricing'}
          </Link>
          
          <div className="relative">
            <button 
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800"
            >
              <Globe className="w-4 h-4 text-blue-400" />
              {currentLangName}
              <ChevronDown className="w-4 h-4" />
            </button>
            {langOpen && (
              <div className="absolute top-full mt-2 w-36 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col py-1 z-50">
                {languages.map((lang) => (
                  <button 
                    key={lang.code}
                    onClick={() => switchLanguage(lang.code)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-blue-600/10 hover:text-blue-400 transition-colors"
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link href={`/${currentLangCode}/login`} className="text-sm font-bold bg-white text-slate-900 hover:bg-slate-200 px-6 py-2.5 rounded-full transition-all shadow-lg">
            {isRtl ? 'تسجيل الدخول' : 'Login'}
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 md:px-12 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-bold text-blue-300 mb-8 backdrop-blur-sm relative z-10">
          <Briefcase className="w-4 h-4 mr-2 ml-2 text-yellow-400" /> 
          {isRtl ? 'منصة Expora للمبيعات الذكية العابرة للحدود' : 'Expora Global AI Sales Platform'}
        </div>
        
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 max-w-5xl leading-[1.2] relative z-10">
          {isRtl ? 'توقف عن البحث عن تجار وعملاء لمنتجاتك.' : 'Stop Chasing B2B Buyers.'} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
            {isRtl ? 'دع الذكاء الاصطناعي يغلق الصفقات نيابة عنك.' : 'Let AI Close Deals For You.'}
          </span>
        </h2>
        
        <p className="text-xl text-slate-300 mb-12 max-w-3xl leading-relaxed relative z-10">
          {isRtl ? 'فقط أدخل رابط منتجاتك، وسيقوم فريق مبيعاتنا الافتراضي بمسح خرائط العالم لاستخراج المشترين الحقيقيين، ومراسلتهم عبر الإيميل والواتساب بلغتهم الأم، لجلب طلبات الشراء مباشرة إلى مكتبك.' : 'Enter your product link, and our AI sales team will scan global maps for real buyers, pitch them via Email & WhatsApp in their native language, and deliver RFQs to your desk.'}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 relative z-10">
          <Link href={`/${currentLangCode}/dashboard`} className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-[0_0_30px_-5px_rgba(37,99,235,0.5)] transition-all flex items-center justify-center gap-2">
            {isRtl ? 'ابدأ في جلب العملاء الآن' : 'Start Hunting Clients Now'}
            <ArrowRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
          </Link>
          <Link href={`/${currentLangCode}/pricing`} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all">
            {isRtl ? 'عرض باقات الاشتراك' : 'View Pricing Plans'}
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 md:px-12 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">
              {isRtl ? 'كيف نجلب لك عروض الأسعار؟' : 'How Do We Get You RFQs?'}
            </h3>
            <p className="text-slate-400 max-w-2xl mx-auto">
              {isRtl ? 'أنت تدير مصنعك، ونحن ندير قسم المبيعات الدولية بالكامل من أجلك خطوة بخطوة.' : 'You run your factory, we run your entire global sales department step-by-step.'}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
              <div className="mb-6 p-3 bg-blue-950 rounded-xl inline-block border border-blue-900/50"><Target className="w-6 h-6 text-blue-400" /></div>
              <h4 className="text-xl font-bold mb-3">{isRtl ? '1. الاستهداف الجغرافي' : '1. Geo-Targeting'}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                {isRtl ? 'نحلل منتجاتك ونبحث في خرائط جوجل وقواعد البيانات عن الموزعين الحقيقيين في السوق المستهدف.' : 'We analyze your products and search global maps for real distributors in your target market.'}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
              <div className="mb-6 p-3 bg-emerald-950 rounded-xl inline-block border border-emerald-900/50"><MessageCircle className="w-6 h-6 text-emerald-400" /></div>
              <h4 className="text-xl font-bold mb-3">{isRtl ? '2. المراسلة المزدوجة' : '2. Omnichannel Outreach'}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                {isRtl ? 'يصيغ الذكاء الاصطناعي رسائل مبيعات مخصصة عبر الإيميل والواتساب باللغة المحلية للعميل.' : 'AI drafts personalized sales pitches via Email and WhatsApp in the client\'s native language.'}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
              <div className="mb-6 p-3 bg-purple-950 rounded-xl inline-block border border-purple-900/50"><Briefcase className="w-6 h-6 text-purple-400" /></div>
              <h4 className="text-xl font-bold mb-3">{isRtl ? '3. استقبال الطلبات' : '3. Receive RFQs'}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                {isRtl ? 'تستلم ردود العملاء وطلبات عروض الأسعار مباشرة لتغلق الصفقات وتحقق الأرباح.' : 'Receive client replies and quotation requests directly to close deals and grow revenue.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-[#020617] py-8 text-center text-slate-500 text-sm">
        <p>© 2026 Expora the trade hunter. All rights reserved.</p>
      </footer>
    </main>
  );
}