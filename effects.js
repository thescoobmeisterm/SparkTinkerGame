'use strict';
// Synthesized locally: no audio downloads, network, or autoplay required.
window.gameFX = (() => {
  let audio, master, muted = false, lastSecond = 8;
  const voices = new Set(), animations = new Set();
  const layer = document.getElementById('effects');
  const soundButton = document.getElementById('sound');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  try { muted = localStorage.getItem('robot-sound-muted') === 'true'; } catch {}
  function label() {
    soundButton.textContent = muted ? '♪ Off' : '♪ On';
    soundButton.setAttribute('aria-label', muted ? 'Unmute sound' : 'Mute sound');
    soundButton.setAttribute('aria-pressed', String(!muted));
  }
  function unlock() {
    try {
      if (!audio) {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) return;
        audio = new Audio(); master = audio.createGain();
        master.gain.value = muted ? 0 : 0.22; master.connect(audio.destination);
      }
      if (audio.state === 'suspended') audio.resume().catch(() => {});
    } catch { /* Gameplay remains available without audio support. */ }
  }
  function tone(frequency, delay = 0, duration = 0.14, type = 'triangle', endFrequency) {
    if (!audio || audio.state === 'closed' || muted) return;
    const at = audio.currentTime + delay, voice = audio.createOscillator(), gain = audio.createGain();
    voice.type = type; voice.frequency.setValueAtTime(frequency, at);
    if (endFrequency) voice.frequency.exponentialRampToValueAtTime(endFrequency, at + duration);
    gain.gain.setValueAtTime(0, at); gain.gain.linearRampToValueAtTime(0.45, at + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, at + duration);
    voice.connect(gain); gain.connect(master); voices.add(voice);
    voice.onended = () => { voices.delete(voice); voice.disconnect(); gain.disconnect(); };
    voice.start(at); voice.stop(at + duration + 0.02);
  }
  function sound(kind) {
    if (kind === 'start') [330,440,660].forEach((f,i) => tone(f,i*.09,.18));
    if (kind === 'correct') [523,659,784,1047].forEach((f,i) => tone(f,i*.075,.2));
    if (kind === 'wrong' || kind === 'timeout') {
      tone(150,0,.38,'sawtooth',35); tone(75,.04,.3,'sine',25);
      tone(kind === 'timeout' ? 440 : 294,.12,.22,'triangle',110);
    }
    if (kind === 'finish') [523,659,784,1047,784,1047].forEach((f,i) => tone(f,i*.12,.25));
    if (kind === 'tick') tone(760,0,.045,'sine');
  }
  function animate(node, frames, options) {
    const animation = node.animate(frames, options); animations.add(animation);
    animation.onfinish = () => { animations.delete(animation); if(node.parentNode===layer)node.remove(); };
  }
  function clear() {
    for (const animation of animations) animation.cancel(); animations.clear(); layer.replaceChildren();
    for (const voice of voices) { try { voice.stop(); } catch {} }
    voices.clear();
    document.getElementById('timer').classList.remove('urgent');
  }
  function burst(kind, finale = false) {
    if (reduced.matches) return;
    const target = document.querySelector(finale ? '.score-orb' : '#game .specimen');
    const rect = target.getBoundingClientRect();
    const x = Math.min(innerWidth-35, Math.max(35, rect.left+rect.width/2));
    const y = Math.min(innerHeight-70, Math.max(70, rect.top+rect.height/2));
    const celebration = kind === 'correct';
    const colors = celebration ? ['#c4e952','#428c80','#f2b552','#ea8291','#86a9da'] : ['#f4be50','#e98948','#d56843','#7c8d79'];
    const count = finale ? 110 : celebration ? 55 : 30;
    for (let i=0;i<count;i++) {
      const particle = document.createElement('i');
      particle.className = 'fx-particle';
      const size = 5+Math.random()*7;
      Object.assign(particle.style,{left:`${x}px`,top:`${y}px`,width:`${size}px`,height:`${celebration?size*.5:size}px`,background:colors[i%colors.length],borderRadius:celebration?'1px':'50%'});
      layer.append(particle);
      const angle = Math.random()*Math.PI*2, distance = (finale?200:100)+Math.random()*(finale?430:210);
      const dx = Math.cos(angle)*distance, dy = Math.sin(angle)*distance;
      animate(particle,[{transform:'translate(0,0) rotate(0deg)',opacity:1},{transform:`translate(${dx*.7}px,${dy*.7-65}px) rotate(180deg)`,opacity:1,offset:.55},{transform:`translate(${dx}px,${dy+210}px) rotate(${360+Math.random()*360}deg)`,opacity:0}],{duration:celebration?1500+Math.random()*600:650+Math.random()*400,easing:'cubic-bezier(.15,.65,.45,1)',fill:'forwards'});
    }
    if (!celebration) {
      const ring = document.createElement('i'); ring.className='fx-shockwave';
      Object.assign(ring.style,{left:`${x}px`,top:`${y}px`}); layer.append(ring);
      animate(ring,[{transform:'translate(-50%,-50%) scale(.1)',opacity:.8},{transform:'translate(-50%,-50%) scale(2.5)',opacity:0}],{duration:550,easing:'ease-out',fill:'forwards'});
      animate(target,[{transform:'translateX(0)'},{transform:'translateX(-7px)'},{transform:'translateX(6px)'},{transform:'translateX(-3px)'},{transform:'translateX(0)'}],{duration:320});
    } else {
      animate(target,[{transform:'scale(1)'},{transform:'scale(1.025)'},{transform:'scale(1)'}],{duration:360});
    }
  }
  soundButton.onclick = () => {
    muted = !muted; unlock();
    if(master)master.gain.setValueAtTime(muted?0:0.22,audio.currentTime);
    try { localStorage.setItem('robot-sound-muted',String(muted)); } catch {}
    label(); if(!muted)tone(660,0,.1);
  };
  label();
  return {
    start(){unlock();sound('start');},
    question(){lastSecond=8;document.getElementById('timer').classList.remove('urgent');},
    tick(left){const seconds=Math.ceil(left/1000);if(seconds!==lastSecond){lastSecond=seconds;if(seconds>0&&seconds<=3)sound('tick');}document.getElementById('timer').classList.toggle('urgent',left>0&&left<=3000);},
    answer(correct,timeout){sound(correct?'correct':timeout?'timeout':'wrong');burst(correct?'correct':'wrong');document.getElementById('timer').classList.remove('urgent');},
    finish(){sound('finish');burst('correct',true);},
    clear
  };
})();
