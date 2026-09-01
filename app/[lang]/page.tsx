"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { Globe, Target, Zap, ChevronDown, ArrowRight, MessageCircle, Briefcase } from "lucide-react";
import Footer from '@/app/components/Footer';

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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30 flex flex-col justify-between" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Header */}
      <header className="w-full h-20 px-6 md:px-12 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/20">E</div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Expora<span className="text-blue-500">.ai</span>
          </h1>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            {isRtl ? 'كيف نعمل؟' : 'How it works?'}
          </Link>
          <Link href={`/${currentLangCode}/pricing`} className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-yellow-500"/>
            {isRtl ? 'الأسعار والباقات' : 'Pricing'}
          </Link>
          
          <div className="relative">
            <button 
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800"
            >
              <Globe className="w-4 h-4 text-blue-400" />
              {currentLangName}
              <ChevronDown className="w-4 h-4" />
            </button>
            {langOpen && (
              <div className="absolute top-full mt-2 w-36 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col py-1 z-50">
                {languages.map((lang) => (
                  <button 
                    key={lang.code}
                    onClick={() => switchLanguage(lang.code)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-blue-600/10 hover:text-blue-400 transition-colors"
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link href={`/${currentLangCode}/login`} className="text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20">
            {isRtl ? 'تسجيل الدخول' : 'Login'}
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 px-6 md:px-12 flex flex-col items-center text-center overflow-hidden">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs md:text-sm font-bold text-blue-300 mb-6 backdrop-blur-sm relative z-10">
            <Briefcase className="w-4 h-4 mx-2 text-yellow-400" /> 
            {isRtl ? 'منصة Expora للمبيعات الذكية العابرة للحدود' : 'Expora Global AI Sales Platform'}
          </div>
          
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6 max-w-5xl leading-[1.15] relative z-10">
            {isRtl ? 'توقف عن البحث عن تجار وعملاء لمنتجاتك.' : 'Stop Chasing B2B Buyers.'} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
              {isRtl ? 'دع الذكاء الاصطناعي يغلق الصفقات نيابة عنك.' : 'Let AI Close Deals For You.'}
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-3xl leading-relaxed relative z-10">
            {isRtl ? 'فقط أدخل رابط منتجاتك، وسيقوم فريق مبيعاتنا الافتراضي بمسح خرائط العالم لاستخراج المشترين الحقيقيين، ومراسلتهم عبر الإيميل والواتساب بلغتهم الأم، لجلب طلبات الشراء مباشرة إلى مكتبك.' : 'Enter your product link, and our AI sales team will scan global maps for real buyers, pitch them via Email & WhatsApp in their native language, and deliver RFQs to your desk.'}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full sm:w-auto">
            <Link href={`/${currentLangCode}/dashboard`} className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-base px-8 py-4 rounded-xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2">
              {isRtl ? 'ابدأ في جلب العملاء الآن' : 'Start Hunting Clients Now'}
              <ArrowRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
            <Link href={`/${currentLangCode}/pricing`} className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold text-base px-8 py-4 rounded-xl transition-all flex items-center justify-center">
              {isRtl ? 'عرض باقات الاشتراك' : 'View Pricing Plans'}
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-20 px-6 md:px-12 bg-slate-950 border-t border-slate-900/80">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">
                {isRtl ? 'كيف نجلب لك عروض الأسعار؟' : 'How Do We Get You RFQs?'}
              </h3>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
                {isRtl ? 'أنت تدير مصنعك، ونحن ندير قسم المبيعات الدولية بالكامل من أجلك خطوة بخطوة.' : 'You run your factory, we run your entire global sales department step-by-step.'}
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-3xl backdrop-blur-sm">
                <div className="mb-6 p-3 bg-blue-950/60 rounded-2xl inline-block border border-blue-900/50"><Target className="w-6 h-6 text-blue-400" /></div>
                <h4 className="text-xl font-bold mb-3 text-white">{isRtl ? '1. الاستهداف الجغرافي' : '1. Geo-Targeting'}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {isRtl ? 'نحلل منتجاتك ونبحث في خرائط جوجل وقواعد البيانات عن الموزعين الحقيقيين في السوق المستهدف.' : 'We analyze your products and search global maps for real distributors in your target market.'}
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-3xl backdrop-blur-sm">
                <div className="mb-6 p-3 bg-emerald-950/60 rounded-2xl inline-block border border-emerald-900/50"><MessageCircle className="w-6 h-6 text-emerald-400" /></div>
                <h4 className="text-xl font-bold mb-3 text-white">{isRtl ? '2. المراسلة المزدوجة' : '2. Omnichannel Outreach'}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {isRtl ? 'يصيغ الذكاء الاصطناعي رسائل مبيعات مخصصة عبر الإيميل والواتساب باللغة المحلية للعميل.' : 'AI drafts personalized sales pitches via Email and WhatsApp in the client\'s native language.'}
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-3xl backdrop-blur-sm">
                <div className="mb-6 p-3 bg-purple-950/60 rounded-2xl inline-block border border-purple-900/50"><Briefcase className="w-6 h-6 text-purple-400" /></div>
                <h4 className="text-xl font-bold mb-3 text-white">{isRtl ? '3. استقبال الطلبات' : '3. Receive RFQs'}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {isRtl ? 'تستلم ردود العملاء وطلبات عروض الأسعار مباشرة لتغلق الصفقات وتحقق الأرباح.' : 'Receive client replies and quotation requests directly to close deals and grow revenue.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer isRtl={isRtl} />
    </div>
  );
}