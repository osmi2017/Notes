import React from 'react';

const WaveBackground = () => {
  return (
    <div className="waveWrapper waveAnimation">
    <div className="waveWrapperInner bgTop bg-gradient-to-b from-blue-500 via-white to-purple-700">

      <div
        className="wave waveTop"
        style={{
          backgroundImage: "url('http://front-end-noobs.com/jecko/img/wave-top.png')",
        }}
      ></div>
    </div>
    <div className="waveWrapperInner bgMiddle bg-gradient-to-b from-slate-950 via-blue-800 to-purple-700">
      <div
        className="wave waveMiddle"
        style={{
          backgroundImage: "url('http://front-end-noobs.com/jecko/img/wave-mid.png')",
        }}
      ></div>
    </div>
    <div className="waveWrapperInner bgBottom bg-gradient-to-b from-slate-950 via-blue-800 to-purple-700">
      <div
        className="wave waveBottom"
        style={{
          backgroundImage: "url('http://front-end-noobs.com/jecko/img/wave-bot.png')",
        }}
      ></div>
    </div>
  </div>
  
  );
};

export default WaveBackground;
