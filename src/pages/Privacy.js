import React from 'react';
import { useTranslation } from 'react-i18next';
import { PRIVACY_POLICY } from '../content/legalContent';
import { Shield, Lock, FileText } from 'lucide-react';

const Privacy = () => {
  const { i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || i18n.language || 'tr').split('-')[0];
  const text = PRIVACY_POLICY[lang] || PRIVACY_POLICY.tr;

  const isTr = lang === 'tr';

  return (
    <div style={{ background: '#060B14', color: '#fff', minHeight: '100vh',
      fontFamily: "'Outfit','Inter',sans-serif" }}>
      <style>{`
        .legal-card { background:rgba(12,18,30,.85); border-radius:18px;
          border:1px solid rgba(0,255,135,.1); backdrop-filter:blur(12px);
          position:relative; overflow:hidden; }
        .legal-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,rgba(0,255,135,.3),transparent); }
        .legal-text { white-space:pre-wrap; font-size:14px; line-height:1.85;
          color:rgba(255,255,255,.58); font-family:'Outfit','Inter',sans-serif; }
        .legal-text h2, .legal-text h3 { color:rgba(255,255,255,.88); margin-top:2em; margin-bottom:.5em; }
        .badge { display:inline-flex; align-items:center; gap:7px; padding:4px 14px;
          border:1px solid rgba(0,255,135,.25); border-radius:999px; font-size:11px;
          font-weight:700; letter-spacing:.12em; text-transform:uppercase;
          color:#00FF87; background:rgba(0,255,135,.08); margin-bottom:16px; }
      `}</style>

      {/* Glow bg */}
      <div style={{ position:'fixed', top:0, left:'50%', transform:'translateX(-50%)',
        width:500, height:350, borderRadius:'50%',
        background:'radial-gradient(ellipse,rgba(0,255,135,.06) 0%,transparent 70%)',
        pointerEvents:'none', zIndex:0 }} />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '120px 1.5rem 80px', position:'relative', zIndex:1 }}>

        {/* Badge + heading */}
        <div style={{ marginBottom: 40 }}>
          <div className="badge">
            <Shield size={11} />
            {isTr ? 'Gizlilik Politikası' : 'Privacy Policy'}
          </div>
          <h1 style={{ fontFamily:"'Outfit',sans-serif", fontWeight: 900,
            fontSize: 'clamp(2rem,5vw,3.2rem)', lineHeight: 1.05,
            letterSpacing: '-1px', marginBottom: 12 }}>
            {isTr ? 'Gizlilik' : 'Privacy'}{' '}
            <span style={{ color: '#00FF87' }}>
              {isTr ? 'Politikası' : 'Policy'}
            </span>
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.45)', lineHeight: 1.7, maxWidth: 560 }}>
            {isTr
              ? 'Kişisel verilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu açıklamaktadır.'
              : 'This document explains how we collect, use, and protect your personal data.'}
          </p>
        </div>

        {/* Main card */}
        <div className="legal-card" style={{ padding: '40px 36px' }}>

          {/* Card header */}
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:32,
            paddingBottom:24, borderBottom:'1px solid rgba(255,255,255,.06)' }}>
            <div style={{ width:52, height:52, borderRadius:14,
              background:'rgba(0,255,135,.08)', border:'1px solid rgba(0,255,135,.22)',
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Shield size={24} color="#00FF87" />
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:'#fff', marginBottom:4 }}>
                {isTr ? 'Veri Koruma Taahhüdümüz' : 'Our Data Protection Commitment'}
              </div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,.38)', lineHeight:1.5 }}>
                {isTr
                  ? 'Tüm kişisel verileriniz küresel gizlilik standartlarına uygun şekilde işlenmektedir.'
                  : 'All your personal data is processed in compliance with global privacy standards.'}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="legal-text">{text}</div>

          {/* Footer strip */}
          <div style={{ marginTop:40, paddingTop:24,
            borderTop:'1px solid rgba(255,255,255,.06)',
            display:'flex', flexWrap:'wrap', gap:24 }}>
            {[
              { icon: Lock,     label: isTr ? 'Şifreleme: AES-256' : 'Encryption: AES-256' },
              { icon: FileText, label: isTr ? 'Belge: Yasal Referans' : 'Document: Legal Reference' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} style={{ display:'flex', alignItems:'center', gap:8 }}>
                <Icon size={13} color="#00FF87" />
                <span style={{ fontSize:11, color:'rgba(255,255,255,.35)',
                  letterSpacing:'.08em', textTransform:'uppercase', fontWeight:600 }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
