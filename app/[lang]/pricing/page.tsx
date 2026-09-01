"use client";

import { useRouter, useParams } from "next/navigation";
import { Check, ArrowLeft } from "lucide-react";

export default function PricingPage() {
  const router = useRouter();
  const params = useParams();
  const currentLangCode = (params?.lang as string) || "ar";
  const isRtl = currentLangCode === 'ar';

  const handleSubscribe = (planId: string) => {
    alert(isRtl ? "سيتم توجيهك قريباً إلى بوابة الدفع عبر Stripe." : "Stripe checkout will be integrated soon.");
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-white ${isRtl ? 'dir-rtl' : 'dir-ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 py-16">
        
        <button onClick={() => router.push(`/${currentLangCode}/dashboard`)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-12 transition-colors">
          <ArrowLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} /> {isRtl ? 'العودة لوحة التحكم' : 'Back to Dashboard'}
        </button>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-6">{isRtl ? 'باقات الاشتراك لنمو مبيعاتك' : 'Subscription Plans for Growth'}</h1>
          <p className="text-lg text-slate-400">
            {isRtl ? 'اختر الباقة المناسبة لمصنعك وانطلق في الأسواق العالمية بقوة الذكاء الاصطناعي.' : 'Choose the right plan to scale globally with AI.'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col">
            <h3 className="text-xl font-bold text-slate-300 mb-2">Starter</h3>
            <div className="text-4xl font-bold text-white mb-6">$0 <span className="text-lg text-slate-500 font-normal">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-300">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500"/> 50 leads / month</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500"/> Email drafts</li>
            </ul>
            <button onClick={() => router.push(`/${currentLangCode}/dashboard`)} className="w-full py-4 rounded-xl font-bold bg-slate-800 hover:bg-slate-700">Get Started</button>
          </div>

          {/* Pro */}
          <div className="bg-blue-900/20 border-2 border-blue-500 rounded-3xl p-8 flex flex-col relative transform md:-translate-y-4 shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase">Popular</div>
            <h3 className="text-xl font-bold text-blue-400 mb-2">Pro Sales</h3>
            <div className="text-4xl font-bold text-white mb-6">$79 <span className="text-lg text-slate-400 font-normal">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-1 text-sm text-white">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400"/> 500 leads / month</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400"/> Direct Email Sending</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400"/> WhatsApp Integration</li>
            </ul>
            <button onClick={() => handleSubscribe('pro')} className="w-full py-4 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 shadow-lg">Subscribe Pro</button>
          </div>

          {/* Enterprise */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col">
            <h3 className="text-xl font-bold text-purple-400 mb-2">Omnichannel</h3>
            <div className="text-4xl font-bold text-white mb-6">$299 <span className="text-lg text-slate-500 font-normal">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-300">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400"/> Unlimited Hunting</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400"/> Advanced Map Search</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400"/> Full Automation</li>
            </ul>
            <button onClick={() => handleSubscribe('enterprise')} className="w-full py-4 rounded-xl font-bold bg-slate-800 hover:bg-slate-700">Subscribe Enterprise</button>
          </div>
        </div>

      </div>
    </div>
  );
}