import { useEffect, useState, type FormEvent } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ArrowUpRight, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, CircleAlert, Clock3, Compass, ExternalLink, MapPin, Menu, Phone, Send, Sparkles, X } from 'lucide-react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { type ReactNode } from 'react';

const queryClient = new QueryClient();
const mapsUrl = 'https://maps.app.goo.gl/yaCxdqNXu1PyiiGM6';
const phone = '+91 124 620 1519';

type GalleryItem = { title: string; note: string; tile: string };

const gallery: GalleryItem[] = [
  { title: 'A quiet arrival', note: 'A visual study of the property’s local setting', tile: 'tile-a' },
  { title: 'Light / texture', note: 'An editorial placeholder, not a stock photograph', tile: 'tile-b' },
  { title: 'Around Risali', note: 'The character of a residential Bhilai neighbourhood', tile: 'tile-c' },
  { title: 'Stay awhile', note: 'Public photography is currently limited', tile: 'tile-d' },
];

const faqs = [
  ['Where is SPOT ON Hotel Rosewood?', 'The mapped property is at 5, Street Number 4, near Samayra Inn, Ashish Nagar West, Pragati Nagar, Risali, Bhilai, Chhattisgarh 490006, India.'],
  ['Can I book a room through this site?', 'This is an enquiry site, not a reservation engine. Send your preferred dates and contact details; the property team can confirm current availability directly.'],
  ['What room categories are available?', 'Reliable public information does not list room categories at this time. We prefer to confirm the current offering with the property rather than guess.'],
  ['What are the check-in and check-out times?', 'These details have not been reliably published. Include your arrival window in an enquiry and ask the property team to confirm.'],
  ['How do I find the property?', 'Use the verified Google Maps location below for turn-by-turn directions. The property is in Risali, Bhilai, near Samayra Inn.'],
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <button data-testid="button-brand-home" onClick={() => scrollToId('home')} className={`group flex items-center gap-3 text-left ${light ? 'text-[#f3eee5]' : 'text-[#252625]'}`}>
      <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-current/50">
        <span className="font-display text-xl leading-none">R</span>
        <span className="absolute -right-1 top-1 h-2 w-2 rounded-full bg-[#bd604a]" />
      </span>
      <span>
        <span className="block font-mono-ui text-[.62rem] uppercase tracking-[.18em] opacity-70">SPOT ON</span>
        <span className="block font-display text-xl leading-none tracking-tight">Hotel Rosewood</span>
      </span>
    </button>
  );
}

function Header({ onEnquire }: { onEnquire: () => void }) {
  const [open, setOpen] = useState(false);
  const links = [['about', 'The stay'], ['rooms', 'Rooms & details'], ['location', 'Location'], ['gallery', 'Gallery'], ['faq', 'FAQ']];
  const navigate = (id: string) => { setOpen(false); scrollToId(id); };
  return (
    <header className="absolute left-0 right-0 top-0 z-20 px-5 py-5 text-[#f3eee5] md:px-10 md:py-7">
      <div className="mx-auto flex max-w-[1380px] items-center justify-between">
        <Brand light />
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
          {links.map(([id, label]) => <button data-testid={`nav-${id}`} key={id} onClick={() => navigate(id)} className="eyebrow opacity-80 transition-opacity hover:opacity-100">{label}</button>)}
          <button data-testid="button-header-enquire" onClick={onEnquire} className="group flex items-center gap-2 rounded-full border border-[#f3eee5]/50 px-5 py-3 text-xs font-semibold tracking-wide transition-colors hover:bg-[#f3eee5] hover:text-[#252625]">
            Enquire <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </nav>
        <button data-testid="button-mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)} className="rounded-full border border-[#f3eee5]/50 p-3 lg:hidden">
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
      {open && (
        <nav className="modal-sheet absolute left-4 right-4 top-[76px] rounded-2xl bg-[#f3eee5] p-5 text-[#252625] shadow-2xl lg:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-1">
            {links.map(([id, label]) => <button data-testid={`mobile-nav-${id}`} key={id} onClick={() => navigate(id)} className="flex items-center justify-between border-b border-[#cfc3b3] py-4 text-left font-display text-2xl">{label}<ArrowUpRight size={17} className="text-[#bd604a]" /></button>)}
            <button data-testid="button-mobile-enquire" onClick={() => { setOpen(false); onEnquire(); }} className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#bd604a] py-4 text-sm font-semibold text-[#f3eee5]">Start an enquiry <Send size={16} /></button>
          </div>
        </nav>
      )}
    </header>
  );
}

function Hero({ onEnquire }: { onEnquire: () => void }) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [validation, setValidation] = useState('');

  const validateDates = () => {
    if (!checkIn || !checkOut) { setValidation('Choose both dates to continue.'); return false; }
    if (new Date(checkOut) <= new Date(checkIn)) { setValidation('Check-out must be after check-in.'); return false; }
    setValidation('');
    return true;
  };
  return (
    <section id="home" className="hero-wash relative min-h-[760px] px-5 pb-14 pt-36 text-[#f3eee5] md:min-h-[820px] md:px-10 md:pt-44">
      <div className="hero-architecture" aria-hidden="true">
        <span className="hero-window" /><span className="hero-window" /><span className="hero-window" /><span className="hero-window" />
      </div>
      <div className="relative z-10 mx-auto flex min-h-[590px] max-w-[1380px] flex-col justify-between">
        <div className="max-w-4xl">
          <p className="eyebrow reveal mb-6 flex items-center gap-3"><span className="h-px w-10 bg-[#f3eee5]/70" /> Risali · Bhilai · Chhattisgarh</p>
          <h1 className="reveal reveal-delay-1 max-w-4xl font-display text-[clamp(4.3rem,10vw,9.7rem)] leading-[.82] tracking-[-.055em]">Stay close<br /><em>to the real.</em></h1>
          <p className="reveal reveal-delay-2 mt-9 max-w-md text-sm leading-7 text-[#f3eee5]/82 md:text-base">A mapped local hotel in Ashish Nagar West, for mornings that begin unhurried and plans that stay your own.</p>
        </div>
        <div className="reveal reveal-delay-3 mt-14 flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xs">
            <p className="eyebrow mb-3 text-[#f0c38e]">A note on this place</p>
            <p className="text-xs leading-6 text-[#f3eee5]/70">Public photography and operating details are limited. This page keeps the useful facts visible, and leaves the rest for a direct conversation.</p>
          </div>
          <div className="w-full max-w-3xl rounded-2xl border border-[#f3eee5]/30 bg-[#252625]/35 p-3 backdrop-blur-md md:p-4">
            <form onSubmit={(event) => { event.preventDefault(); if (validateDates()) onEnquire(); }} className="grid gap-2 md:grid-cols-[1fr_1fr_1.15fr_auto] md:items-end">
              <label className="rounded-xl bg-[#f3eee5]/10 px-4 py-3"><span className="eyebrow block text-[#f3eee5]/60">Check in</span><span className="flex items-center gap-2"><CalendarDays size={15} /><input data-testid="input-hero-check-in" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="mt-1 w-full bg-transparent text-sm outline-none [color-scheme:dark]" /></span></label>
              <label className="rounded-xl bg-[#f3eee5]/10 px-4 py-3"><span className="eyebrow block text-[#f3eee5]/60">Check out</span><span className="flex items-center gap-2"><CalendarDays size={15} /><input data-testid="input-hero-check-out" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="mt-1 w-full bg-transparent text-sm outline-none [color-scheme:dark]" /></span></label>
              <label className="rounded-xl bg-[#f3eee5]/10 px-4 py-3"><span className="eyebrow block text-[#f3eee5]/60">Guests</span><select data-testid="select-hero-guests" className="mt-1 w-full bg-transparent text-sm outline-none"><option className="text-[#252625]">1 guest</option><option className="text-[#252625]">2 guests</option><option className="text-[#252625]">3 guests</option><option className="text-[#252625]">4 guests</option></select></label>
              <button data-testid="button-hero-check" type="submit" className="flex min-h-[58px] items-center justify-center gap-2 rounded-xl bg-[#f0c38e] px-5 text-sm font-bold text-[#252625] transition-transform hover:-translate-y-0.5">Check availability <ArrowUpRight size={16} /></button>
            </form>
            {validation && <p data-testid="status-date-validation" className="mt-2 flex items-center gap-2 px-2 text-xs text-[#f0c38e]"><CircleAlert size={13} /> {validation}</p>}
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 right-6 z-10 hidden items-center gap-3 md:flex"><span className="eyebrow text-[#f3eee5]/60">Scroll to explore</span><span className="h-8 w-px bg-[#f3eee5]/50" /></div>
    </section>
  );
}

function SectionIntro({ number, kicker, title, copy }: { number: string; kicker: string; title: ReactNode; copy?: string }) {
  return <div className="mb-14 grid gap-6 md:grid-cols-[120px_1fr_1fr] md:gap-10"><p className="section-number">{number} <span className="ml-2 inline-block h-px w-7 align-middle bg-[#bd604a]" /></p><div><p className="eyebrow mb-5 text-[#bd604a]">{kicker}</p><h2 className="font-display text-[clamp(3rem,6vw,6.2rem)] leading-[.9] tracking-[-.04em]">{title}</h2></div>{copy && <p className="max-w-sm self-end text-sm leading-7 text-[#675e55]">{copy}</p>}</div>;
}

function About() {
  return (
    <section id="about" className="bg-[#f3eee5] px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1380px]">
        <SectionIntro number="01" kicker="The stay" title={<>A local address<br /><em>with room to breathe.</em></>} copy="Not a resort fantasy. Not a faceless booking page. Rosewood is presented as it is: a mapped hotel property in Risali, Bhilai, where the most useful luxury is knowing where you are." />
        <div className="editorial-rule mb-12" />
        <div className="grid items-start gap-10 md:grid-cols-[1fr_1.4fr_1fr] md:gap-16">
          <div><p className="eyebrow text-[#bd604a]">What we can verify</p><p className="mt-4 font-display text-3xl leading-tight">A real pin.<br />A clear address.<br />A direct line.</p></div>
          <div className="relative min-h-[330px] overflow-hidden bg-[#d7c5aa] p-7 md:min-h-[450px]"><div className="absolute -right-8 -top-8 h-56 w-56 rounded-full border-[24px] border-[#bd604a]/75" /><div className="absolute bottom-7 left-7 h-28 w-28 rounded-full bg-[#65766a]" /><div className="absolute left-[30%] top-[28%] h-24 w-24 rotate-12 border-[12px] border-[#f3eee5]" /><div className="relative z-10 flex h-full flex-col justify-between"><p className="eyebrow text-[#252625]/60">Rosewood / 490006</p><div><p className="font-display text-5xl leading-[.9]">The<br /><em>neighbourhood</em><br />is part of it.</p><div className="mt-5 flex items-center gap-2 text-xs text-[#252625]/70"><MapPin size={14} className="text-[#bd604a]" /> Risali, Bhilai</div></div></div></div>
          <div className="flex flex-col justify-between gap-10 md:pt-24"><div><p className="eyebrow text-[#bd604a]">The useful version</p><p className="mt-4 text-sm leading-7 text-[#675e55]">Use this site to decide if the location feels right, then enquire for the details that change day to day: room availability, exact timings and the current stay experience.</p></div><div className="border-l-2 border-[#bd604a] pl-5"><p className="font-display text-2xl leading-tight">“Good stays start with good information.”</p></div></div>
        </div>
      </div>
    </section>
  );
}

function RoomsDetails() {
  const items = [
    ['01', 'Mapped property', 'The hotel identity and location are verified through the public Maps listing.'],
    ['02', 'Room information', 'Categories, room count and inclusions are not reliably published. Ask the team directly.'],
    ['03', 'On your terms', 'Share dates, guest count and any practical needs in an enquiry; receive a human confirmation.'],
  ];
  return (
    <section id="rooms" className="bg-[#65766a] px-5 py-24 text-[#f3eee5] md:px-10 md:py-32">
      <div className="mx-auto max-w-[1380px]">
        <SectionIntro number="02" kicker="Rooms & details" title={<>No invented<br /><em>amenities.</em></>} copy="We would rather give you a useful blank than a polished fiction. Here is what the public record tells us — and where a direct enquiry matters." />
        <div className="grid border-t border-[#f3eee5]/30 md:grid-cols-3">
          {items.map(([number, title, text]) => <div key={number} className="shape-card border-b border-[#f3eee5]/30 py-8 md:border-b-0 md:border-r md:px-8 md:py-12 first:md:pl-0 last:md:border-r-0"><p className="eyebrow text-[#f0c38e]">{number}</p><h3 className="mt-16 font-display text-4xl">{title}</h3><p className="mt-5 max-w-xs text-sm leading-7 text-[#f3eee5]/70">{text}</p></div>)}
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-[#f3eee5]/30 pt-7 md:flex-row md:items-center"><p className="flex items-center gap-3 text-sm text-[#f3eee5]/70"><Clock3 size={17} className="text-[#f0c38e]" /> Check-in, check-out and amenities are best confirmed directly.</p><button data-testid="button-details-enquire" onClick={() => window.dispatchEvent(new CustomEvent('open-enquiry'))} className="group flex items-center gap-2 rounded-full border border-[#f3eee5]/50 px-5 py-3 text-sm transition-colors hover:bg-[#f3eee5] hover:text-[#252625]">Ask about your stay <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></button></div>
      </div>
    </section>
  );
}

function Location() {
  return (
    <section id="location" className="bg-[#d9c2a5] px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1380px]">
        <SectionIntro number="03" kicker="Find your way" title={<>A pin you<br /><em>can trust.</em></>} copy="Bhilai is a city best navigated by exactness. Keep the full address handy, or open the verified Maps pin before you set out." />
        <div className="grid gap-8 md:grid-cols-[.88fr_1.12fr]">
          <div className="flex flex-col justify-between bg-[#252625] p-7 text-[#f3eee5] md:min-h-[440px] md:p-10"><div><p className="eyebrow text-[#f0c38e]">Verified address</p><address data-testid="text-hotel-address" className="mt-10 font-display text-4xl not-italic leading-[.98] md:text-5xl">5, Street<br />Number 4,<br />near Samayra Inn</address></div><div className="mt-12 flex items-end justify-between gap-4"><p className="text-xs leading-5 text-[#f3eee5]/65">Ashish Nagar West<br />Pragati Nagar, Risali<br />Bhilai, Chhattisgarh 490006<br />India</p><a data-testid="link-google-maps" href={mapsUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full bg-[#f0c38e] px-4 py-3 text-xs font-bold text-[#252625] transition-transform hover:-translate-y-1">Open Maps <ExternalLink size={14} /></a></div></div>
          <div className="relative min-h-[440px] overflow-hidden border border-[#252625]/20 bg-[#b8ad91] p-7 md:p-10"><div className="absolute inset-[12%] rotate-[-5deg] border border-[#252625]/20" /><div className="absolute inset-[20%] rotate-[8deg] border border-[#252625]/25" /><div className="absolute inset-[34%_12%_10%_30%] border border-[#252625]/25" /><div className="absolute left-[44%] top-[39%] flex h-28 w-28 items-center justify-center rounded-full border-2 border-[#bd604a] bg-[#bd604a]/20"><MapPin size={37} className="text-[#252625]" /></div><div className="absolute bottom-7 left-7 right-7 flex items-end justify-between"><div><p className="eyebrow text-[#252625]/65">The mapped location</p><p className="mt-2 font-display text-3xl">Risali, Bhilai</p></div><Compass size={25} className="text-[#252625]/70" /></div></div>
        </div>
        <div className="mt-8 grid gap-5 text-sm md:grid-cols-3"><div className="border-t border-[#252625]/25 pt-4"><p className="eyebrow text-[#bd604a]">City / state</p><p className="mt-2">Bhilai, Chhattisgarh</p></div><div className="border-t border-[#252625]/25 pt-4"><p className="eyebrow text-[#bd604a]">Area</p><p className="mt-2">Risali · Pragati Nagar</p></div><div className="border-t border-[#252625]/25 pt-4"><p className="eyebrow text-[#bd604a]">Map source</p><p className="mt-2">Public Google Maps listing</p></div></div>
      </div>
    </section>
  );
}

function Gallery({ onOpen }: { onOpen: (index: number) => void }) {
  return (
    <section id="gallery" className="bg-[#f3eee5] px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1380px]">
        <SectionIntro number="04" kicker="Gallery" title={<>A sense of<br /><em>place, honestly.</em></>} copy="There is limited reliable public photography for this property. Instead of borrowing images from another hotel, we made a visual language from the tones and geometry of Risali." />
        <div className="grid auto-rows-[220px] gap-4 md:grid-cols-12 md:auto-rows-[150px]">
          {gallery.map((item, index) => <button data-testid={`button-gallery-${index}`} key={item.title} onClick={() => onOpen(index)} className={`photo-tile shape-card ${item.tile} relative text-left ${index === 0 ? 'md:col-span-7 md:row-span-3' : index === 1 ? 'md:col-span-5 md:row-span-2' : index === 2 ? 'md:col-span-5 md:row-span-2' : 'md:col-span-7 md:row-span-2'}`}><span className="absolute left-5 top-5 z-10 rounded-full border border-[#f3eee5]/60 px-3 py-1 font-mono-ui text-[.58rem] uppercase tracking-[.12em] text-[#f3eee5]">View note</span><span className="gallery-mark">{item.title}<small className="mt-2 block font-sans text-[.62rem] font-medium leading-5 opacity-80">{item.note}</small></span></button>)}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [active, setActive] = useState(0);
  return (
    <section id="faq" className="bg-[#e8d5c2] px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1040px]">
        <div className="mb-14 flex items-end justify-between"><div><p className="section-number">05 <span className="ml-2 inline-block h-px w-7 align-middle bg-[#bd604a]" /></p><h2 className="mt-5 font-display text-[clamp(3rem,6vw,6rem)] leading-[.88]">Before<br /><em>you arrive.</em></h2></div><p className="hidden max-w-[220px] text-right text-sm leading-6 text-[#675e55] md:block">The questions worth asking before you make plans.</p></div>
        <div className="border-t border-[#252625]/25">{faqs.map(([question, answer], index) => <div key={question} className="border-b border-[#252625]/25"><button data-testid={`button-faq-${index}`} onClick={() => setActive(active === index ? -1 : index)} className="flex w-full items-center justify-between py-6 text-left"><span className="font-display text-2xl md:text-3xl">{question}</span><ChevronDown size={20} className={`shrink-0 transition-transform ${active === index ? 'rotate-180 text-[#bd604a]' : ''}`} /></button>{active === index && <p data-testid={`text-faq-answer-${index}`} className="max-w-2xl pb-7 pr-10 text-sm leading-7 text-[#675e55]">{answer}</p>}</div>)}</div>
      </div>
    </section>
  );
}

function ContactCta({ onEnquire }: { onEnquire: () => void }) {
  return <section className="bg-[#bd604a] px-5 py-24 text-[#f3eee5] md:px-10 md:py-32"><div className="mx-auto flex max-w-[1380px] flex-col justify-between gap-12 md:flex-row md:items-end"><div><p className="eyebrow mb-6 text-[#f0c38e]">06 / Make an enquiry</p><h2 className="max-w-4xl font-display text-[clamp(3.8rem,9vw,9rem)] leading-[.82] tracking-[-.05em]">Make room<br /><em>for the right stay.</em></h2></div><div className="max-w-xs"><p className="text-sm leading-7 text-[#f3eee5]/78">Tell us your dates and we’ll give the property team the context they need to respond. This is an enquiry, never an instant reservation.</p><button data-testid="button-contact-enquire" onClick={onEnquire} className="group mt-8 flex items-center gap-3 rounded-full bg-[#f0c38e] px-6 py-4 text-sm font-bold text-[#252625] transition-transform hover:-translate-y-1">Start your enquiry <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></button></div></div></section>;
}

function Footer() {
  return <footer className="bg-[#252625] px-5 py-12 text-[#f3eee5] md:px-10"><div className="mx-auto max-w-[1380px]"><div className="flex flex-col justify-between gap-12 md:flex-row"><Brand light /><div className="grid grid-cols-2 gap-x-14 gap-y-5 text-xs text-[#f3eee5]/65"><button data-testid="footer-nav-about" onClick={() => scrollToId('about')} className="text-left hover:text-[#f3eee5]">The stay</button><button data-testid="footer-nav-location" onClick={() => scrollToId('location')} className="text-left hover:text-[#f3eee5]">Location</button><button data-testid="footer-nav-gallery" onClick={() => scrollToId('gallery')} className="text-left hover:text-[#f3eee5]">Gallery</button><a data-testid="footer-link-maps" href={mapsUrl} target="_blank" rel="noreferrer" className="hover:text-[#f3eee5]">Open Maps</a></div><div className="text-xs text-[#f3eee5]/65"><p className="eyebrow mb-3 text-[#f0c38e]">Direct line</p><a data-testid="footer-link-phone" href={`tel:${phone.replaceAll(' ', '')}`} className="flex items-center gap-2 hover:text-[#f3eee5]"><Phone size={14} /> {phone}</a></div></div><div className="mt-14 flex flex-col justify-between gap-3 border-t border-[#f3eee5]/20 pt-5 text-[.65rem] text-[#f3eee5]/45 md:flex-row"><p>SPOT ON Hotel Rosewood · Risali, Bhilai</p><p>Information-led hospitality / 2025</p></div></div></footer>;
}

function EnquiryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', contact: '', checkIn: '', checkOut: '', guests: '1 guest', note: '' });
  useEffect(() => { if (!open) return; const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); }; document.addEventListener('keydown', onKey); document.body.style.overflow = 'hidden'; return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; }; }, [open, onClose]);
  if (!open) return null;
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent) => { event.preventDefault(); if (!form.name || !form.contact || !form.checkIn || !form.checkOut || new Date(form.checkOut) <= new Date(form.checkIn)) return; setSubmitted(true); };
  return <div className="modal-backdrop fixed inset-0 z-50 flex items-end justify-center bg-[#252625]/65 p-0 backdrop-blur-sm md:items-center md:p-6" role="dialog" aria-modal="true" aria-labelledby="enquiry-title" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="modal-sheet max-h-[94dvh] w-full max-w-2xl overflow-y-auto rounded-t-[1.6rem] bg-[#f3eee5] p-6 text-[#252625] md:rounded-[1.6rem] md:p-10"><div className="mb-8 flex items-start justify-between"><div><p className="eyebrow text-[#bd604a]">A direct conversation</p><h2 id="enquiry-title" className="mt-3 font-display text-5xl leading-none">Enquire<br /><em>about your stay.</em></h2></div><button data-testid="button-close-enquiry" onClick={onClose} aria-label="Close enquiry" className="rounded-full border border-[#252625]/25 p-2 transition-colors hover:bg-[#e8d5c2]"><X size={18} /></button></div>{submitted ? <div className="rounded-xl bg-[#d9c2a5] p-7"><div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#65766a] text-[#f3eee5]"><Check size={22} /></div><h3 data-testid="status-enquiry-success" className="font-display text-3xl">Your enquiry is ready.</h3><p className="mt-3 max-w-md text-sm leading-6 text-[#675e55]">Thanks, {form.name}. This frontend demo has captured your request locally; contact the property on {phone} to confirm availability and details.</p><button data-testid="button-close-success" onClick={onClose} className="mt-7 rounded-full bg-[#252625] px-5 py-3 text-sm font-semibold text-[#f3eee5]">Close</button></div> : <form onSubmit={submit} className="space-y-7"><div className="grid gap-6 md:grid-cols-2"><label className="text-xs"><span className="eyebrow text-[#675e55]">Your name *</span><input data-testid="input-enquiry-name" required value={form.name} onChange={(e) => update('name', e.target.value)} className="input-field" placeholder="How should we address you?" /></label><label className="text-xs"><span className="eyebrow text-[#675e55]">Phone or email *</span><input data-testid="input-enquiry-contact" required value={form.contact} onChange={(e) => update('contact', e.target.value)} className="input-field" placeholder="Where can the team reply?" /></label></div><div className="grid gap-6 md:grid-cols-3"><label className="text-xs"><span className="eyebrow text-[#675e55]">Check in *</span><input data-testid="input-enquiry-check-in" required type="date" value={form.checkIn} onChange={(e) => update('checkIn', e.target.value)} className="input-field" /></label><label className="text-xs"><span className="eyebrow text-[#675e55]">Check out *</span><input data-testid="input-enquiry-check-out" required type="date" value={form.checkOut} onChange={(e) => update('checkOut', e.target.value)} className="input-field" /></label><label className="text-xs"><span className="eyebrow text-[#675e55]">Guests</span><select data-testid="select-enquiry-guests" value={form.guests} onChange={(e) => update('guests', e.target.value)} className="input-field"><option>1 guest</option><option>2 guests</option><option>3 guests</option><option>4 guests</option></select></label></div><label className="block text-xs"><span className="eyebrow text-[#675e55]">A note for the property</span><textarea data-testid="textarea-enquiry-note" value={form.note} onChange={(e) => update('note', e.target.value)} className="input-field min-h-[75px] resize-y" placeholder="Arrival window, room questions, or anything useful..." /></label><div className="flex flex-col justify-between gap-5 border-t border-[#cfc3b3] pt-6 md:flex-row md:items-center"><p className="max-w-sm text-[.7rem] leading-5 text-[#675e55]">We do not take payment or promise a reservation here. Your dates will be checked directly with the property.</p><button data-testid="button-submit-enquiry" type="submit" className="flex items-center justify-center gap-2 rounded-full bg-[#bd604a] px-6 py-4 text-sm font-bold text-[#f3eee5] transition-transform hover:-translate-y-1">Send enquiry <Send size={15} /></button></div></form>}</div></div>;
}

function Lightbox({ index, onClose, onChange }: { index: number | null; onClose: () => void; onChange: (next: number) => void }) {
  useEffect(() => { if (index === null) return; const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); if (event.key === 'ArrowRight') onChange((index + 1) % gallery.length); if (event.key === 'ArrowLeft') onChange((index - 1 + gallery.length) % gallery.length); }; document.addEventListener('keydown', onKey); return () => document.removeEventListener('keydown', onKey); }, [index, onChange, onClose]);
  if (index === null) return null;
  const item = gallery[index];
  return <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-[#252625]/85 p-5" role="dialog" aria-modal="true" aria-label={`${item.title} gallery view`} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className={`photo-tile modal-sheet ${item.tile} relative h-[70vh] max-h-[650px] w-full max-w-4xl`}><div className="absolute inset-0 bg-[#252625]/10" /><div className="absolute bottom-8 left-8 z-10 text-[#f3eee5]"><p className="eyebrow mb-3 text-[#f0c38e]">Visual note {String(index + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}</p><h2 className="font-display text-5xl">{item.title}</h2><p className="mt-2 text-sm text-[#f3eee5]/70">{item.note}</p></div><button data-testid="button-lightbox-close" onClick={onClose} aria-label="Close gallery" className="absolute right-5 top-5 z-10 rounded-full border border-[#f3eee5]/60 p-2 text-[#f3eee5]"><X size={18} /></button><button data-testid="button-lightbox-previous" onClick={() => onChange((index - 1 + gallery.length) % gallery.length)} aria-label="Previous image" className="absolute left-5 top-1/2 z-10 rounded-full border border-[#f3eee5]/60 p-3 text-[#f3eee5]"><ChevronLeft size={19} /></button><button data-testid="button-lightbox-next" onClick={() => onChange((index + 1) % gallery.length)} aria-label="Next image" className="absolute right-5 top-1/2 z-10 rounded-full border border-[#f3eee5]/60 p-3 text-[#f3eee5]"><ChevronRight size={19} /></button></div></div>;
}

function Home() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const openEnquiry = () => setEnquiryOpen(true);
  useEffect(() => { const open = () => setEnquiryOpen(true); window.addEventListener('open-enquiry', open); return () => window.removeEventListener('open-enquiry', open); }, []);
  return <div className="rosewood-page min-h-[100dvh]"><div className="noise-layer" /><Header onEnquire={openEnquiry} /><main><Hero onEnquire={openEnquiry} /><About /><RoomsDetails /><Location /><Gallery onOpen={setLightboxIndex} /><Faq /><ContactCta onEnquire={openEnquiry} /></main><Footer /><EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} /><Lightbox index={lightboxIndex} onClose={() => setLightboxIndex(null)} onChange={setLightboxIndex} /></div>;
}

function Router() {
  return <ErrorBoundary resetKey={useLocation()[0]}><Switch><Route path="/" component={Home} /><Route component={() => <div className="flex min-h-[100dvh] items-center justify-center bg-[#f3eee5] p-10 text-center"><div><Sparkles className="mx-auto mb-4 text-[#bd604a]" /><h1 className="font-display text-5xl">A quiet wrong turn.</h1><p className="mt-4 text-sm text-[#675e55]">That page does not exist.</p><button data-testid="button-not-found-home" onClick={() => scrollToId('home')} className="mt-7 rounded-full bg-[#252625] px-5 py-3 text-sm text-[#f3eee5]">Return home</button></div></div>} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;