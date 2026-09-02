"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LayoutDashboard, Mail, MessageCircle, MapPin, Phone, CheckCircle, Clock, Send, Home, Briefcase, LogOut } from "lucide-react";

export default function CRMPage() {
  const router = useRouter();
  const params = useParams();
  const currentLangCode = (params?.lang as string) || "ar";
  const isRtl = currentLangCode === 'ar';

  const [user, setUser] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push(`/${currentLangCode}/login`);
        return;
      }
      setUser(session.user);

      // جلب الصفقات الخاصة بالمورد فقط
      const { data, error } = await supabase
        .from('rfq_leads')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (data) setLeads(data);
      setLoading(false);
    };

    fetchLeads();
  }, [router, currentLangCode]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(`/${currentLangCode}/login`);
  };

  const handleSendEmail = async (lead: any) => {
    setSendingId(lead.id);
    
    const subject = "Exclusive Partnership Opportunity";
    const body = `Dear Purchasing Team at ${lead.company_name},\n\nWe are currently restructuring our supply chain for your region and looking for an exclusive distribution partner. Are you open to a quick 10-minute Zoom call next week?\n\nBest regards,\nExpora Supplier`;

    try {
      const response = await fetch("http://178.105.30.59:8000/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to_email: lead.email,
          subject: subject,
          body: body,
          reply_to: user.email
        }),
      });

      if (response.ok) {
        // تحديث حالة الصفقة في قاعدة البيانات إلى "تم الإرسال"
        await supabase.from('rfq_leads').update({ status: 'contacted' }).eq('id', lead.id);
        
        // تحديث الواجهة
        setLeads(leads.map(l => l.id === lead.id ? { ...l, status: 'contacted' } : l));
        alert(isRtl ? "تم إرسال مقترح الشراكة بنجاح!" : "Partnership proposal sent successfully!");
      } else {
        alert("فشل في إرسال الإيميل. تأكد من السيرفر.");
      }
    } catch (error) {
      console.error(error);
      alert("حدث خطأ في الاتصال بالسيرفر.");
    } finally {
      setSendingId(null);
    }
  };

  const handleWhatsApp = (phone: string, companyName: string) => {
    if (!phone || phone === "N/A" || phone === "No Phone") return alert("Phone not available");
    const cleanPhone = phone.replace(/\D/g, '');
    const message = `Hello ${companyName} team, we are looking for an exclusive distribution partner in your market. Are you open to a quick 10-min introductory call next week?`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex justify-center items-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;

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
            <Home className="w-5 h-5" /> {isRtl ? 'الرئيسية' : 'Home'}
          </button>
          <button onClick={() => router.push(`/${currentLangCode}/dashboard`)} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 hover:text-white rounded-xl font-medium">
            <LayoutDashboard className="w-5 h-5" /> {isRtl ? 'الصيد الجديد' : 'New Hunt'}
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-400 rounded-xl font-medium border border-blue-500/25">
            <Briefcase className="w-5 h-5" /> {isRtl ? 'إدارة الصفقات (CRM)' : 'Deals & RFQs'}
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
            <h3 className="text-3xl font-bold text-white mb-2">{isRtl ? 'غرفة العمليات الاستراتيجية (CRM)' : 'Strategic Deal Room'}</h3>
            <p className="text-slate-400">{isRtl ? 'راجع الفرص المكتشفة، أضف لمستك، وابدأ التفاوض.' : 'Review discovered opportunities and start negotiations.'}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex gap-6">
            <div className="text-center">
              <span className="block text-2xl font-bold text-emerald-400">{leads.filter(l => l.status === 'contacted').length}</span>
              <span className="text-xs text-slate-400">{isRtl ? 'تم التواصل' : 'Contacted'}</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-blue-400">{leads.filter(l => l.status === 'pending').length}</span>
              <span className="text-xs text-slate-400">{isRtl ? 'في الانتظار' : 'Pending'}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {leads.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              {isRtl ? 'لا توجد صفقات حالياً. اذهب إلى "الصيد الجديد" للبدء.' : 'No deals yet. Go to New Hunt to start.'}
            </div>
          ) : (
            leads.map((lead) => (
              <div key={lead.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:border-slate-700 transition-colors">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h4 className="text-xl font-bold text-white">{lead.company_name}</h4>
                    {lead.status === 'contacted' ? (
                      <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-md flex items-center gap-1"><CheckCircle className="w-3 h-3"/> {isRtl ? 'تم التواصل' : 'Contacted'}</span>
                    ) : (
                      <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-md flex items-center gap-1"><Clock className="w-3 h-3"/> {isRtl ? 'في الانتظار' : 'Pending'}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {lead.location}</span>
                    <span className="flex items-center gap-1 text-emerald-400"><Mail className="w-4 h-4"/> {lead.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button 
                    onClick={() => handleWhatsApp(lead.phone, lead.company_name)}
                    className="flex-1 md:flex-none bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 px-4 py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span>{isRtl ? 'واتساب' : 'WhatsApp'}</span>
                  </button>
                  
                  <button 
                    onClick={() => handleSendEmail(lead)}
                    disabled={sendingId === lead.id || lead.email === 'No Email'}
                    className={`flex-1 md:flex-none px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
                      sendingId === lead.id ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 
                      lead.status === 'contacted' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' :
                      lead.email === 'No Email' ? 'bg-slate-800 text-slate-500 cursor-not-allowed' :
                      'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                    }`}>
                    {sendingId === lead.id ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    <span>
                      {sendingId === lead.id ? (isRtl ? 'جاري الإرسال...' : 'Sending...') : 
                       lead.status === 'contacted' ? (isRtl ? 'إعادة الإرسال' : 'Resend Email') :
                       (isRtl ? 'إرسال المقترح' : 'Send Proposal')}
                    </span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}