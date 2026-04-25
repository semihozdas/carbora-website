import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Navigation, Phone, Mail, Globe, AtSign, CheckCircle, AlertCircle, Loader2, Send, Share2 } from 'lucide-react';
import { contactService } from '../services/contact.service';

const C = {
  page: { background:'#060B14', color:'#fff', minHeight:'100vh',
    fontFamily:"'Outfit','Inter',sans-serif" },
  badge: { display:'inline-flex', alignItems:'center', gap:7, padding:'4px 14px',
    border:'1px solid rgba(0,255,135,.25)', borderRadius:999, fontSize:11,
    fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase',
    color:'#00FF87', background:'rgba(0,255,135,.08)', marginBottom:16 },
  card: { background:'rgba(12,18,30,.85)', borderRadius:18, padding:'28px 24px',
    border:'1px solid rgba(0,255,135,.1)', backdropFilter:'blur(12px)',
    transition:'all .28s ease', position:'relative', overflow:'hidden' },
  input: {
    width:'100%', background:'rgba(0,255,135,.04)', border:'1px solid rgba(255,255,255,.1)',
    borderRadius:12, padding:'13px 16px', color:'#fff', fontSize:14, outline:'none',
    fontFamily:"'Outfit',sans-serif", transition:'border-color .2s',
    boxSizing:'border-box',
  },
};

const Contact = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({ name:'', surname:'', email:'', subject:'', message:'' });
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const address = 'Beştepe Mahallesi, 31. Sokak, No:2A, Kat:9, Kapı no: 59 YENİMAHALLE/ANKARA';
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    try {
      await contactService.sendContactForm(formData);
      setStatus('success');
      setFormData({ name:'', surname:'', email:'', subject:'', message:'' });
      setTimeout(() => setStatus('idle'), 4000);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err?.message || t('contact.form.errors.generic'));
    }
  };

  const infoCards = [
    {
      icon: MapPin, color: '#00FF87',
      title: t('contact.cards.headquarters'),
      content: address,
      action: { href: directionsUrl, label: t('contact.cards.getDirections'), icon: Navigation },
    },
    {
      icon: Phone, color: '#00CC6A',
      title: t('contact.cards.contact'),
      items: [
        { label: t('contact.cards.labels.gsm'),   val: '+90 (542) 453 36 06', href: 'tel:+905424533606' },
        { label: t('contact.cards.labels.gsm'),   val: '+90 (507) 264 08 85', href: 'tel:+905072640885' },
        { label: t('contact.cards.labels.email'),  val: 'info@sscongress.com', href: 'mailto:info@sscongress.com' },
      ],
    },
    {
      icon: Globe, color: '#4DFFAA',
      title: t('contact.cards.socialMedia'),
      desc: t('contact.cards.followUs'),
      links: [
        { href: 'http://bilgisim.com.tr/', icon: Globe,  label: 'Website' },
        { href: '#', icon: AtSign, label: 'Social' },
        { href: '#', icon: Share2, label: 'More' },
      ],
    },
  ];

  const section = { padding:'80px 1.5rem' };
  const inner   = { maxWidth:1080, margin:'0 auto' };

  return (
    <div style={C.page}>
      <style>{`
        .ct-card:hover { border-color:rgba(0,255,135,.28)!important; transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,255,135,.09); }
        .ct-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,rgba(0,255,135,.3),transparent); }
        .ct-input:focus { border-color:rgba(0,255,135,.55)!important; box-shadow:0 0 0 3px rgba(0,255,135,.08); }
        .ct-input::placeholder { color:rgba(255,255,255,.25); }
      `}</style>

      {/* ── Hero ── */}
      <section style={{ ...section, paddingTop: 100, textAlign:'center', position:'relative' }}>
        <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)',
          width:500, height:350, borderRadius:'50%',
          background:'radial-gradient(ellipse,rgba(0,255,135,.07) 0%,transparent 70%)',
          pointerEvents:'none' }} />
        <div style={inner}>
          <div style={{ ...C.badge, justifyContent:'center' }}>
            <Mail size={11} /> {t('contact.hero.badge') || 'İletişim'}
          </div>
          <h1 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900,
            fontSize:'clamp(2rem,5vw,3.6rem)', lineHeight:1.05,
            marginBottom:16, letterSpacing:'-1px' }}>
            {t('contact.hero.title.part1')}{' '}
            <span style={{ color:'#00FF87' }}>{t('contact.hero.title.highlight')}</span>
          </h1>
          <p style={{ fontSize:15, color:'rgba(255,255,255,.5)', lineHeight:1.7,
            maxWidth:540, margin:'0 auto 28px' }}>
            {t('contact.hero.description')}
          </p>
          <div style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap' }}>
            <Link to="/auth" style={{
              display:'inline-flex', alignItems:'center', gap:8,
              padding:'12px 26px', background:'#00FF87', color:'#060B14',
              borderRadius:12, fontWeight:700, fontSize:14, textDecoration:'none',
              boxShadow:'0 4px 20px rgba(0,255,135,.32)',
            }}>{t('contact.hero.actions.startNow')}</Link>
            <Link to="/about" style={{
              display:'inline-flex', alignItems:'center', gap:8,
              padding:'12px 26px', border:'1px solid rgba(0,255,135,.3)',
              color:'#00FF87', borderRadius:12, fontWeight:600, fontSize:14,
              textDecoration:'none', background:'rgba(0,255,135,.06)',
            }}>{t('contact.hero.actions.exploreBilgisim')}</Link>
          </div>
        </div>
      </section>

      {/* ── Info cards ── */}
      <section style={section}>
        <div style={{ ...inner, display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16 }}>
          {infoCards.map(({ icon: Icon, color, title, content, items, desc, links, action }) => (
            <div key={title} className="ct-card" style={C.card}>
              <div style={{ width:46, height:46, borderRadius:13,
                background:`${color}10`, border:`1px solid ${color}28`,
                display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
                <Icon size={20} color={color} />
              </div>
              <h3 style={{ fontWeight:700, fontSize:15, color:'#fff', marginBottom:10 }}>{title}</h3>
              {content && <p style={{ fontSize:13, color:'rgba(255,255,255,.5)', lineHeight:1.65, marginBottom:14 }}>{content}</p>}
              {action && (
                <a href={action.href} target="_blank" rel="noreferrer" style={{
                  display:'inline-flex', alignItems:'center', gap:6,
                  padding:'8px 16px', borderRadius:10,
                  border:'1px solid rgba(0,255,135,.25)', color:'#00FF87',
                  fontSize:12, fontWeight:600, textDecoration:'none', background:'rgba(0,255,135,.06)',
                }}>
                  <action.icon size={14} />{action.label}
                </a>
              )}
              {items && items.map(it => (
                <div key={it.val} style={{ marginBottom:8 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,.35)',
                    letterSpacing:'.1em', textTransform:'uppercase', marginBottom:3 }}>{it.label}</div>
                  <a href={it.href} style={{ fontSize:13, color:'rgba(255,255,255,.65)',
                    textDecoration:'none', transition:'color .2s' }}
                    onMouseOver={e=>e.target.style.color='#00FF87'}
                    onMouseOut={e=>e.target.style.color='rgba(255,255,255,.65)'}>{it.val}</a>
                </div>
              ))}
              {links && (
                <>
                  <p style={{ fontSize:13, color:'rgba(255,255,255,.45)', marginBottom:14 }}>{desc}</p>
                  <div style={{ display:'flex', gap:12 }}>
                    {links.map(l => (
                      <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
                        style={{ color:'rgba(255,255,255,.4)', transition:'color .2s, transform .2s' }}
                        onMouseOver={e=>{e.currentTarget.style.color='#00FF87';e.currentTarget.style.transform='scale(1.15)';}}
                        onMouseOut={e=>{e.currentTarget.style.color='rgba(255,255,255,.4)';e.currentTarget.style.transform='scale(1)';}}>
                        <l.icon size={19} />
                        <span style={{ position:'absolute', width:1, height:1, overflow:'hidden', clip:'rect(0,0,0,0)' }}>{l.label}</span>
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact form ── */}
      <section style={{ ...section, paddingBottom: 100 }}>
        <div style={{ ...inner, maxWidth: 720 }}>
          <div style={{ ...C.badge, marginBottom: 20 }}>
            <Send size={11} /> {t('contact.form.title') || 'Mesaj Gönder'}
          </div>
          <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800,
            fontSize:'clamp(1.5rem,3vw,2.2rem)', marginBottom:8 }}>
            {t('contact.form.subtitle') || 'Bize Ulaşın'}
          </h2>
          <p style={{ fontSize:14, color:'rgba(255,255,255,.45)', marginBottom:32, lineHeight:1.7 }}>
            {t('contact.form.description') || ''}
          </p>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              {['name','surname'].map(field => (
                <div key={field}>
                  <label style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,.45)',
                    textTransform:'uppercase', letterSpacing:'.08em', display:'block', marginBottom:6 }}>
                    {t(`contact.form.fields.${field}`) || field}
                  </label>
                  <input name={field} value={formData[field]} onChange={handleChange} required
                    className="ct-input" style={C.input}
                    placeholder={t(`contact.form.placeholders.${field}`) || ''} />
                </div>
              ))}
            </div>
            {['email','subject'].map(field => (
              <div key={field}>
                <label style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,.45)',
                  textTransform:'uppercase', letterSpacing:'.08em', display:'block', marginBottom:6 }}>
                  {t(`contact.form.fields.${field}`) || field}
                </label>
                <input name={field} value={formData[field]} onChange={handleChange}
                  type={field==='email'?'email':'text'} required
                  className="ct-input" style={C.input}
                  placeholder={t(`contact.form.placeholders.${field}`) || ''} />
              </div>
            ))}
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,.45)',
                textTransform:'uppercase', letterSpacing:'.08em', display:'block', marginBottom:6 }}>
                {t('contact.form.fields.message') || 'Mesaj'}
              </label>
              <textarea name="message" value={formData.message} onChange={handleChange} required rows={5}
                className="ct-input" style={{ ...C.input, resize:'vertical', minHeight:120 }}
                placeholder={t('contact.form.placeholders.message') || ''} />
            </div>

            {/* Feedback */}
            {status === 'success' && (
              <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px',
                background:'rgba(0,255,135,.08)', border:'1px solid rgba(0,255,135,.25)',
                borderRadius:12, color:'#00FF87', fontSize:14 }}>
                <CheckCircle size={16} /> {t('contact.form.success')}
              </div>
            )}
            {status === 'error' && (
              <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px',
                background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.22)',
                borderRadius:12, color:'#ef4444', fontSize:14 }}>
                <AlertCircle size={16} /> {errorMessage}
              </div>
            )}

            <button type="submit" disabled={status === 'loading'} style={{
              display:'flex', alignItems:'center', justifyContent:'center', gap:10,
              padding:'14px 32px', background: status==='loading' ? '#00994f' : '#00FF87',
              color:'#060B14', fontWeight:700, fontSize:15, borderRadius:12,
              cursor: status==='loading' ? 'not-allowed' : 'pointer', border:'none',
              boxShadow:'0 4px 22px rgba(0,255,135,.3)', transition:'all .2s',
              opacity: status==='loading' ? .7 : 1,
            }}>
              {status === 'loading'
                ? <><Loader2 size={16} style={{ animation:'spin 1s linear infinite' }} /> {t('contact.form.sending')}</>
                : <><Send size={16} /> {t('contact.form.submit')}</>
              }
            </button>
          </form>
        </div>
      </section>
      <style>{`@keyframes spin{100%{transform:rotate(360deg);}}`}</style>
    </div>
  );
};

export default Contact;
