import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { publicService } from '../services/public.service';
import { Shield, Zap, Target, ArrowRight, Activity, Leaf, Recycle, Users, MapPin, Trophy } from 'lucide-react';

// ─── Shared design tokens ─────────────────────────────────────────────────────
const S = {
  page: { background: '#060B14', color: '#fff', minHeight: '100vh',
    fontFamily: "'Outfit','Inter',sans-serif" },
  badge: { display:'inline-flex', alignItems:'center', gap:7, padding:'4px 14px',
    border:'1px solid rgba(0,255,135,.25)', borderRadius:999, fontSize:11,
    fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase',
    color:'#00FF87', background:'rgba(0,255,135,.08)', marginBottom:16 },
  h2: { fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:'clamp(1.6rem,3vw,2.4rem)',
    lineHeight:1.1, marginBottom:12, color:'#fff' },
  lead: { fontSize:15, color:'rgba(255,255,255,.52)', lineHeight:1.75,
    maxWidth:620, marginBottom:8 },
  card: {
    background:'rgba(12,18,30,.85)', borderRadius:16,
    border:'1px solid rgba(0,255,135,.1)', backdropFilter:'blur(12px)',
    padding:'28px 26px', transition:'all .28s ease', position:'relative', overflow:'hidden',
  },
};

const PageWrap = ({ children }) => (
  <div style={S.page}>
    <style>{`
      .ab-card:hover { border-color:rgba(0,255,135,.28)!important; transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,255,135,.09); }
      .ab-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px;
        background:linear-gradient(90deg,transparent,rgba(0,255,135,.3),transparent); }
      .stat-num { font-family:'Outfit',sans-serif; font-size:clamp(2rem,4vw,3rem); font-weight:900;
        color:#00FF87; line-height:1; }
    `}</style>
    {children}
  </div>
);

const About = () => {
  const { t, i18n } = useTranslation();

  const [stats, setStats] = useState({ totalActiveUsers: 0, totalRecycledWeight: 0, totalActivePlatforms: 0, totalCo2Saved: 0 });

  useEffect(() => {
    let dead = false;
    const go = async () => {
      try {
        const d = await publicService.getPublicStats();
        if (!dead) setStats({
          totalActiveUsers:     Number(d?.totalActiveUsers     || 0),
          totalRecycledWeight:  Number(d?.totalRecycledWeight  || 0),
          totalActivePlatforms: Number(d?.totalActivePlatforms || 0),
          totalCo2Saved:        Number(d?.totalCo2Saved        || 0),
        });
      } catch {}
    };
    go();
    const id = setInterval(go, 30000);
    return () => { dead = true; clearInterval(id); };
  }, []);

  const lang = (i18n.resolvedLanguage || 'tr').split('-')[0];
  const fmt = n => Number.isFinite(n) ? n.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US') : '—';

  const recycledDisplay = useMemo(() => {
    const g = Number(stats.totalRecycledWeight || 0);
    if (Math.abs(g) < 1000) return `${Math.round(g)} g`;
    const kg = g / 1000;
    if (Math.abs(kg) < 1000) return `${Math.round(kg * 10) / 10} kg`;
    return `${Math.round(kg / 10) / 100} ton`;
  }, [stats.totalRecycledWeight]);

  const co2Display = useMemo(() => {
    const kg = Number(stats.totalCo2Saved || 0);
    if (Math.abs(kg) < 1000) return `${Math.round(kg * 10) / 10} kg`;
    return `${Math.round(kg / 10) / 100} ton`;
  }, [stats.totalCo2Saved]);

  const whyItems = [
    { icon: Trophy,  key: 'gamification',   color: '#00FF87' },
    { icon: Target,  key: 'realImpact',     color: '#00CC6A' },
    { icon: Users,   key: 'communityPower', color: '#4DFFAA' },
  ];

  const section = { padding: '80px 1.5rem', position: 'relative' };
  const inner   = { maxWidth: 1080, margin: '0 auto' };

  return (
    <PageWrap>

      {/* ── Hero ── */}
      <section style={{ ...section, paddingTop: 100 }}>
        {/* Neon glow bg */}
        <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)',
          width:600, height:400, borderRadius:'50%',
          background:'radial-gradient(ellipse,rgba(0,255,135,.08) 0%,transparent 70%)',
          pointerEvents:'none' }} />

        <div style={{ ...inner, textAlign:'center' }}>
          <div style={{ ...S.badge, justifyContent:'center' }}>
            <Activity size={11} />
            {t('about.badge')}
          </div>

          <h1 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900,
            fontSize:'clamp(2.2rem,5vw,4rem)', lineHeight:1.05,
            marginBottom:20, letterSpacing:'-1px' }}>
            {t('about.heroTitle')}
          </h1>

          <p style={{ ...S.lead, margin:'0 auto 16px', textAlign:'center', maxWidth:640 }}>
            <strong style={{ color:'#fff' }}>Carbora</strong>
            {t('about.heroDescription.part1')}
          </p>
          <p style={{ ...S.lead, margin:'0 auto', textAlign:'center', maxWidth:560 }}>
            <strong style={{ color:'#00FF87' }}>Carbora</strong>
            {t('about.heroDescription.part2')}
          </p>

          {/* Live stats */}
          <div style={{ display:'flex', justifyContent:'center', flexWrap:'wrap', gap:16, marginTop:48 }}>
            {[
              { val: fmt(stats.totalActiveUsers),     lbl: lang === 'tr' ? 'Aktif Kullanıcı' : 'Active Users',     icon: Users   },
              { val: fmt(stats.totalActivePlatforms), lbl: lang === 'tr' ? 'Aktif Platform' : 'Active Platforms',  icon: MapPin  },
              { val: co2Display,                      lbl: lang === 'tr' ? 'CO₂ Tasarrufu' : 'CO₂ Savings',        icon: Leaf },
            ].map(({ val, lbl, icon: Icon }) => (
              <div key={lbl} style={{ ...S.card, minWidth: 160, textAlign:'center', padding:'22px 24px' }}
                className="ab-card">
                <Icon size={18} color="#00FF87" style={{ margin:'0 auto 10px' }} />
                <div className="stat-num">{val}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.4)', textTransform:'uppercase',
                  letterSpacing:'.08em', marginTop:6 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ height:1, background:'linear-gradient(90deg,transparent,rgba(0,255,135,.2),transparent)',
        maxWidth:800, margin:'0 auto' }} />

      {/* ── Mission & Vision ── */}
      <section id="misyon-vizyon" style={section}>
        <div style={{ ...inner, display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:20 }}>

          {[
            { kicker: t('about.mission.kicker'), title: t('about.mission.title'), desc: t('about.mission.description'), icon: Target,  color: '#00FF87' },
            { kicker: t('about.vision.kicker'),  title: t('about.vision.title'),  desc: t('about.vision.description'),  icon: Zap,     color: '#4DFFAA' },
          ].map(({ kicker, title, desc, icon: Icon, color }) => (
            <div key={title} className="ab-card" style={S.card}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
                <div style={{ width:40, height:40, borderRadius:11,
                  background:`${color}10`, border:`1px solid ${color}30`,
                  display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon size={18} color={color} />
                </div>
                <span style={{ fontSize:11, fontWeight:700, color, letterSpacing:'.12em', textTransform:'uppercase' }}>
                  {kicker}
                </span>
              </div>
              <h2 style={{ ...S.h2, fontSize:'1.35rem' }}>{title}</h2>
              <p style={{ ...S.lead, fontSize:14 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why Carbora ── */}
      <section style={section}>
        <div style={inner}>
          <div style={{ marginBottom:40 }}>
            <div style={S.badge}><Shield size={11} /> {t('about.why.kicker')}</div>
            <h2 style={S.h2}>
              {t('about.why.titlePrefix')}{' '}
              <span style={{ color:'#00FF87' }}>Carbora?</span>
            </h2>
            <p style={S.lead}>{t('about.why.description')}</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16 }}>
            {whyItems.map(({ icon: Icon, key, color }) => (
              <div key={key} className="ab-card" style={S.card}>
                <div style={{ width:42, height:42, borderRadius:12, border:`1px solid ${color}30`,
                  background:`${color}0c`, display:'flex', alignItems:'center', justifyContent:'center',
                  marginBottom:14 }}>
                  <Icon size={20} color={color} />
                </div>
                <h3 style={{ fontWeight:700, fontSize:15, color, marginBottom:8,
                  textTransform:'uppercase', letterSpacing:'.04em' }}>
                  {t(`about.why.items.${key}.title`)}
                </h3>
                <p style={{ fontSize:14, color:'rgba(255,255,255,.5)', lineHeight:1.65 }}>
                  {t(`about.why.items.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Company info ── */}
      <section style={{ ...section, paddingBottom: 100 }}>
        <div style={{ ...inner, display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16 }}>
          {[
            { title: t('about.company.name'), desc: t('about.company.description'), icon: Leaf,   color: '#00FF87' },
            { title: t('about.platform.name'), desc: t('about.platform.description'), icon: Recycle, color: '#00CC6A' },
          ].map(({ title, desc, icon: Icon, color }) => (
            <div key={title} className="ab-card" style={{ ...S.card, padding:'32px 28px' }}>
              <div style={{ width:44, height:44, borderRadius:12, border:`1px solid ${color}30`,
                background:`${color}0c`, display:'flex', alignItems:'center', justifyContent:'center',
                marginBottom:16 }}>
                <Icon size={20} color={color} />
              </div>
              <h3 style={{ fontWeight:700, fontSize:16, color:'#fff', marginBottom:10 }}>{title}</h3>
              <p style={{ fontSize:14, color:'rgba(255,255,255,.5)', lineHeight:1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

    </PageWrap>
  );
};

export default About;
