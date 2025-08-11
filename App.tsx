import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Music2, Share2, Plane } from 'lucide-react'
import DecorStyles from './components/DecorStyles'
import CloudsCanvas from './components/CloudsCanvas'
import { Steps, useCountdown } from './components/Steps'
import { CONFIG } from './config'

function randomPNR(){ return Array.from({length:6},()=> 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random()*32)]).join('') }

function fireConfetti(){
  const colors = ['var(--a)','var(--b)','var(--c)']
  for(let i=0;i<30;i++){
    const el = document.createElement('span')
    el.style.position='fixed'; el.style.top='-10px'; el.style.left = Math.random()*100+'vw'
    el.style.width='8px'; el.style.height='14px'; el.style.background=colors[i%colors.length]; el.style.opacity='0.9'; el.style.transform=`rotate(${Math.random()*360}deg)`
    el.style.zIndex='60'; el.style.pointerEvents='none'; el.style.animation=`confetti ${5+Math.random()*2}s linear forwards`
    el.style.borderRadius='2px'; el.style.boxShadow='0 0 10px rgba(0,0,0,.2)'
    document.body.appendChild(el); setTimeout(()=>el.remove(), 7500)
  }
}

function useAudioTeaser(){
  const el = useRef<HTMLAudioElement|null>(null)
  useEffect(()=>{
    const a = new Audio('/teaser.mp3')
    a.preload = 'auto'
    el.current = a
    return ()=>{ a.pause(); el.current = null }
  },[])
  return {
    play: ()=>{
      const a = el.current; if(!a) return;
      a.currentTime = 15; a.volume = 1.0; a.play();
      const stopAt = 60; const onTime = ()=>{ if(a.currentTime >= stopAt){ a.pause(); a.currentTime = 0 } };
      a.addEventListener('timeupdate', onTime);
      setTimeout(()=> a.removeEventListener('timeupdate', onTime), 50000)
    },
    pause: ()=>{ el.current?.pause() }
  }
}

export default function App(){
  const [introOpen, setIntroOpen] = useState(true)
  const [copied, setCopied] = useState(false)
  const countdown = useCountdown(CONFIG.RELEASE.date)
  const audio = useAudioTeaser()

  useEffect(()=>{
    if(!introOpen){
      setTimeout(()=>{ audio.play() }, 300)
    }
  },[introOpen])

  async function copyLink(){
    await navigator.clipboard.writeText(CONFIG.PRE_SAVE_URLS.allLinks)
    setCopied(true); setTimeout(()=> setCopied(false), 1200)
  }

  const AccentLogo = (
    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--a)] via-[var(--b)] to-[var(--c)] grid place-items-center text-black font-extrabold shadow">JL</div>
  )

  return (
    <div className="min-h-screen w-full text-[var(--text)] relative overflow-x-hidden">
      <DecorStyles />
      <CloudsCanvas />
      <div className="vintageFX" />

      <AnimatePresence>
        {introOpen && (
          <motion.div className="fixed inset-0 z-50 grid place-items-center" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <motion.div onClick={()=>{ setIntroOpen(false); fireConfetti() }} className="cursor-pointer select-none" initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} transition={{duration:.6}}>
              <motion.div className="relative rounded-2xl paper p-5 w-[90vw] max-w-md ticket-perf ticket-edge shimmer" whileHover={{rotate:0, scale:1.02}}>
                <div className="absolute left-3 -bottom-3 stamp">Lundin Air • Admit One</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--a)] via-[var(--b)] to-[var(--c)] grid place-items-center text-black font-extrabold">JL</div>
                    <div>
                      <div className="text-xs uppercase tracking-widest text-zinc-600">Boarding Pass</div>
                      <div className="font-bold text-zinc-900">LUNDIN AIR</div>
                    </div>
                  </div>
                  <div className="text-sm text-zinc-600">PNR <span className="font-mono text-zinc-900">{randomPNR()}</span></div>
                </div>
                <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-zinc-900">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-zinc-600">From</div>
                    <div className="text-3xl font-extrabold">BOS</div>
                  </div>
                  <Plane className="opacity-80" />
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-widest text-zinc-600">To</div>
                    <div className="text-3xl font-extrabold">LUN</div>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm text-zinc-600">Tap to Board</div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!introOpen && (
        <>
          <div className="w-full sticky top-0 z-40">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">{AccentLogo}
                <div>
                  <div className="text-xs uppercase tracking-widest text-[var(--textOnDark)]/70">Boarding for</div>
                  <div className="airport font-extrabold tracking-[0.12em] text-[var(--textOnDark)] uppercase">Trip To Lundin</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a href={CONFIG.PRE_SAVE_URLS.allLinks} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl paper border border-transparent">
                  <Music2 className="w-4 h-4"/> Listen / Pre-save
                </a>
                <button onClick={copyLink} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl paper border border-transparent">
                  <Share2 className="w-4 h-4"/> {copied?'Copied!':'Share'}
                </button>
              </div>
            </div>
          </div>

          <Steps shareUrl={CONFIG.PRE_SAVE_URLS.allLinks} onEdit={()=>{}} />
        </>
      )}
    </div>
  )
}