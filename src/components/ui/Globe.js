import React from 'react';

const Globe = ({ size = 280, glowColor = '#00FF87' }) => (
  <>
    <style>{`
      @keyframes earthRotate   { 0%{background-position:0 0;} 100%{background-position:400px 0;} }
      @keyframes atmosRotate   { 0%{transform:rotate(0deg);} 100%{transform:rotate(360deg);} }
      @keyframes atmosRotateRev{ 0%{transform:rotate(0deg);} 100%{transform:rotate(-360deg);} }
      @keyframes globePulse {
        0%,100%{ box-shadow:-5px 0 8px #c3f4ff inset,15px 2px 25px #000 inset,-24px -2px 34px #c3f4ff77 inset,0 0 40px ${glowColor}33; }
        50%    { box-shadow:-5px 0 10px #c3f4ff inset,15px 2px 28px #000 inset,-24px -2px 44px #c3f4ffaa inset,0 0 70px ${glowColor}55; }
      }
      @keyframes starA { 0%,100%{opacity:.06;} 50%{opacity:.85;} }
      @keyframes starB { 0%,100%{opacity:.04;} 50%{opacity:.65;} }
      @keyframes starC { 0%,100%{opacity:.08;} 50%{opacity:1;} }
    `}</style>

    <div style={{ position: 'relative', width: size, height: size }}>

      {/* Outer ambient glow */}
      <div style={{
        position: 'absolute', inset: -28, borderRadius: '50%',
        background: `radial-gradient(circle,${glowColor}18 0%,transparent 68%)`,
        animation: 'globePulse 4s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* Orbit ring 1 */}
      <div style={{
        position: 'absolute', inset: -14, borderRadius: '50%',
        border: `1px solid ${glowColor}25`,
        borderTopColor: `${glowColor}70`,
        borderBottomColor: 'transparent',
        animation: 'atmosRotate 18s linear infinite',
        boxShadow: `0 0 8px ${glowColor}18`,
      }} />

      {/* Orbit ring 2 (reverse) */}
      <div style={{
        position: 'absolute', inset: -22, borderRadius: '50%',
        border: `1px solid ${glowColor}12`,
        borderRightColor: `${glowColor}50`,
        borderLeftColor: 'transparent',
        animation: 'atmosRotateRev 28s linear infinite',
      }} />

      {/* Globe sphere */}
      <div style={{
        width: size, height: size, borderRadius: '50%',
        overflow: 'hidden',
        backgroundImage: "url('https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/globe.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'left',
        animation: 'earthRotate 28s linear infinite, globePulse 4s ease-in-out infinite',
        position: 'relative',
      }}>
        {/* Neon green tint overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 30% 35%,${glowColor}18 0%,transparent 55%)`,
          mixBlendMode: 'screen',
          borderRadius: '50%',
        }} />
        {/* Dark shadow right side */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 80% 50%,rgba(0,0,0,.55) 0%,transparent 50%)',
          borderRadius: '50%',
        }} />

        {/* Twinkling stars */}
        {[
          { l: -22, t: '8%',  a: 'starA 3.1s infinite',  d: '0s'   },
          { l: -42, t: '28%', a: 'starB 2.2s infinite',  d: '.4s'  },
          { l: 355, t: '42%', a: 'starA 3.8s infinite',  d: '.9s'  },
          { l: 205, t: '88%', a: 'starC 1.6s infinite',  d: '.2s'  },
          { l: 52,  t: '82%', a: 'starA 2.7s infinite',  d: '1.1s' },
          { l: 265, t: '-5%', a: 'starB 4.2s infinite',  d: '.7s'  },
          { l: 305, t: '18%', a: 'starC 1.9s infinite',  d: '1.5s' },
          { l: 160, t: '60%', a: 'starA 3.3s infinite',  d: '.3s'  },
        ].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', left: s.l, top: s.t,
            width: 3, height: 3, borderRadius: '50%', background: '#fff',
            animation: s.a, animationDelay: s.d,
          }} />
        ))}
      </div>
    </div>
  </>
);

export default Globe;
