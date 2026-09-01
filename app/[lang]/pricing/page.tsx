"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Check, Zap, Crown, Building2, ArrowRight, ArrowLeft } from "lucide-react";

export default function PricingPage() {
  const router = useRouter();
  const params = useParams();
  const currentLangCode = (params?.lang as string) || "ar";
  const isRtl = currentLangCode === 'ar';
  
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: isRtl ? "الباقة الأساسية" : "Starter",
      description: isRtl ? "مثالية للتجربة واكتشاف الأسواق الجديدة" : "Perfect for testing and discovering new markets",
      price: isAnnual ? "0" : "0",
      icon: <Zap className="w-6 h-6 text-blue-400" />,
      features: [
        isRtl ? "اكتشاف 5 عملاء في كل بحث" : "Discover 5 leads per hunt",
        isRtl ? "البحث عبر خرائط جوجل" : "Google Maps scraping",
        isRtl ? "مسودات إيميل وواتساب" : "Email & WhatsApp drafts",
        isRtl ? "تحديد السوق يدوياً" : "Manual market selection",
      ],
      buttonText: isRtl ? "ابدأ مجاناً" : "Start for Free",
      popular: false,
    },
    {
      name: isRtl ? "باقة المحترفين" : "Pro Hunter",
      description: isRtl ? "للموردين الجادين في مضاعفة التصدير" : "For serious suppliers scaling their exports",
      price: isAnnual ? "49" : "59",
      icon: <Crown className="w-6 h-6 text-emerald-400" />,
      features: [
        isRtl ? "اكتشاف 100 عميل يومياً" : "Discover 100 leads daily",
        isRtl ? "الاستنتاج الذكي للسوق (AI)" : "AI Auto-market detection",
        isRtl ? "الإرسال الآلي للإيميلات (Resend)" : "Automated email outreach",
        isRtl ? "استقبال طلبات الأسعار (RFQ) مباشرة" : "Direct RFQ reception",
        isRtl ? "دعم اللغات المحلية للعملاء" : "Native language outreach",
      ],
      buttonText: isRtl ? "اشترك الآن" : "Subscribe Now",
      popular: true,
    },
    {
      name: isRtl ? "باقة الشركات" : "Enterprise",
      description: isRtl ? "أتمتة شاملة لفرق المبيعات الدولية" : "Full automation for international sales teams",
      price: isAnnual ? "149" : "199",
      icon: <Building2 className="w-6 h-6 text-purple-400" />,
      features: [
        isRtl ? "صيد غير محدود للعملاء" : "Unlimited lead hunting",
        isRtl ? "بحث عميق (LinkedIn & B2B Directories)" : "Deep search (LinkedIn & Directories)",
        isRtl ? "جدولة الإرسال الذكية (Drip Campaigns)" : "Smart Drip Campaigns",
        isRtl ? "لوحة تحكم CRM متكاملة" : "Full CRM dashboard",
        isRtl ? "مدير حساب مخصص" : "Dedicated account manager",
      ],
      buttonText: isRtl ? "تواصل معنا" : "Contact Sales",
      popular: false,
    }
  ];

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-200 font-sans py-20 ${isRtl ? 'dir-rtl' : 'dir-ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <button 
            onClick={() => router.push(`/${currentLangCode}/dashboard`)}
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {isRtl ? "العودة إلى لوحة التحكم" : "Back to Dashboard"}
          </button>
          <h1 className="text-4xl font-extrabold text-white mb-6">
            {isRtl ? "اختر الباقة المناسبة لحجم طموحك" : "Choose the right plan for your ambition"}
          </h1>
          <p className="text-xl text-slate-400">
            {isRtl 
              ? "منصة Expora تحول الموردين المحليين إلى عمالقة تصدير دوليين. ابدأ مجاناً وقم بالترقية عندما تكون مستعداً لاكتساح الأسواق." 
              : "Expora turns local suppliers into international export giants. Start free, upgrade when you're ready."}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-slate-900 p-1 rounded-xl flex items-center border border-slate-800">
            <button 
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${!isAnnual ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              {isRtl ? "شهري" : "Monthly"}
            </button>
            <button 
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${isAnnual ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              {isRtl ? "سنوي" : "Annually"}
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full">
                {isRtl ? "وفر 20%" : "Save 20%"}
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <div key={idx} className={`relative bg-slate-900 rounded-3xl p-8 border ${plan.popular ? 'border-blue-500 shadow-2xl shadow-blue-900/20 transform md:-translate-y-4' : 'border-slate-800'}`}>
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                    {isRtl ? "الأكثر طلباً" : "Most Popular"}
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-slate-800 rounded-xl">{plan.icon}</div>
                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
              </div>
              
              <p className="text-slate-400 text-sm mb-6 min-h-[40px]">{plan.description}</p>
              
              <div className="mb-8 flex items-end gap-2">
                <span className="text-5xl font-extrabold text-white">${plan.price}</span>
                <span className="text-slate-500 mb-2">{isRtl ? "/ شهر" : "/ month"}</span>
              </div>
              
              <button className={`w-full py-4 rounded-xl font-bold mb-8 transition-colors ${plan.popular ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}>
                {plan.buttonText}
              </button>
              
              <div className="space-y-4">
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-blue-400' : 'text-slate-500'}`} />
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}