"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LayoutDashboard, Mail, MessageCircle, MapPin, CheckCircle, Clock, Send, Home, Briefcase, LogOut, X, Edit3 } from "lucide-react";

export default function CRMPage() {
  const router = useRouter();
  const params = useParams();
  const currentLangCode = (params?.lang as string) || "ar";
  const isRtl = currentLangCode === 'ar';

  const [user, setUser] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState<number | null>(null);

  const [activeModalLead, setActiveModalLead] = useState<any | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  useEffect(() => {
    const fetchLeads = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push(`/${currentLangCode}/login`);
        return;
      }
      setUser(session.user);

      const { data } = await supabase
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

  const openReviewModal = (lead: any) => {
    setActiveModalLead(lead);
    
    // تنظيف اسم الشركة من رموز الداشبورد
    const cleanName = lead.company_name.replace(/🏢 /g, '').replace(/🎯.*\| /g, '').trim();
    
    // سحب النص الكامل القادم من السيرفر
    const fullText = lead.drafted_email || "";
    
    let finalSubject = `Exclusive Distribution Partnership - ${cleanName}`;
    let finalBody = fullText;

    // فصل العنوان عن نص الرسالة بذكاء
    if (fullText.startsWith("Subject:")) {
      const parts = fullText.split('\n\n');
      finalSubject = parts[0].replace('Subject:', '').trim(); 
      finalBody = parts.slice(1).join('\n\n').trim(); 
    }
    
    setEmailSubject(finalSubject);
    setEmailBody(finalBody);
  };

  const handleConfirmSend = async () => {
    if (!activeModalLead) return;
    setSendingId(activeModalLead.id);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to_email: activeModalLead.email,
          subject: emailSubject,
          body: emailBody,
          reply_to: user?.email || "deal@kian.business"
        }),
      });

      if (response.ok) {
        await supabase.from('rfq_leads').update({ status: 'contacted' }).eq('id', activeModalLead.id);
        setLeads(leads.map(l => l.id === activeModalLead.id ? { ...l, status: 'contacted' } : l));
        setActiveModalLead(null);
        alert(isRtl ? "تم إرسال المقترح بنجاح!" : "Proposal sent successfully!");
      } else {
        const err = await response.json();
        alert(err.error || "فشل في إرسال الإيميل. تأكد من إعدادات السيرفر.");
      }
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء محاولة الإرسال.");
    } finally {
      setSendingId(null);
    }
  };

  const handleWhatsApp = (phone: string, draftedMessage: string) => {
    if (!phone || phone === "N/A" || phone === "No Phone") {
      alert(isRtl ? "رقم الهاتف غير متوفر لهذه الشركة" : "Phone number not available");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    const message = draftedMessage || "Hello, we are selecting an exclusive distribution partner in your market. Are you open to a quick 10-min introductory call next week?";
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
            <p className="text-slate-400">{isRtl ? 'راجع الفرص المكتشفة، عدّل نص الرسالة، واعتمد الإرسال بيدك.' : 'Review opportunities, edit outreach copy, and dispatch manually.'}</p>
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
                    onClick={() => handleWhatsApp(lead.phone, lead.drafted_whatsapp)}
                    className="flex-1 md:flex-none bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 px-4 py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span>{isRtl ? 'واتساب' : 'WhatsApp'}</span>
                  </button>
                  
                  <button 
                    onClick={() => openReviewModal(lead)}
                    disabled={lead.email === 'No Email'}
                    className={`flex-1 md:flex-none px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
                      lead.status === 'contacted' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' :
                      lead.email === 'No Email' ? 'bg-slate-800 text-slate-500 cursor-not-allowed' :
                      'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                    }`}>
                    <Edit3 className="w-5 h-5" />
                    <span>{lead.status === 'contacted' ? (isRtl ? 'إعادة المراجعة والإرسال' : 'Review & Resend') : (isRtl ? 'مراجعة وإرسال المقترح' : 'Review & Send')}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {activeModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><Mail className="w-5 h-5" /></div>
                <div>
                  <h4 className="text-lg font-bold text-white">{isRtl ? 'مراجعة مقترح الشراكة الحصرية' : 'Review Exclusive Proposal'}</h4>
                  <p className="text-xs text-slate-400">{isRtl ? 'المرسل إليه:' : 'Recipient:'} {activeModalLead.email}</p>
                </div>
              </div>
              <button onClick={() => setActiveModalLead(null)} className="text-slate-400 hover:text-white p-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">{isRtl ? 'عنوان الرسالة (Subject)' : 'Subject'}</label>
                <input 
                  type="text" 
                  value={emailSubject} 
                  onChange={(e) => setEmailSubject(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" 
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">{isRtl ? 'نص الرسالة (يمكنك التعديل عليها بحرية)' : 'Email Body'}</label>
                <textarea 
                  rows={8} 
                  value={emailBody} 
                  onChange={(e) => setEmailBody(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-sm leading-relaxed focus:outline-none focus:border-blue-500 resize-none" 
                  dir="ltr"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-950/40 flex justify-end gap-3">
              <button 
                onClick={() => setActiveModalLead(null)} 
                className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white font-medium text-sm">
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              
              <button 
                onClick={handleConfirmSend}
                disabled={sendingId === activeModalLead.id}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-blue-500/20 disabled:bg-slate-700">
                {sendingId === activeModalLead.id ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{sendingId === activeModalLead.id ? (isRtl ? 'جاري الإرسال المعتمد...' : 'Sending...') : (isRtl ? 'اعتماد وإرسال الآن' : 'Confirm & Send')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}