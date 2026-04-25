import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { exchangeService } from '../services/exchange.service';
import {
  Globe, Calculator, ShieldCheck, ArrowRight, Target,
  Info, Lock, TrendingUp, Award, Activity, CreditCard,
  Zap, Loader2, CheckCircle, Leaf, Trophy,
} from 'lucide-react';

const MK = {
  page: { background:'#060B14', color:'#fff', minHeight:'100vh',
    fontFamily:"'Outfit','Inter',sans-serif" },
  card: { background:'rgba(12,18,30,.88)', borderRadius:18, padding:'28px 24px',
    border:'1px solid rgba(0,255,135,.1)', backdropFilter:'blur(12px)',
    transition:'all .28s ease', position:'relative', overflow:'hidden' },
  badge: { display:'inline-flex', alignItems:'center', gap:7, padding:'4px 14px',
    border:'1px solid rgba(0,255,135,.25)', borderRadius:999, fontSize:11,
    fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase',
    color:'#00FF87', background:'rgba(0,255,135,.08)', marginBottom:16 },
  input: { width:'100%', background:'rgba(0,255,135,.04)',
    border:'1px solid rgba(255,255,255,.12)', borderRadius:12,
    padding:'12px 16px', color:'#fff', fontSize:15, outline:'none',
    fontFamily:"'Outfit',sans-serif", transition:'border-color .2s',
    boxSizing:'border-box' },
};

const LEADERBOARD = [
  { rank:1, name:'EcoTech Solutions', offset:'45,200 kg', badge:'ELITE',    color:'#FFD700' },
  { rank:2, name:'BlueOcean Inc.',    offset:'32,150 kg', badge:'PLATINUM', color:'#E5E4E2' },
  { rank:3, name:'GreenBuild Yapı',   offset:'28,900 kg', badge:'GOLD',     color:'#CD7F32' },
  { rank:4, name:'CyberGlobal',       offset:'15,000 kg', badge:'SILVER',   color:'#94a3b8' },
];

const Marketplace = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [offsetAmount, setOffsetAmount] = useState(100);
  const [poolAmount, setPoolAmount]     = useState(0);
  const [loading, setLoading]           = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [msg, setMsg]                   = useState({ type:'', text:'' });

  const pricePerKg  = 15;
  const lang        = (i18n.resolvedLanguage || 'tr').split('-')[0];
  const dateLocale  = lang === 'tr' ? 'tr-TR' : 'en-US';
  const certDate    = new Date();

  useEffect(() => {
    setTimeout(() => { setPoolAmount(14250); setLoading(false); }, 800);
  }, []);

  const cost      = (offsetAmount * pricePerKg).toFixed(2);
  const ecoUnits  = Math.floor(offsetAmount / 21.77);

  const handlePurchase = async () => {
    if (!isAuthenticated) { navigate('/auth?tab=login'); return; }
    if (user?.role !== 'ROLE_CORPORATE') {
      setMsg({ type:'error', text: lang === 'tr'
        ? 'Sadece kurumsal hesaplar karbon kredisi satın alabilir.'
        : 'Only corporate accounts can purchase carbon credits.' });
      return;
    }
    if (offsetAmount > poolAmount) {
      setMsg({ type:'error', text: lang === 'tr' ? 'Havuz rezervi yetersiz.' : 'Insufficient pool reserves.' });
      return;
    }
    setIsPurchasing(true); setMsg({ type:'', text:'' });
    try {
      await exchangeService.buyCarbon(offsetAmount);
      setMsg({ type:'success', text: lang === 'tr'
        ? 'Karbon dengeleme işlemi başarıyla tamamlandı!'
        : 'Carbon offset completed successfully!' });
      setTimeout(() => { setPoolAmount(14250); setLoading(false); }, 800);
    } catch (err) {
      setMsg({ type:'error', text: err.message || (lang === 'tr' ? 'İşlem başarısız.' : 'Transaction failed.') });
    } finally { setIsPurchasing(false); }
  };

  return (
    <div style={MK.page}>
      <style>{`
        .mk-card:hover { border-color:rgba(0,255,135,.28)!important; box-shadow:0 12px 32px rgba(0,255,135,.09); }
        .mk-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,rgba(0,255,135,.3),transparent); }
        .mk-range { -webkit-appearance:none; appearance:none; height:4px; border-radius:2px;
          background:rgba(255,255,255,.1); outline:none; cursor:pointer; }
        .mk-range::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px;
          border-radius:50%; background:#00FF87; cursor:pointer; box-shadow:0 0 10px rgba(0,255,135,.4); }
        .mk-input:focus { border-color:rgba(0,255,135,.55)!important; }
      `}</style>

      {/* ── Hero Header ── */}
      <section style={{ paddingTop:100, paddingBottom:48, padding:'100px 1.5rem 48px',
        borderBottom:'1px solid rgba(0,255,135,.08)', position:'relative' }}>
        <div style={{ position:'absolute', top:0, right:0, width:400, height:400, borderRadius:'50%',
          background:'radial-gradient(ellipse,rgba(0,255,135,.07) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ maxWidth:1080, margin:'0 auto', display:'flex',
          flexWrap:'wrap', justifyContent:'space-between', alignItems:'flex-end', gap:24 }}>
          <div>
            <div style={MK.badge}><Leaf size={11} /> {lang==='tr'?'Karbon Pazaryeri':'Carbon Marketplace'}</div>
            <h1 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900,
              fontSize:'clamp(1.8rem,4vw,3rem)', lineHeight:1.05, marginBottom:10 }}>
              {lang==='tr'
                ? <><span style={{color:'#fff'}}>Karbon</span>{' '}<span style={{color:'#00FF87'}}>Pazaryeri</span></>
                : <><span style={{color:'#fff'}}>Carbon</span>{' '}<span style={{color:'#00FF87'}}>Marketplace</span></>
              }
            </h1>
            <p style={{ fontSize:15, color:'rgba(255,255,255,.48)', lineHeight:1.7, maxWidth:480 }}>
              {lang==='tr'
                ? 'Şirketinizin karbon ayak izini doğrulanmış geri dönüşüm kredileriyle dengeleyin.'
                : 'Offset your company\'s carbon footprint with verified recycling credits.'}
            </p>
          </div>
          <div style={{ ...MK.card, display:'flex', alignItems:'center', gap:16, flexShrink:0 }}>
            <div style={{ width:44, height:44, borderRadius:12,
              background:'rgba(0,255,135,.1)', border:'1px solid rgba(0,255,135,.25)',
              display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Globe size={20} color="#00FF87" />
            </div>
            <div>
              <p style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,.35)',
                letterSpacing:'.1em', textTransform:'uppercase', marginBottom:3 }}>
                {lang==='tr'?'Mevcut Rezerv':'Available Reserve'}
              </p>
              <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:26, fontWeight:900, color:'#00FF87', lineHeight:1 }}>
                {loading ? '…' : poolAmount.toLocaleString(dateLocale)}
                <span style={{ fontSize:13, fontWeight:500, color:'rgba(255,255,255,.45)', marginLeft:6 }}>
                  kg CO₂
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main grid ── */}
      <main style={{ maxWidth:1080, margin:'0 auto', padding:'48px 1.5rem 80px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:24 }}>

          {/* Row 1: purchase + leaderboard */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:20 }}>

            {/* Purchase card */}
            <div className="mk-card" style={{ ...MK.card, gridColumn:'1 / span 1' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
                <CreditCard size={18} color="#00FF87" />
                <h2 style={{ fontWeight:700, fontSize:16 }}>
                  {lang==='tr'?'Kredi Satın Al':'Purchase Credits'}
                </h2>
              </div>

              {msg.text && (
                <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px',
                  background: msg.type==='error'?'rgba(239,68,68,.09)':'rgba(0,255,135,.09)',
                  border:`1px solid ${msg.type==='error'?'rgba(239,68,68,.25)':'rgba(0,255,135,.25)'}`,
                  borderRadius:12, color: msg.type==='error'?'#ef4444':'#00FF87',
                  fontSize:13, marginBottom:20 }}>
                  {msg.type==='error'?<Info size={15}/>:<CheckCircle size={15}/>}
                  {msg.text}
                </div>
              )}

              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,.42)',
                  textTransform:'uppercase', letterSpacing:'.08em', display:'block', marginBottom:8 }}>
                  {lang==='tr'?'Dengelenecek Miktar (kg)':'Offset Amount (kg)'}
                </label>
                <div style={{ position:'relative' }}>
                  <input type="number" value={offsetAmount}
                    onChange={e=>setOffsetAmount(Number(e.target.value))}
                    className="mk-input" style={{ ...MK.input, fontSize:28, fontWeight:800, padding:'14px 60px 14px 16px' }} />
                  <span style={{ position:'absolute', right:16, top:'50%', transform:'translateY(-50%)',
                    fontSize:14, fontWeight:700, color:'rgba(255,255,255,.3)' }}>KG</span>
                </div>
                <input type="range" min="1" max={poolAmount||1000} value={offsetAmount}
                  onChange={e=>setOffsetAmount(Number(e.target.value))}
                  className="mk-range" style={{ width:'100%', marginTop:12 }} />
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
                {[
                  { lbl: lang==='tr'?'Toplam Maliyet':'Total Cost', val:`${cost} TRY`, color:'#fff' },
                  { lbl: lang==='tr'?'Ekolojik Etki':'Ecological Impact', val:`${ecoUnits} Arbo`, color:'#00FF87' },
                ].map(({ lbl, val, color }) => (
                  <div key={lbl} style={{ background:'rgba(0,255,135,.04)', border:'1px solid rgba(0,255,135,.1)',
                    borderRadius:12, padding:'14px 16px' }}>
                    <p style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,.35)',
                      textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>{lbl}</p>
                    <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:22, fontWeight:800, color }}>{val}</p>
                  </div>
                ))}
              </div>

              <button onClick={handlePurchase}
                disabled={isPurchasing || (isAuthenticated && user?.role === 'ROLE_USER')}
                style={{ width:'100%', padding:'14px', borderRadius:13, fontWeight:700, fontSize:15,
                  background: isPurchasing?'#00994f':'#00FF87', color:'#060B14', border:'none',
                  cursor: isPurchasing?'wait':'pointer', display:'flex', alignItems:'center',
                  justifyContent:'center', gap:10,
                  boxShadow:'0 4px 22px rgba(0,255,135,.3)', transition:'all .2s',
                  opacity: (isAuthenticated && user?.role === 'ROLE_USER') ? .5 : 1 }}>
                {isPurchasing
                  ? <><Loader2 size={17} style={{ animation:'spin 1s linear infinite' }} /> {lang==='tr'?'İşleniyor…':'Processing…'}</>
                  : <><Zap size={17} /> {lang==='tr'?'İşlemi Tamamla':'Complete Purchase'}</>
                }
              </button>

              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6,
                marginTop:12, fontSize:12, color:'rgba(255,255,255,.28)' }}>
                <Lock size={11} />
                {lang==='tr'?'256-bit SSL ile güvenli':'Secured with 256-bit SSL'}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="mk-card" style={MK.card}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:22 }}>
                <Trophy size={18} color="#00FF87" />
                <h2 style={{ fontWeight:700, fontSize:16 }}>
                  {lang==='tr'?'En İyi Koruyucular':'Top Protectors'}
                </h2>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {LEADERBOARD.map(item => (
                  <div key={item.rank} style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                    padding:'12px 14px', background:'rgba(0,255,135,.04)',
                    border:'1px solid rgba(0,255,135,.08)', borderRadius:12,
                    transition:'border-color .2s' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:18, fontWeight:900,
                        color:'rgba(255,255,255,.2)', width:20 }}>{item.rank}</span>
                      <div>
                        <p style={{ fontWeight:600, fontSize:14 }}>{item.name}</p>
                        <p style={{ fontSize:10, fontWeight:700, color:item.color,
                          letterSpacing:'.08em', textTransform:'uppercase' }}>{item.badge}</p>
                      </div>
                    </div>
                    <p style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,.55)' }}>{item.offset}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Certificate preview */}
          <div className="mk-card" style={{ ...MK.card }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
              <Award size={18} color="#00FF87" />
              <h2 style={{ fontWeight:700, fontSize:16 }}>
                {lang==='tr'?'Sertifika Önizlemesi':'Certificate Preview'}
              </h2>
            </div>

            {/* Certificate mock */}
            <div style={{ maxWidth:480, background:'#fff', borderRadius:16, padding:'36px 32px',
              color:'#0f172a', boxShadow:'0 20px 48px rgba(0,0,0,.4)', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, right:0, width:100, height:100,
                background:'#f8fafc', borderLeft:'1px solid #e2e8f0', borderBottom:'1px solid #e2e8f0',
                borderBottomLeftRadius:40, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <ShieldCheck size={48} color="#00FF8740" />
              </div>
              <div style={{ marginBottom:28 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                  <div style={{ width:28, height:28, background:'#0f172a', borderRadius:8 }} />
                  <span style={{ fontFamily:"'Orbitron',sans-serif", fontWeight:900, fontSize:16, letterSpacing:'.04em' }}>
                    CARBORA
                  </span>
                </div>
                <p style={{ fontSize:9, fontWeight:700, color:'#94a3b8', textTransform:'uppercase',
                  letterSpacing:'.15em', marginBottom:4 }}>
                  {lang==='tr'?'Resmi Doğrulama Belgesi':'Official Verification Document'}
                </p>
                <h3 style={{ fontSize:20, fontWeight:900, borderBottom:'2px solid #0f172a', paddingBottom:12 }}>
                  {lang==='tr'?'KARBON NÖTR SERTİFİKASI':'CARBON NEUTRAL CERTIFICATE'}
                </h3>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:16, marginBottom:28 }}>
                <div>
                  <p style={{ fontSize:9, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', marginBottom:3 }}>
                    {lang==='tr'?'Kuruluş Adı':'Organization'}
                  </p>
                  <p style={{ fontSize:16, fontWeight:800, borderBottom:'1px solid #e2e8f0', paddingBottom:8 }}>
                    {user?.name || '—'}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize:9, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', marginBottom:3 }}>
                    {lang==='tr'?'Doğrulanan Miktar':'Verified Amount'}
                  </p>
                  <p style={{ fontSize:28, fontWeight:900, color:'#00CC6A' }}>
                    {offsetAmount.toLocaleString(dateLocale)} kg CO₂
                  </p>
                </div>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end',
                borderTop:'1px solid #e2e8f0', paddingTop:16 }}>
                <div>
                  <p style={{ fontSize:9, fontWeight:700, color:'#94a3b8', textTransform:'uppercase' }}>
                    {lang==='tr'?'Düzenleme Tarihi':'Issue Date'}
                  </p>
                  <p style={{ fontWeight:700, fontSize:13 }}>
                    {certDate.toLocaleDateString(dateLocale)}
                  </p>
                </div>
                <p style={{ fontFamily:'monospace', fontSize:11, color:'#94a3b8' }}>#CRC-2024-V4</p>
              </div>
            </div>
            <p style={{ fontSize:12, color:'rgba(255,255,255,.28)', marginTop:16, fontStyle:'italic', textAlign:'center' }}>
              {lang==='tr'
                ? '* Bu belge bir önizlemedir. İşlem sonrası resmi sertifika düzenlenecektir.'
                : '* This is a preview. The official certificate will be issued after the transaction.'}
            </p>
          </div>
        </div>
      </main>
      <style>{`@keyframes spin{100%{transform:rotate(360deg);}}`}</style>
    </div>
  );
};

export default Marketplace;
