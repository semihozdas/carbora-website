import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Leaf, Scan, Recycle, Coins, Trophy, Target, Users, Shield, Cpu, CheckCircle, ChevronRight, Mail, Phone, MapPin, Zap, Star, Award, Briefcase, Globe2, ArrowRight, Activity } from 'lucide-react';
import Globe from '../components/ui/Globe';

const scrollToId = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const Home = () => {
  const [scrollPct, setScrollPct] = useState(0);
  const [globeTf, setGlobeTf] = useState('');
  const [globeVisible, setGlobeVis] = useState(true);
  const videoRef = useRef(null);
  const sectionRefs = useRef([]);
  const raf = useRef(null);

  // Her section için Globe pozisyonu: { left(vw), top(vh), scale }
  const GLOBE_POS = [
    { top:50, left:80, scale:1.25 },  // hero
    { top:50, left:50, scale:1.7  },  // hakkimizda
    { top:40, left:20, scale:1.1  },  // neden
    { top:28, left:80, scale:0.95 },  // nasil
    { top:50, left:15, scale:1.35 },  // rekabet
    { top:55, left:50, scale:1.6  },  // misyon
    { top:35, left:75, scale:1.0  },  // teknik
    { top:60, left:30, scale:1.4  },  // ismodeli
    { top:50, left:50, scale:1.9  },  // iletisim
  ];

  // Video otomatik oynatma
  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.play().catch(() => {});
      const handleVisible = () => { if (!document.hidden && v.paused) v.play().catch(() => {}); };
      document.addEventListener('visibilitychange', handleVisible);
      return () => document.removeEventListener('visibilitychange', handleVisible);
    }
  }, []);

  // Scroll handler - Globe pozisyonunu ve progress bar'ı günceller
  const onScroll = useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const top = window.pageYOffset;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(Math.min(Math.max(top / (max || 1), 0), 1));

      const mid = window.innerHeight / 2;
      let best = 0, bestD = Infinity;
      sectionRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestD) { bestD = d; best = i; }
      });
      const p = GLOBE_POS[best] || GLOBE_POS[0];
      setGlobeTf(`translate3d(${p.left}vw,${p.top}vh,0) translate3d(-50%,-50%,0) scale3d(${p.scale},${p.scale},1)`);
    });
  }, []);

  useEffect(() => {
    const p0 = GLOBE_POS[0];
    setGlobeTf(`translate3d(${p0.left}vw,${p0.top}vh,0) translate3d(-50%,-50%,0) scale3d(${p0.scale},${p0.scale},1)`);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Footer'a gelince Globe'u gizle
    const footer = document.querySelector('footer');
    let footerObs;
    if (footer) {
      footerObs = new IntersectionObserver(([entry]) => {
        setGlobeVis(!entry.isIntersecting);
      }, { threshold: 0.05 });
      footerObs.observe(footer);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
      if (footerObs) footerObs.disconnect();
    };
  }, [onScroll]);

  const badge = (text, icon) => (
    <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'5px 16px', border:'1px solid rgba(0,255,135,.25)', borderRadius:999, fontSize:11, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'#00FF87', background:'rgba(0,255,135,.08)', marginBottom:22 }}>
      {icon} {text}
    </div>
  );

  const sTitle = { fontFamily:"'Orbitron',sans-serif", fontWeight:800, fontSize:'clamp(1.5rem,3.2vw,2.5rem)', lineHeight:1.15, marginBottom:16, color:'#fff' };
  const glowLine = <div style={{ height:1, background:'linear-gradient(90deg,transparent,#00FF87,transparent)', opacity:.4, margin:'2rem 0' }} />;
  const cardStyle = (extra={}) => ({ background:'rgba(12,18,30,.85)', borderRadius:16, padding:'28px 24px', border:'1px solid rgba(0,255,135,.12)', backdropFilter:'blur(12px)', transition:'all .3s ease', position:'relative', overflow:'hidden', ...extra });
  const secStyle = { position:'relative', padding:'6rem 1.5rem 5rem', zIndex:10 };
  const wrap = { maxWidth:960, width:'100%', margin:'0 auto' };

  return (
    <>
      <style>{`
        @keyframes floatUp{0%{transform:translateY(100vh);opacity:0}8%{opacity:1}92%{opacity:.5}100%{transform:translateY(-80px);opacity:0}}
        @keyframes neonPulse{0%,100%{text-shadow:0 0 20px rgba(0,255,135,.5),0 0 50px rgba(0,255,135,.25)}50%{text-shadow:0 0 35px rgba(0,255,135,.85),0 0 80px rgba(0,255,135,.4)}}
        @keyframes blink{50%{opacity:0}}
        .ccard{transition:all .3s ease}.ccard:hover{border-color:rgba(0,255,135,.3)!important;box-shadow:0 8px 30px rgba(0,255,135,.08);transform:translateY(-3px)}
        .ccard::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(0,255,135,.3),transparent)}
        .btn-p{display:inline-flex;align-items:center;gap:8px;padding:14px 32px;background:#00FF87;color:#000;font-weight:700;font-size:15px;border-radius:12px;cursor:pointer;border:none;transition:all .25s;box-shadow:0 4px 22px rgba(0,255,135,.3);text-decoration:none}
        .btn-p:hover{background:#4DFFAA;box-shadow:0 6px 30px rgba(0,255,135,.5);transform:translateY(-2px)}
        .btn-o{display:inline-flex;align-items:center;gap:8px;padding:14px 32px;background:transparent;color:#fff;font-weight:600;font-size:15px;border-radius:12px;cursor:pointer;border:1px solid rgba(255,255,255,.18);transition:all .25s;text-decoration:none}
        .btn-o:hover{border-color:rgba(0,255,135,.4);color:#00FF87;background:rgba(0,255,135,.05)}
        .grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}
        .grid3{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px}
        .grid5{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}
        @media(max-width:768px){.grid2,.grid3,.grid5{grid-template-columns:1fr}}
      `}</style>

      <div style={{ background:'#060B14', color:'#fff', minHeight:'100vh', overflowX:'hidden', fontFamily:"'Outfit','Inter',sans-serif", position:'relative' }}>

        {/* Progress bar */}
        <div style={{ position:'fixed', top:0, left:0, width:'100%', height:2, zIndex:9999, background:'rgba(0,255,135,.07)' }}>
          <div style={{ height:'100%', background:'linear-gradient(90deg,#00FF87,#00CC6A)', transformOrigin:'left', transform:`scaleX(${scrollPct})`, transition:'transform .12s ease' }} />
        </div>

        {/* Grid bg */}
        <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:1, backgroundImage:'linear-gradient(rgba(0,255,135,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,135,.025) 1px,transparent 1px)', backgroundSize:'62px 62px' }} />

        {/* Particles */}
        <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:1, overflow:'hidden' }}>
          {[6,20,36,51,64,77,90].map((l,i) => (
            <div key={i} style={{ position:'absolute', left:`${l}%`, bottom:-40, width:5+i, height:5+i, borderRadius:'50%', background:'radial-gradient(circle,#00FF87,transparent)', opacity:.4, animation:`floatUp ${7+i*1.5}s ${i*0.4}s linear infinite` }} />
          ))}
        </div>

        {/* ── Globe (scroll-driven) ── */}
        <div style={{
          position:'fixed', zIndex:2, pointerEvents:'none',
          transform: globeTf,
          transition:'transform 1.3s cubic-bezier(.23,1,.32,1), opacity .6s ease',
          willChange:'transform',
          opacity: globeVisible ? .85 : 0,
        }}>
          <Globe size={280} glowColor="#00FF87" />
        </div>

        {/* ═══ HERO ═══ */}
        <section ref={el => sectionRefs.current[0] = el} id="hero" style={{ position:'relative', minHeight:'100vh', display:'flex', flexDirection:'column', justifyContent:'center', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
            <video ref={videoRef} autoPlay loop muted playsInline preload="auto" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}>
              <source src="https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4" type="video/mp4" />
            </video>
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,#060B14cc 0%,#060B14a0 45%,#060B1499 60%,#060B14f0 100%)' }} />
            <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 18% 50%,transparent 38%,#060B14 78%)' }} />
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'35%', background:'linear-gradient(transparent,#060B14)' }} />
          </div>

          <div style={{ position:'relative', zIndex:10, maxWidth:960, margin:'0 auto', padding:'0 1.5rem', width:'100%', paddingTop:110 }}>
            {badge('CARBORA // YEŞİL GELECEK', <Activity size={12} style={{ animation:'blink 1.6s ease-in-out infinite' }} />)}

            <h1 style={{ fontFamily:"'Orbitron',sans-serif", fontWeight:900, lineHeight:1.08, letterSpacing:-1, marginBottom:24, fontSize:'clamp(2rem,5vw,4.2rem)' }}>
              Geri Dönüşümü Karbon Kredisine<br />
              <span style={{ color:'#00FF87', animation:'neonPulse 3s ease-in-out infinite' }}>Dönüştüren Platform</span>
            </h1>

            <p style={{ fontSize:'clamp(.95rem,1.8vw,1.12rem)', color:'rgba(255,255,255,.55)', maxWidth:560, lineHeight:1.75, marginBottom:36 }}>
              Carbora, geri dönüşüm faaliyetlerinizi yapay zeka ve blockchain teknolojisiyle doğrulayarak ölçülebilir karbon kredilerine dönüştürür. Üniversiteler, şirketler ve bireyler için sürdürülebilir bir gelecek inşa ediyoruz.
            </p>

            <div style={{ display:'flex', flexWrap:'wrap', gap:12 }}>
              <button onClick={() => scrollToId('iletisim')} className="btn-p"><Scan size={15} /> Hemen Katıl</button>
              <button onClick={() => scrollToId('hakkimizda')} className="btn-o">Bilgileri Keşfet <ChevronRight size={15} /></button>
            </div>

            <div style={{ marginTop:60, display:'flex', alignItems:'center', gap:10, color:'rgba(255,255,255,.28)', fontSize:11, letterSpacing:'.1em', textTransform:'uppercase' }}>
              <div style={{ width:1, height:34, background:'linear-gradient(#00FF87,transparent)' }} />
              Keşfetmek için kaydır
            </div>
          </div>
        </section>


        {/* ═══ HAKKIMIZDA ═══ */}
        <section ref={el => sectionRefs.current[1] = el} id="hakkimizda" style={secStyle}>
          <div style={wrap}>
            {badge('Hakkımızda Özeti', <Leaf size={11} />)}
            <h2 style={sTitle}>Biz <span style={{color:'#00FF87'}}>Kimiz?</span></h2>

            <div className="ccard" style={cardStyle({ marginTop:28 })}>
              <p style={{ fontSize:16, color:'rgba(255,255,255,.88)', lineHeight:1.8, marginBottom:16 }}>
                Carbora, Türkiye'nin kurumsal karbon yönetimi ve gönüllü karbon piyasasındaki güvenilirlik sorununa çözüm getirmek üzere geliştirilmiş, fiziksel geri dönüşüm faaliyetlerini gerçek zamanlı doğrulayan ve ölçülebilir karbon değerlerine dönüştüren entegre bir platformdur.
              </p>
              <p style={{ fontSize:15, color:'rgba(255,255,255,.6)', lineHeight:1.7, marginBottom:16 }}>
                2025 İklim Kanunu ve planlanan ulusal Emisyon Ticaret Sistemi (ETS) göz önünde bulundurulduğunda, Türkiye'de karbon kredilerinin yerel, doğrulanabilir ve sosyal etkiyle ilişkilendirilmiş şekilde üretilmesi kritik önem taşımaktadır. Mevcut gönüllü karbon piyasasında işlem gören kredilerin büyük bölümü fiziksel karşılığı doğrulanamayan, yurt dışı kaynaklı ve yerel sosyal etkiden kopuk kredilerdir.
              </p>
              {glowLine}
              <p style={{ fontSize:15, color:'rgba(255,255,255,.6)', lineHeight:1.7, marginBottom:16 }}>
                Carbora ile çevre bilincini teknoloji ve topluluk gücüyle birleştirerek, her geri dönüşüm işlemini kayıt altına alıyor, doğrulayabilir karbon azaltımı sağlıyor ve bu değeri ekonomik bir kazanıma dönüştürüyoruz.
              </p>
              <p style={{ fontSize:15, color:'rgba(255,255,255,.6)', lineHeight:1.7 }}>
                Yapay zeka destekli atık sınıflandırma, QR kod tabanlı konum doğrulaması ve IPCC 2006 kılavuzu referanslı emisyon faktörleri birlikte kullanılarak karbon azaltım miktarı hesaplanır ve denetlenebilir bir karbon muhasebe defterinde kayıt altına alınır. Böylece karbon üretimi, raporlanan bir tahmin olmaktan çıkıp fiziksel olarak gerçekleşmiş ve doğrulanmış bir sürecin çıktısına dönüşür.
              </p>
            </div>
          </div>
        </section>

        {/* ═══ NEDEN CARBORA ═══ */}
        <section ref={el => sectionRefs.current[2] = el} id="neden" style={secStyle}>
          <div style={wrap}>
            {badge('Farkındalık Hareketi', <Globe2 size={11} />)}
            <h2 style={sTitle}>Neden <span style={{color:'#00FF87'}}>Carbora?</span></h2>

            <div className="grid2" style={{ marginTop:28 }}>
              {[
                { t:'Küresel İklim Krizi ve Karbon Piyasalarının Güvenilirlik Sorunu', d:'Dünya, 2015 Paris İklim Anlaşması\'ndan bu yana net sıfır emisyon hedefine ulaşmak için karbon piyasalarına yöneldi. Ancak bugün gönüllü karbon piyasasının (VCM) en büyük sorunu güvenilirliktir: piyasada işlem gören karbon kredilerinin önemli bir kısmı fiziksel karşılığı doğrulanamayan, yurt dışı kaynaklı ve yerel sosyal etkiden kopuk kredilerdir.' },
                { t:'Türkiye\'nin Konumu', d:'Türkiye, 2053 net sıfır emisyon hedefi doğrultusunda 2025 yılında İklim Kanunu\'nu yürürlüğe koydu ve ulusal emisyon ticaret sistemi (ETS) hazırlıklarına başladı. Ancak Türkiye\'de geri dönüşüm süreçlerinin en zayıf halkası "ölçüm ve doğrulama" sorunudur. Toplanan geri dönüştürülebilir atıkların büyük bölümü sağlıklı biçimde kayıt altına alınamamaktadır.' },
                { t:'Carbora\'nın Çözümü', d:'• Fiziksel Doğrulama: Yapay zeka, QR kod ve GPS ile her işlem doğrulanır\n• Gerçek Zamanlı Ölçüm: Atık türü, ağırlık ve karbon etkisi anlık hesaplanır\n• ISO 14064 Uyumlu Muhasebe: Denetlenebilir karbon muhasebesi\n• Yerel ve Sosyal Etki: Öğrenciler kazanır, şirketler offsetler' },
                { t:'Neden Şimdi?', d:'• 2025 İklim Kanunu yürürlükte\n• Ulusal ETS planlanıyor\n• AB SKDM ihracatçı şirketleri etkiliyor\n• GRI 305 ve CDP Kapsam 3 raporlama standartları yerel karbon verisi gerektiriyor\n\nCarbora, kritik bir zamanlama avantajı taşımaktadır.' },
              ].map((item, i) => (
                <div key={i} className="ccard" style={cardStyle()}>
                  <h3 style={{ fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:15, color:'#00FF87', marginBottom:14 }}>{item.t}</h3>
                  <p style={{ fontSize:14, color:'rgba(255,255,255,.55)', lineHeight:1.7, whiteSpace:'pre-line' }}>{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ NASIL ÇALIŞIR ═══ */}
        <section ref={el => sectionRefs.current[3] = el} id="nasil" style={secStyle}>
          <div style={wrap}>
            {badge('3 Adımda Değişimi Başlat', <Zap size={11} />)}
            <h2 style={sTitle}>Nasıl <span style={{color:'#00FF87'}}>Çalışır?</span></h2>

            <div className="grid3" style={{ marginTop:28 }}>
              {[
                { icon: Scan, num:'01', color:'#00FF87', title:'TARA', sub:'Uygulamayı Aç ve Geri Dönüşüm Faaliyetini Kaydet', desc:'Mobil uygulamamızı indirin ve en yakın Carbora geri dönüşüm noktasına gidin. Atığınızın fotoğrafını çekin.\n\n• QR kod ile platform doğrulaması\n• GPS ile konum eşleştirmesi\n• Yapay zeka ile tür ve ağırlık tahmini\n• Anomali tespiti ile sahte işlem engeli' },
                { icon: Recycle, num:'02', color:'#00CC6A', title:'GERİ DÖNÜŞTÜR', sub:'Akıllı Geri Dönüşüm Kutusuna Atın ve İşlemi Doğrulayın', desc:'Atığınızı belirlenen kutusuna bırakın. Sistem gerçek zamanlı olarak işleminizi doğrular.\n\n• IPCC 2006 emisyon faktörleri entegrasyonu\n• Atık türüne özel karbon katsayısı\n• İstatistiksel hata payı ile güvenilirlik\n• ISO 14064-1:2018 uyumlu kayıt' },
                { icon: Coins, num:'03', color:'#4DFFAA', title:'KAZAN', sub:'Eko-Puanlar Kazanın ve Ödüllere Dönüştürün', desc:'Her geri dönüşüm işlemi karşılığında karbon kredisi (eko-puan) kazanın.\n\n• Bireysel: Karbon kredisi, kampüs avantajları\n• Üniversiteler: QS ve STARS endeks artışı\n• Şirketler: GRI 305 ve CDP Kapsam 3 verisi' },
              ].map(({ icon: Icon, num, color, title, sub, desc }, i) => (
                <div key={i} className="ccard" style={cardStyle({ borderColor:`${color}20` })}>
                  <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:48, fontWeight:900, color:`${color}18`, lineHeight:1, marginBottom:8 }}>{num}</div>
                  <div style={{ width:48, height:48, borderRadius:12, border:`1px solid ${color}35`, background:`${color}0e`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
                    <Icon size={22} color={color} />
                  </div>
                  <h3 style={{ fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:16, color, marginBottom:6 }}>{title}</h3>
                  <h4 style={{ fontWeight:600, fontSize:13, color:'#fff', marginBottom:14 }}>{sub}</h4>
                  <p style={{ fontSize:13.5, color:'rgba(255,255,255,.5)', lineHeight:1.65, whiteSpace:'pre-line' }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ═══ REKABET AVANTAJLARI ═══ */}
        <section ref={el => sectionRefs.current[4] = el} id="rekabet" style={secStyle}>
          <div style={wrap}>
            {badge('Rekabet Avantajlarımız', <Star size={11} />)}
            <h2 style={sTitle}>Neden <span style={{color:'#00FF87'}}>Carbora?</span></h2>

            <div className="grid5" style={{ marginTop:28 }}>
              {[
                { icon: Trophy, color:'#00FF87', t:'Oyunlaştırma', d:'Geri dönüşüm bir görev değil, kazanç olmalı. Carbora, her geri dönüşüm işleminizi ekonomik bir teşvik mekanizmasıyla destekler. Öğrenciler kampüs içinde geri dönüşüm yaparak hem çevreye katkı sağlar hem de karbon kredisi kazanır.' },
                { icon: Target, color:'#00CC6A', t:'Gerçek Etki', d:'Mevcut karbon platformları beyana dayalı çalışır. Carbora, fiziksel doğrulamaya dayalı ilk platformdur. QR kod, GPS ve yapay zeka birlikte çalışarak her işlemi doğrular.' },
                { icon: Users, color:'#4DFFAA', t:'Topluluk Gücü', d:'Her kampüs kendi geri dönüşüm verilerini görebilir, diğer kampüslerle kıyaslayabilir ve ulusal hedeflere katkısını ölçebilir. Öğrenciler, üniversiteler, şirketler ve belediyeler birlikte çalışır.' },
                { icon: Cpu, color:'#00FF87', t:'Teknolojik Altyapı', d:'React Native (mobil), React.js (web panel), Firebase (backend), Python/TensorFlow Lite (AI), IPCC 2006 emisyon faktörleri + Türkiye ulusal veri seti.' },
                { icon: Shield, color:'#00CC6A', t:'Carbora Platformu', d:'ISO 14064 uyumlu karbon raporlama, kurumsal dashboard\'lar, karbon kredisi marketplace, API entegrasyonu ve gerçek zamanlı karbon muhasebesi.' },
              ].map(({ icon: Icon, color, t, d }, i) => (
                <div key={i} className="ccard" style={cardStyle()}>
                  <div style={{ width:42, height:42, borderRadius:11, border:`1px solid ${color}30`, background:`${color}0c`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
                    <Icon size={19} color={color} />
                  </div>
                  <h3 style={{ fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:12, color, marginBottom:8, textTransform:'uppercase', letterSpacing:'.06em' }}>{t}</h3>
                  <p style={{ fontSize:13.5, color:'rgba(255,255,255,.5)', lineHeight:1.65 }}>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ MİSYON & VİZYON ═══ */}
        <section ref={el => sectionRefs.current[5] = el} id="misyon" style={secStyle}>
          <div style={wrap}>
            <div className="grid2">
              <div className="ccard" style={cardStyle({ background:'rgba(0,255,135,0.03)', borderColor:'rgba(0,255,135,0.2)' })}>
                {badge('Misyonumuz', <Target size={11} />)}
                <h3 style={{ fontSize:17, fontWeight:700, color:'#fff', marginBottom:14, lineHeight:1.45 }}>
                  Teknolojik Gelişmeleri Yakından Takip Ederek, Yerli ve Güvenilir Çözümler Üretmek; Çevre Bilinci ve Sürdürülebilirlik Odaklı Toplum Yaratmak
                </h3>
                {glowLine}
                <p style={{ fontSize:14, color:'rgba(255,255,255,.6)', lineHeight:1.7, marginBottom:16 }}>
                  Carbora, kurumsal tecrübesiyle geri dönüşüm, sürdürülebilirlik ve topluluk gücünü tek bir oluşta birleştiren bir deneyim sunar.
                </p>
                <p style={{ fontSize:13, color:'rgba(255,255,255,.45)', lineHeight:1.65 }}>
                  <strong style={{color:'rgba(255,255,255,.7)'}}>Odak Alanlarımız:</strong><br/>
                  • Karbon muhasebesi metodoloji geliştirme (ISO 14064, GHG Protocol)<br/>
                  • Yapay zeka destekli atık sınıflandırma ve ağırlık tahmini<br/>
                  • Güvenli sistem mimarisi (sahte karbon üretiminin engellenmesi)<br/>
                  • Çok paydaşlı ekosistem yönetimi<br/>
                  • Ulusal ve uluslararası karbon standartlarına uyum (VCS, Gold Standard)
                </p>
              </div>
              <div className="ccard" style={cardStyle({ background:'rgba(0,204,106,0.03)', borderColor:'rgba(0,204,106,0.2)' })}>
                {badge('Vizyonumuz', <Award size={11} />)}
                <h3 style={{ fontSize:17, fontWeight:700, color:'#fff', marginBottom:14, lineHeight:1.45 }}>
                  Çevresel Farkındalığı Ölçülebilir Bir Deneyime Dönüştüren Dijital Deneyimler Tasarlamak; Ulusal ve Uluslararası Ölçekte Etki Yaratmak
                </h3>
                {glowLine}
                <p style={{ fontSize:14, color:'rgba(255,255,255,.6)', lineHeight:1.7, marginBottom:16 }}>
                  Kullanıcıların çevresel katkılarını ölçebileceği, yarışabileceği ve kazanabileceği ilk büyüme platformunu hayata geçiriyoruz.
                </p>
                <p style={{ fontSize:13, color:'rgba(255,255,255,.45)', lineHeight:1.65 }}>
                  <strong style={{color:'rgba(255,255,255,.7)'}}>Hedeflerimiz:</strong><br/>
                  • 2026: 2 Ankara üniversitesinde pilot, 100+ kullanıcı<br/>
                  • 2027: 10 üniversite, 5.000 aktif kullanıcı<br/>
                  • 2028: Tüm Türkiye, 100.000+ kullanıcı<br/>
                  • 2029: MENA ve Avrupa pazarlarına açılma<br/>
                  • 2030: VCS ve Gold Standard onaylı metodoloji
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ TEKNİK DETAYLAR ═══ */}
        <section ref={el => sectionRefs.current[6] = el} id="teknik" style={secStyle}>
          <div style={wrap}>
            {badge('Teknik Detaylar', <Cpu size={11} />)}
            <h2 style={sTitle}>Rekabet <span style={{color:'#00FF87'}}>Avantajları</span></h2>

            <div className="grid2" style={{ marginTop:28 }}>
              {[
                { t:'1. Doğrulama Güvenilirliği', d:'Mevcut sistemler beyan bazlı çalışırken Carbora, her işlem için yapay zekâ görüntü analizi, QR kod platform kimliği ve GPS konum verisini eşzamanlı değerlendirir. Tutarsızlık otomatik olarak işaretlenir.' },
                { t:'2. Veri Çözünürlüğü', d:'Kurumsal araçlar emisyon hesaplamalarını dönemsel yaparken Carbora, karbon azaltım verisini işlem bazında, gerçek zamanlı ve coğrafi konuma bağlı biçimde üretir.' },
                { t:'3. Yerelleştirme ve Piyasa Uyumu', d:'Türkiye İklim Kanunu çerçevesinde yerli, denetlenebilir ve sosyal etkiyle ilişkilendirilmiş karbon verisi üretir. AB SKDM kapsamındaki ihracatçı şirketler için stratejik değer taşır.' },
                { t:'4. Ölçeklenebilirlik', d:'Çok kiracılı (multi-tenant) mimari sayesinde yeni üniversite veya kurumun sisteme eklenmesi standart kurulum süreçleriyle gerçekleştirilir.' },
              ].map((item, i) => (
                <div key={i} className="ccard" style={cardStyle({ padding:'20px 22px' })}>
                  <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                    <CheckCircle size={18} color="#00FF87" style={{ marginTop:2, flexShrink:0 }} />
                    <div>
                      <h4 style={{ color:'#fff', fontSize:14, fontWeight:700, marginBottom:8 }}>{item.t}</h4>
                      <p style={{ fontSize:13, color:'rgba(255,255,255,.5)', lineHeight:1.65, margin:0 }}>{item.d}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize:18, fontWeight:700, color:'#fff', marginTop:40, marginBottom:16 }}>Ar-Ge Yönü ve Teknolojik Belirsizlikler</h3>
            <div className="grid3">
              {[
                { t:'Görüntüden Kütle Tahmini', d:'Referans nesne kullanmadan, tek kamera çekimiyle kütlenin güvenilir tahmini. MobileNetV3 transfer öğrenme mimarisi ile %85 sınıflandırma doğruluğu hedefleniyor.' },
                { t:'Sahte Karbon Engelleme', d:'GPS, QR kod, görüntü güven skoru ve işlem sıklığının çok değişkenli anomali tespitine dayanan özgün doğrulama algoritması.' },
                { t:'Bireysel ISO 14064 Uyumu', d:'Kurumsal ölçekte tasarlanan standartların bireysel işlem ölçeğine indirgenmesi için dinamik karbon hesaplama motoru geliştirildi.' },
              ].map((item, i) => (
                <div key={i} className="ccard" style={cardStyle({ padding:'18px 20px' })}>
                  <h4 style={{ color:'#00FF87', fontSize:13, fontWeight:700, marginBottom:8 }}>{item.t}</h4>
                  <p style={{ fontSize:13, color:'rgba(255,255,255,.5)', lineHeight:1.6 }}>{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ═══ İŞ MODELİ & HEDEF PAZAR ═══ */}
        <section ref={el => sectionRefs.current[7] = el} id="ismodeli" style={secStyle}>
          <div style={wrap}>
            {badge('Girişim İş Modeli', <Briefcase size={11} />)}
            <h2 style={sTitle}>Carbora <span style={{color:'#00FF87'}}>İş Modeli</span></h2>
            <p style={{ fontSize:15, color:'rgba(255,255,255,.55)', lineHeight:1.7, maxWidth:600, marginBottom:30 }}>
              Carbora, çok paydaşlı bir ekosistem modeliyle çalışır ve üç bağımsız gelir akışına sahiptir:
            </p>

            <div className="grid3" style={{ marginBottom:40 }}>
              {[
                { num:'1', t:'Karbon Kredisi Satışı', d:'Öğrencilerin geri dönüşüm faaliyetleri doğrulanmış karbon kredilerine dönüştürülür ve şirketlere kurumsal offsetleme amaçlı satılır.', color:'#00FF87' },
                { num:'2', t:'Kurumsal Lisans Ücretleri', d:'Üniversiteler ve kurumlar, platform kullanımı, veri raporlama altyapısı ve dashboard erişimi için yıllık lisans ücreti öder.', color:'#00CC6A' },
                { num:'3', t:'Raporlama Hizmetleri', d:'Firmalara özel karbon ayak izi hesaplama, ISO 14064 uyumlu raporlama ve bağımsız doğrulama danışmanlığı hizmetleri sunulur.', color:'#4DFFAA' },
              ].map(({ num, t, d, color }, i) => (
                <div key={i} className="ccard" style={cardStyle({ borderColor:`${color}25` })}>
                  <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:36, fontWeight:900, color:`${color}20`, lineHeight:1, marginBottom:12 }}>0{num}</div>
                  <h3 style={{ fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:14, color, marginBottom:10 }}>{t}</h3>
                  <p style={{ fontSize:13.5, color:'rgba(255,255,255,.5)', lineHeight:1.65 }}>{d}</p>
                </div>
              ))}
            </div>

            {badge('Hedef Pazar', <MapPin size={11} />)}
            <h2 style={{...sTitle, marginTop:8}}>Pazarın <span style={{color:'#00FF87'}}>Potansiyeli</span></h2>

            <div className="grid2" style={{ marginTop:20 }}>
              <div className="ccard" style={cardStyle()}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                  <MapPin size={18} color="#00FF87" />
                  <h3 style={{ fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:14, color:'#00FF87' }}>Lokal Pazar (Türkiye)</h3>
                </div>
                <p style={{ fontSize:14, color:'rgba(255,255,255,.6)', lineHeight:1.7 }}>
                  200+ üniversite, 8+ milyon öğrenci, GRI ve CDP raporlaması yapan binlerce kurumsal firma, 81 belediye ve atık yönetim sistemi.
                </p>
              </div>
              <div className="ccard" style={cardStyle()}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                  <Globe2 size={18} color="#00CC6A" />
                  <h3 style={{ fontFamily:"'Orbitron',sans-serif", fontWeight:700, fontSize:14, color:'#00CC6A' }}>Global Pazar</h3>
                </div>
                <p style={{ fontSize:14, color:'rgba(255,255,255,.6)', lineHeight:1.7 }}>
                  2023 gönüllü karbon piyasası: 2 milyar dolar. 2030 beklentisi: 50+ milyar dolar. AB SKDM kapsamında ihracat yapan binlerce firma.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ İLETİŞİM ═══ */}
        <section ref={el => sectionRefs.current[8] = el} id="iletisim" style={{ ...secStyle, textAlign:'center' }}>
          <div style={{ position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)', width:520, height:520, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,255,135,.08) 0%,transparent 68%)', pointerEvents:'none' }} />

          <div style={{ maxWidth:600, width:'100%', margin:'0 auto', position:'relative' }}>
            {badge('İletişim', <Mail size={11} />)}
            <h2 style={{...sTitle, textAlign:'center'}}>Bizimle <span style={{color:'#00FF87'}}>İletişime Geçin</span></h2>
            {glowLine}

            <div style={{ display:'flex', flexDirection:'column', gap:16, alignItems:'center', marginBottom:32 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:15, color:'rgba(255,255,255,.7)' }}>
                <Mail size={16} color="#00FF87" /> semihozdas@gmail.com
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:15, color:'rgba(255,255,255,.7)' }}>
                <Mail size={16} color="#00FF87" /> yusufsefayetkin@gmail.com
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:15, color:'rgba(255,255,255,.7)' }}>
                <Phone size={16} color="#00FF87" /> +90 (506) 025 77 25
              </div>
            </div>

            <div style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap' }}>
              <button onClick={() => scrollToId('hero')} className="btn-p">Hemen Katıl <ArrowRight size={15} /></button>
              <button onClick={() => scrollToId('hakkimizda')} className="btn-o">Daha Fazla Bilgi</button>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Home;
