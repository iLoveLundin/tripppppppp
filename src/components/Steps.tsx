import React, { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Download, Globe2, LocateFixed, MapPin, Plane, QrCode } from 'lucide-react'
import html2canvas from 'html2canvas'
import { CONFIG } from '../config'

type TicketData = { name:string; email:string; origin:string; dest:string; date:string; class:'ECONOMY'|'BUSINESS'|'FIRST'; pnr:string; seat:string; gate:string; boardingTime:string; platform:string }
const randPNR = () => Array.from({length:6},()=> 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random()*32)]).join('')
const randSeat = () => `${Math.ceil(Math.random()*30)}${['A','B','C','D','E','F'][Math.floor(Math.random()*6)]}`

export function useCountdown(target: Date | null){
  const [now, setNow] = React.useState(new Date())
  React.useEffect(()=>{ if(!target) return; const id = setInterval(()=> setNow(new Date()), 1000); return ()=> clearInterval(id) },[target])
  return React.useMemo(()=>{
    if(!target) return null
    const diff = Math.max(0, target.getTime() - now.getTime())
    const s = Math.floor(diff/1000)
    const days = Math.floor(s/86400); const hours = Math.floor((s%86400)/3600); const mins = Math.floor((s%3600)/60); const secs = s%60
    return { days, hours, mins, secs, done: diff===0 }
  },[now, target])
}

export function Steps({shareUrl, onEdit}:{shareUrl:string; onEdit:()=>void}){
  const [data, setData] = useState<TicketData>(()=>{
    const iso = new Date().toISOString().slice(0,10)
    return { name:'', email:'', origin:'BOS', dest:'LUN', date:iso, class:'ECONOMY', pnr:randPNR(), seat:randSeat(), gate:'A'+Math.ceil(Math.random()*12), boardingTime:'23:45', platform:'spotify' }
  })
  const ticketRef = useRef<HTMLDivElement>(null)
  const countdown = useCountdown(CONFIG.RELEASE.date)

  async function downloadPNG(){
    if(!ticketRef.current) return
    const canvas = await html2canvas(ticketRef.current, { scale: 2, backgroundColor: null })
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png'); a.download = `LundinTicket-${data.pnr}.png`; a.click()
  }
  async function copyLink(){ await navigator.clipboard.writeText(shareUrl) }

  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="mb-2">
              <h1 className="airport text-[56px] md:text-[80px] leading-[0.9] tracking-[0.08em] font-extrabold text-[var(--textOnDark)] drop-shadow-[0_2px_0_rgba(0,0,0,0.1)]">TRIP TO LUNDIN</h1>
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-md border border-zinc-300/60 bg-white/70 text-zinc-800 text-xs uppercase tracking-[0.2em]">Flight JL • Promo</div>
            </div>
            {countdown && (
              <div className="mt-6 flex items-center gap-4">
                <div className="rounded-xl paper px-4 py-3">
                  <div className="text-xs uppercase tracking-widest text-zinc-600 mb-1">Gate opens in</div>
                  <div className="splitflap">
                    <div className="card">{String(countdown.days).padStart(2,'0')}</div>
                    <div className="card">{String(countdown.hours).padStart(2,'0')}</div>
                    <div className="card">{String(countdown.mins).padStart(2,'0')}</div>
                    <div className="card">{String(countdown.secs).padStart(2,'0')}</div>
                    <span className="label">D H M S</span>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl paper"><LocateFixed className="w-4 h-4"/> Use my location</button>
              <div className="text-xs text-[var(--textOnDark)]/80 flex items-center gap-1"><Globe2 className="w-3 h-3"/> Sets your origin airport (with consent).</div>
            </div>
          </div>
          <div>
            <div ref={ticketRef} className="rounded-2xl paper p-5 ticket-perf ticket-edge">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--a)] via-[var(--b)] to-[var(--c)] grid place-items-center text-black font-extrabold">JL</div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-zinc-600">Boarding Pass</div>
                    <div className="font-bold text-zinc-900">LUNDIN AIR</div>
                  </div>
                </div>
                <div className="text-sm text-zinc-600">PNR <span className="font-mono text-zinc-900">{data.pnr}</span></div>
              </div>
              <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-zinc-900">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-600">From</div>
                  <div className="text-3xl font-extrabold">{data.origin}</div>
                </div>
                <svg className="w-6 h-6 opacity-80" viewBox="0 0 24 24" fill="none"><path d="M2 16l20-5-6 5 2 5-6-3-5 2 3-6-8-3z" stroke="currentColor"/></svg>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-widest text-zinc-600">To</div>
                  <div className="text-3xl font-extrabold">LUN</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-zinc-900 text-sm">
                <div><div className="text-[10px] uppercase tracking-widest text-zinc-600">Seat</div><div className="font-semibold">{data.seat}</div></div>
                <div><div className="text-[10px] uppercase tracking-widest text-zinc-600">Gate</div><div className="font-semibold">{data.gate}</div></div>
                <div><div className="text-[10px] uppercase tracking-widest text-zinc-600">Board</div><div className="font-semibold">{data.boardingTime}</div></div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 text-zinc-700"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M2 12h20" stroke="currentColor"/></svg> Departing from your city</div>
                <div className="flex items-center gap-2">
                  <a className="underline decoration-dotted" href={CONFIG.PRE_SAVE_URLS.allLinks} target="_blank" rel="noreferrer">All links</a>
                  <span className="text-zinc-400">•</span>
                  <a className="underline decoration-dotted" href={CONFIG.PRE_SAVE_URLS.spotify} target="_blank" rel="noreferrer">Spotify</a>
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-white/70 p-3">
                <div className="text-xs uppercase tracking-widest text-zinc-600">Share / Save</div>
                <div className="mt-2 flex gap-2">
                  <button onClick={copyLink} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-300"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M8 17v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2" stroke="currentColor"/></svg> Copy link</button>
                  <button onClick={downloadPNG} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-300"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" stroke="currentColor"/></svg> Download PNG</button>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-end text-xs text-zinc-500 gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M3 3h18v18H3z" stroke="currentColor"/></svg> Save or share your pass
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}