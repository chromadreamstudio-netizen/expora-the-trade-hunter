import { Mail, Phone, MapPin, Globe } from "lucide-react";

export default function Footer({ isRtl = false }: { isRtl?: boolean }) {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm">E</div>
              <span className="text-2xl font-bold text-white">Expora</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              {isRtl 
                ? "منصتك الذكية لأتمتة التصدير واكتشاف الأسواق العالمية. نستخدم أحدث تقنيات الذكاء الاصطناعي لربط الموردين بكبار المشترين حول العالم."
                : "Your intelligent platform for export automation and global market discovery. We use cutting-edge AI to connect suppliers with top global buyers."}
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-6">{isRtl ? "المنصة" : "Platform"}</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">{isRtl ? "كيف نعمل" : "How it Works"}</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">{isRtl ? "الباقات والأسعار" : "Pricing"}</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">{isRtl ? "قصص النجاح" : "Success Stories"}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6">{isRtl ? "تواصل معنا" : "Contact"}</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-blue-500" /> support@expora.com</li>
              <li className="flex items-center gap-3"><Globe className="w-4 h-4 text-blue-500" /> www.expora.com</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Expora Technologies. {isRtl ? "جميع الحقوق محفوظة." : "All rights reserved."}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">{isRtl ? "شروط الاستخدام" : "Terms of Service"}</a>
            <a href="#" className="hover:text-white transition-colors">{isRtl ? "سياسة الخصوصية" : "Privacy Policy"}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}