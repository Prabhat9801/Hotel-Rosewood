import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  AirVent,
  ArrowUpRight,
  BatteryCharging,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  Droplets,
  ExternalLink,
  LogIn,
  LogOut,
  MapPin,
  Menu,
  Phone,
  Send,
  Sparkles,
  Train,
  Tv,
  Users,
  Wifi,
  X,
} from 'lucide-react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { galleryCategories, galleryImages, hotel, type GalleryCategory } from '@/hotel-data';
import { useReveal } from '@/use-reveal';
import { useFocusTrap } from '@/use-focus-trap';

const queryClient = new QueryClient();

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const pick = (file: string) => {
  const found = galleryImages.find((image) => image.src.endsWith(file));
  if (!found) throw new Error(`Missing gallery image: ${file}`);
  return found;
};

/** The strongest real exterior shot leads the page. */
const heroImage = pick('exterior-01.jpg');
const aboutImage = pick('reception-01.jpg');
const roomImage = pick('room-01.jpg');

const amenityIcons = {
  wifi: Wifi,
  ac: AirVent,
  tv: Tv,
  geyser: Droplets,
  power: BatteryCharging,
} as const;

const addressLines = [
  `${hotel.address.plot}, ${hotel.address.street}`,
  `${hotel.address.locality}, ${hotel.address.city}`,
  `${hotel.address.state} ${hotel.address.pin}, ${hotel.address.country}`,
];

const faqs: [string, string][] = [
  [
    'Where exactly is Hotel Rosewood?',
    `${hotel.address.plot}, ${hotel.address.street}, ${hotel.address.locality}, ${hotel.address.city}, ${hotel.address.state} ${hotel.address.pin}. The nearest landmark is ${hotel.address.landmark}. Use the map below for turn-by-turn directions.`,
  ],
  [
    'What are the check-in and check-out times?',
    `Check-in is from ${hotel.stay.checkIn} and check-out is by ${hotel.stay.checkOut}. If you expect to arrive outside that window, mention it in your enquiry so the property can plan for it.`,
  ],
  [
    'What kind of room is available?',
    `The property is listed with one room category — the ${hotel.stay.roomName}, approximately ${hotel.stay.roomSize}, with air conditioning, a TV, a geyser and a private bathroom. Rather than invent extra categories, we show the one that is actually published.`,
  ],
  [
    'Which ID do I need at check-in?',
    hotel.stay.idNote,
  ],
  [
    'Can I book directly on this site?',
    'No — and we would rather say so plainly. This page is an enquiry and information site. Live availability and payment are handled on the property’s official OYO listing, which the booking buttons open directly.',
  ],
  [
    'Are couples allowed?',
    'Yes. The property listing states that couples are welcome, subject to the standard ID requirements above.',
  ],
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/** Fades a block up the first time it scrolls into view. */
function Reveal({
  children,
  delay = 0,
  image = false,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode;
  delay?: 0 | 1 | 2 | 3 | 4 | 5;
  image?: boolean;
  className?: string;
  as?: 'div' | 'li' | 'figure';
}) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <Tag
      ref={ref as never}
      className={`rv ${delay ? `rv-${delay}` : ''} ${image ? 'rv-img' : ''} ${shown ? 'rv-in' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <button
      data-testid="button-brand-home"
      onClick={() => scrollToId('home')}
      className={`group flex items-center gap-3 text-left ${light ? 'text-[#f3eee5]' : 'text-[#252625]'}`}
    >
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-current/50">
        <span className="font-display text-xl leading-none">R</span>
        <span className="absolute -right-1 top-1 h-2 w-2 rounded-full bg-[#b8593f]" />
      </span>
      <span>
        <span className="block font-mono-ui text-[.72rem] uppercase tracking-[.18em] opacity-90">{hotel.brand}</span>
        <span className="block font-display text-xl leading-none tracking-tight">{hotel.name}</span>
      </span>
    </button>
  );
}

function BookNow({ className = '', children = 'Book on OYO', testId }: { className?: string; children?: ReactNode; testId: string }) {
  return (
    <a
      data-testid={testId}
      href={hotel.links.booking}
      target="_blank"
      rel="noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}

function Header({ onEnquire }: { onEnquire: () => void }) {
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);

  // Solid ground kicks in once the hero photograph is no longer behind the
  // bar, otherwise the light sections wash out the white nav text.
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 90);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links: [string, string][] = [
    ['about', 'The stay'],
    ['rooms', 'The room'],
    ['gallery', 'Gallery'],
    ['location', 'Location'],
    ['faq', 'FAQ'],
  ];
  const navigate = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };
  return (
    <header
      className={`header-shift fixed left-0 right-0 top-0 z-40 px-5 text-[#f3eee5] md:px-10 ${
        stuck ? 'header-solid py-3 md:py-4' : 'py-5 md:py-7'
      }`}
    >
      <div className="mx-auto flex max-w-[1380px] items-center justify-between gap-4">
        <Brand light />
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
          {links.map(([id, label]) => (
            <button
              data-testid={`nav-${id}`}
              key={id}
              onClick={() => navigate(id)}
              className="nav-link eyebrow py-3 transition-opacity hover:opacity-80"
            >
              {label}
            </button>
          ))}
          <BookNow
            testId="button-header-book"
            className="group flex items-center gap-2 rounded-full border border-[#f3eee5]/50 px-5 py-3 text-sm font-semibold tracking-wide transition-colors hover:bg-[#f3eee5] hover:text-[#252625]"
          >
            Book your stay
            <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </BookNow>
        </nav>
        <button
          data-testid="button-mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="shrink-0 rounded-full border border-[#f3eee5]/50 p-3 lg:hidden"
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
      {open && (
        <nav
          className="modal-sheet absolute left-4 right-4 top-full mt-2 max-h-[calc(100dvh-120px)] overflow-y-auto rounded-2xl bg-[#f5f1e8] p-5 text-[#24251f] shadow-2xl lg:hidden"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-1">
            {links.map(([id, label]) => (
              <button
                data-testid={`mobile-nav-${id}`}
                key={id}
                onClick={() => navigate(id)}
                className="flex items-center justify-between border-b border-[#cfc3b3] py-4 text-left font-display text-2xl"
              >
                {label}
                <ArrowUpRight size={17} className="text-[#b8593f]" />
              </button>
            ))}
            <BookNow
              testId="button-mobile-book"
              className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#b8593f] py-4 text-sm font-semibold text-[#f3eee5]"
            >
              Book on OYO <ExternalLink size={15} />
            </BookNow>
            <button
              data-testid="button-mobile-enquire"
              onClick={() => {
                setOpen(false);
                onEnquire();
              }}
              className="mt-2 flex items-center justify-center gap-2 rounded-full border border-[#252625]/30 py-4 text-sm font-semibold"
            >
              Send an enquiry <Send size={15} />
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}

function Hero({ onEnquire }: { onEnquire: () => void }) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2 guests');
  const [validation, setValidation] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!checkIn || !checkOut) {
      setValidation('Choose both dates to continue.');
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      setValidation('Check-out must be after check-in.');
      return;
    }
    setValidation('');
    window.dispatchEvent(new CustomEvent('open-enquiry', { detail: { checkIn, checkOut, guests } }));
    onEnquire();
  };

  return (
    <section id="home" className="relative min-h-[680px] px-5 pb-14 pt-32 text-[#f3eee5] md:min-h-[780px] md:px-10 md:pt-40">
      {/* Real photograph of the property's Classic Room, held back by a
          gradient that keeps the room readable rather than hiding it. */}
      <div className="absolute inset-0 overflow-hidden bg-[#24251f]">
        <img
          src={asset(heroImage.src)}
          alt={heroImage.alt}
          width={1600}
          height={1067}
          fetchPriority="high"
          decoding="async"
          className="hero-photo h-full w-full object-cover object-[68%_42%] md:object-[center_42%]"
        />
        <div className="hero-scrim absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[520px] max-w-[1380px] flex-col justify-between">
        <div className="max-w-4xl">
          <p className="eyebrow reveal mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-[#f3eee5]/70" /> {hotel.address.locality} · {hotel.address.city} · {hotel.address.state}
          </p>
          <h1 className="reveal reveal-delay-1 max-w-4xl font-display text-[clamp(3.2rem,9vw,8.4rem)] leading-[.86] tracking-[-.05em]">
            {hotel.name}
            <br />
            <em>Risali, Bhilai.</em>
          </h1>
          <p className="reveal reveal-delay-2 mt-8 max-w-lg text-sm leading-7 text-[#f5f1e8]/95 md:text-base">
            An air-conditioned {hotel.stay.roomName.toLowerCase()} on a quiet residential street in Pragati Nagar,
            a few kilometres from Bhilai Nagar and Durg Junction. Wi-Fi, hot water and power backup —
            the practical things, done properly.
          </p>
          <div className="reveal reveal-delay-3 mt-9 flex flex-wrap items-center gap-3">
            <BookNow
              testId="button-hero-book"
              className="btn-sheen group flex items-center gap-2 rounded-full bg-[#f0c38e] px-6 py-4 text-sm font-bold text-[#24251f] shadow-[0_8px_22px_rgba(240,195,142,.3)] transition-transform hover:-translate-y-0.5"
            >
              Book your stay
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </BookNow>
            <button
              data-testid="button-hero-explore"
              onClick={() => scrollToId('rooms')}
              className="group flex items-center gap-2 rounded-full border border-[#f3eee5]/55 px-6 py-4 text-sm font-semibold backdrop-blur-sm transition-colors hover:border-[#f5f1e8] hover:bg-[#f5f1e8] hover:text-[#24251f]"
            >
              Explore the room
              <ChevronDown size={15} className="transition-transform group-hover:translate-y-0.5" />
            </button>
          </div>
        </div>

        <div className="reveal reveal-delay-4 mt-14 flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xs">
            <p className="eyebrow mb-3 text-[#f0c38e]">Good to know</p>
            <p className="text-sm leading-6 text-[#f5f1e8]/92">
              Check-in {hotel.stay.checkIn} · Check-out {hotel.stay.checkOut}. Live rates and availability are held on
              the property’s official OYO listing.
            </p>
          </div>
          <div className="w-full max-w-3xl rounded-2xl border border-[#f3eee5]/30 bg-[#24251f]/45 p-3 backdrop-blur-md md:p-4">
            {/* Two columns until there's genuinely enough width for four —
                1024px still clips "Check availability" in this card's own
                max-w-3xl box, so the 4-column row waits for xl (1280px). */}
            <form onSubmit={submit} className="grid gap-2 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1.05fr_auto] xl:items-end">
              <label className="rounded-xl bg-[#f3eee5]/10 px-4 py-3">
                <span className="eyebrow block text-[#f5f1e8]/95">Check in</span>
                <span className="flex items-center gap-2">
                  <CalendarDays size={15} className="shrink-0" />
                  <input
                    data-testid="input-hero-check-in"
                    type="date"
                    aria-label="Check-in date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="mt-1 min-h-8 w-full min-w-0 bg-transparent text-sm outline-none [color-scheme:dark]"
                  />
                </span>
              </label>
              <label className="rounded-xl bg-[#f3eee5]/10 px-4 py-3">
                <span className="eyebrow block text-[#f5f1e8]/95">Check out</span>
                <span className="flex items-center gap-2">
                  <CalendarDays size={15} className="shrink-0" />
                  <input
                    data-testid="input-hero-check-out"
                    type="date"
                    aria-label="Check-out date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="mt-1 min-h-8 w-full min-w-0 bg-transparent text-sm outline-none [color-scheme:dark]"
                  />
                </span>
              </label>
              <label className="rounded-xl bg-[#f3eee5]/10 px-4 py-3">
                <span className="eyebrow block text-[#f5f1e8]/95">Guests</span>
                <select
                  data-testid="select-hero-guests"
                  aria-label="Number of guests"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="mt-1 min-h-8 w-full bg-transparent text-sm outline-none"
                >
                  {['1 guest', '2 guests', '3 guests', '4 guests'].map((option) => (
                    <option key={option} className="text-[#252625]">
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <button
                data-testid="button-hero-check"
                type="submit"
                className="btn-sheen col-span-full flex min-h-[58px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#f0c38e] px-5 text-[.88rem] font-bold text-[#24251f] transition-transform hover:-translate-y-0.5 xl:col-auto xl:w-auto xl:text-sm"
              >
                Check availability <ArrowUpRight size={16} />
              </button>
            </form>
            {validation && (
              <p data-testid="status-date-validation" className="mt-2 flex items-center gap-2 px-2 text-sm text-[#f0c38e]">
                <CircleAlert size={13} /> {validation}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * `tone="dark"` is for sections painted on a dark ground, where the
 * terracotta kicker and stone body colour would fall out of contrast.
 */
/**
 * `tone="dark"` is for sections painted on a dark ground, where the
 * terracotta kicker and stone body colour would fall out of contrast.
 *
 * The three parts stagger in — number, then title, then copy — so every
 * section opens with the same rhythm as the page scrolls.
 */
function SectionIntro({
  number,
  kicker,
  title,
  copy,
  tone = 'light',
}: {
  number: string;
  kicker: string;
  title: ReactNode;
  copy?: string;
  tone?: 'light' | 'dark';
}) {
  const dark = tone === 'dark';
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="mb-14 grid gap-6 md:grid-cols-[120px_1fr_1fr] md:gap-10">
      <p className={`rv ${shown ? 'rv-in' : ''} section-number ${dark ? '!text-[#f0c38e]' : ''}`}>
        {number}
        <span
          className={`rule-draw ${shown ? 'rv-in' : ''} ml-2 inline-block h-px w-7 align-middle ${
            dark ? 'bg-[#f0c38e]' : 'bg-[#b8593f]'
          }`}
        />
      </p>
      <div>
        <p className={`rv rv-1 ${shown ? 'rv-in' : ''} eyebrow mb-5 ${dark ? 'text-[#f0c38e]' : 'text-[#b8593f]'}`}>
          {kicker}
        </p>
        <h2
          className={`rv rv-2 ${shown ? 'rv-in' : ''} font-display text-[clamp(2.6rem,6vw,6.2rem)] leading-[.9] tracking-[-.04em]`}
        >
          {title}
        </h2>
      </div>
      {copy && (
        <p
          className={`rv rv-3 ${shown ? 'rv-in' : ''} max-w-sm self-end text-sm leading-7 ${
            dark ? 'text-[#f5f1e8]/94' : 'text-[#4f463d]'
          }`}
        >
          {copy}
        </p>
      )}
    </div>
  );
}
function About() {
  return (
    <section id="about" className="ground-cream px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1380px]">
        <SectionIntro
          number="01"
          kicker="The stay"
          title={
            <>
              A local address
              <br />
              <em>with room to breathe.</em>
            </>
          }
          copy="A SPOT ON property in Pragati Nagar, Risali — a residential pocket of Bhilai where the streets are quiet after dark and the city is still a short drive away."
        />
        <div className="editorial-rule mb-12" />
        <div className="grid items-start gap-10 md:grid-cols-[1fr_1.4fr_1fr] md:gap-16">
          <Reveal>
            <p className="eyebrow text-[#b8593f]">The essentials</p>
            <p className="mt-4 font-display text-3xl leading-tight">
              One room type.
              <br />
              Air conditioned.
              <br />
              Simply kept.
            </p>
            <dl className="mt-8 space-y-4 text-sm">
              <div className="flex items-center gap-3 border-t border-[#cfc3b3] pt-4">
                <LogIn size={16} className="shrink-0 text-[#b8593f]" />
                <dt className="text-[#4f463d]">Check-in</dt>
                <dd className="ml-auto font-semibold">{hotel.stay.checkIn}</dd>
              </div>
              <div className="flex items-center gap-3 border-t border-[#cfc3b3] pt-4">
                <LogOut size={16} className="shrink-0 text-[#b8593f]" />
                <dt className="text-[#4f463d]">Check-out</dt>
                <dd className="ml-auto font-semibold">{hotel.stay.checkOut}</dd>
              </div>
              <div className="flex items-center gap-3 border-t border-[#cfc3b3] pt-4">
                <Users size={16} className="shrink-0 text-[#b8593f]" />
                <dt className="text-[#4f463d]">Couples</dt>
                <dd className="ml-auto font-semibold">Welcome</dd>
              </div>
            </dl>
          </Reveal>

          {/* Real property photograph, in the frame the design already had. */}
          <Reveal delay={1} image className="relative min-h-[330px] overflow-hidden rounded-lg bg-[#d7c5aa] md:min-h-[450px]">
            <img
              src={asset(aboutImage.src)}
              alt={aboutImage.alt}
              width={1600}
              height={1067}
              loading="lazy"
              decoding="async"
              className="h-full min-h-[330px] w-full object-cover md:min-h-[450px]"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[38%] bg-gradient-to-t from-[#14150f]/82 via-[#14150f]/28 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 z-10 p-7 text-[#f3eee5]">
              <p className="font-display text-3xl leading-[1.02] sm:text-4xl md:text-5xl">
                Reception,
                <br />
                <em>on arrival.</em>
              </p>
              <p className="mt-4 flex items-center gap-2 text-sm text-[#f5f1e8]/94">
                <MapPin size={14} className="shrink-0 text-[#f0c38e]" /> {hotel.address.locality}, {hotel.address.city}
              </p>
            </div>
          </Reveal>

          <Reveal delay={2} className="flex flex-col justify-between gap-10 md:pt-24">
            <div>
              <p className="eyebrow text-[#b8593f]">What to expect</p>
              <p className="mt-4 text-sm leading-7 text-[#4f463d]">
                A clean, air-conditioned room with a private bathroom, hot water, a TV and Wi-Fi — near
                {' '}{hotel.address.landmark}, roughly 5 km from Bhilai Nagar station and 7 km from Durg Junction.
                Practical rather than plush, and honest about it.
              </p>
            </div>
            <div className="border-l-2 border-[#b8593f] pl-5">
              <p className="font-display text-2xl leading-tight">“Good stays start with good information.”</p>
            </div>
            <p className="flex items-start gap-3 bg-[#e8d5c2] p-4 text-sm leading-6 text-[#4a4136]">
              <CircleAlert size={15} className="mt-0.5 shrink-0 text-[#b8593f]" />
              <span data-testid="text-signage-note">{hotel.signageNote}</span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Room({ onEnquire }: { onEnquire: () => void }) {
  return (
    <section id="rooms" className="ground-sage px-5 py-24 text-[#f3eee5] md:px-10 md:py-32">
      <div className="mx-auto max-w-[1380px]">
        <SectionIntro
          number="02"
          kicker="The room"
          title={
            <>
              The Classic
              <br />
              <em>Room.</em>
            </>
          }
          copy={`One published category, roughly ${hotel.stay.roomSize}. We show the room the property actually offers rather than inventing a suite ladder above it.`}
          tone="dark"
        />

        <div className="grid gap-8 md:grid-cols-[1.15fr_.85fr]">
          <Reveal image className="shape-card overflow-hidden rounded-lg">
            <img
              src={asset(roomImage.src)}
              alt={roomImage.alt}
              width={1600}
              height={1067}
              loading="lazy"
              decoding="async"
              className="aspect-[3/2] w-full object-cover"
            />
          </Reveal>

          <Reveal delay={1} className="flex flex-col gap-8">
            <div>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <h3 className="font-display text-4xl md:text-5xl">{hotel.stay.roomName}</h3>
                <span className="rounded-full border border-[#f0c38e]/70 px-3 py-1 font-mono-ui text-[.8rem] uppercase tracking-[.12em] text-[#f0c38e]">
                  {hotel.stay.roomSize}
                </span>
              </div>
              <p className="mt-5 text-sm leading-7 text-[#f5f1e8]/92">
                A double bed with a cushioned headboard, wall-mounted air conditioning, a TV, and a private bathroom
                with a geyser for hot water. Windows bring in daylight; power backup covers local supply cuts.
                Rooms sit across two blocks in the same building and differ only in their furnishing colour.
              </p>
              <ul className="mt-7 grid grid-cols-2 gap-3 text-sm">
                {hotel.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity.icon];
                  return (
                    <li key={amenity.label} className="flex items-center gap-2 border-t border-[#f3eee5]/25 pt-3">
                      <Icon size={15} className="shrink-0 text-[#f0c38e]" />
                      <span className="text-[#f5f1e8]/95">{amenity.label}</span>
                    </li>
                  );
                })}
                <li className="flex items-center gap-2 border-t border-[#f3eee5]/25 pt-3">
                  <Droplets size={15} className="shrink-0 text-[#f0c38e]" />
                  <span className="text-[#f5f1e8]/95">Private bathroom</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-3">
              <BookNow
                testId="button-room-book"
                className="btn-sheen group flex items-center gap-2 rounded-full bg-[#f0c38e] px-6 py-4 text-sm font-bold text-[#24251f] shadow-[0_8px_22px_rgba(240,195,142,.3)] transition-transform hover:-translate-y-0.5"
              >
                Check rates on OYO <ExternalLink size={15} />
              </BookNow>
              <button
                data-testid="button-room-enquire"
                onClick={onEnquire}
                className="flex items-center gap-2 rounded-full border border-[#f3eee5]/50 px-6 py-4 text-sm font-semibold transition-colors hover:bg-[#f3eee5] hover:text-[#252625]"
              >
                Ask about your dates
              </button>
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 border-t border-[#f3eee5]/30 pt-7 text-sm md:grid-cols-3">
          <p className="flex items-start gap-3 text-[#f5f1e8]/92">
            <Clock3 size={17} className="mt-0.5 shrink-0 text-[#f0c38e]" />
            Check-in {hotel.stay.checkIn}, check-out {hotel.stay.checkOut}.
          </p>
          <p className="flex items-start gap-3 text-[#f5f1e8]/92">
            <Users size={17} className="mt-0.5 shrink-0 text-[#f0c38e]" />
            Couples are welcome at this property.
          </p>
          <p className="flex items-start gap-3 text-[#f5f1e8]/92">
            <CircleAlert size={17} className="mt-0.5 shrink-0 text-[#f0c38e]" />
            {hotel.stay.idNote}
          </p>
        </div>
      </div>
    </section>
  );
}

function Amenities() {
  return (
    <section id="amenities" className="ground-sand px-5 py-20 md:px-10 md:py-24">
      <div className="mx-auto max-w-[1380px]">
        <SectionIntro
          number="03"
          kicker="Facilities"
          title={
            <>
              Five things,
              <br />
              <em>all of them real.</em>
            </>
          }
          copy="Only the facilities listed on the property's own official listing appear here. If something you need isn't shown, ask before you book instead of assuming."
        />
        {/* Cards arrive left-to-right so the row reads as one gesture. */}
        <ul className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {hotel.amenities.map((amenity, index) => {
            const Icon = amenityIcons[amenity.icon];
            return (
              <Reveal as="li" key={amenity.label} delay={(Math.min(index, 5) as 0 | 1 | 2 | 3 | 4 | 5)}>
                <div className="amenity-card flex h-full flex-col gap-5 p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#b8593f]/10">
                    <Icon size={21} className="amenity-icon text-[#b8593f]" />
                  </span>
                  <div>
                    <h3 className="font-display text-2xl leading-tight">{amenity.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#4f463d]">{amenity.note}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
function Gallery({ onOpen }: { onOpen: (src: string) => void }) {
  const [filter, setFilter] = useState<GalleryCategory | 'All'>('All');
  const tabs: (GalleryCategory | 'All')[] = ['All', ...galleryCategories];
  const shown = filter === 'All' ? galleryImages : galleryImages.filter((image) => image.category === filter);

  return (
    <section id="gallery" className="ground-cream px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1380px]">
        <SectionIntro
          number="04"
          kicker="Gallery"
          title={
            <>
              The property,
              <br />
              <em>photographed.</em>
            </>
          }
          copy="Every photograph here is of this property, from its own official listing — the building, the entrance, reception, the rooms and the bathrooms. No stock imagery and no stand-ins from another hotel."
        />

        <Reveal className="mb-8 flex flex-wrap gap-2"><div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter photographs by area">
          {tabs.map((tab) => {
            const active = filter === tab;
            const count = tab === 'All' ? galleryImages.length : galleryImages.filter((i) => i.category === tab).length;
            return (
              <button
                data-testid={`button-gallery-filter-${tab.toLowerCase()}`}
                key={tab}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(tab)}
                className={`chip rounded-full border px-4 py-2 font-mono-ui text-[.72rem] uppercase tracking-[.14em] ${
                  active
                    ? 'border-[#b8593f] bg-[#b8593f] text-[#f5f1e8] shadow-[0_6px_16px_rgba(184,89,63,.28)]'
                    : 'border-[#24251f]/20 text-[#4f463d] hover:border-[#b8593f] hover:text-[#b8593f]'
                }`}
              >
                {tab} <span className="opacity-60">{count}</span>
              </button>
            );
          })}
        </div></Reveal>

        {/* Every photograph is 3:2. The lead tile spans the full row at a
            wider crop; the rest tile evenly, so nothing is squeezed into a
            portrait box and no cell is left empty. */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((image, index) => (
            <Reveal
              key={image.src}
              delay={(Math.min(index % 3, 5) as 0 | 1 | 2 | 3 | 4 | 5)}
              className={index === 0 ? 'sm:col-span-2 lg:col-span-3' : ''}
            >
            <button
              data-testid={`button-gallery-${index}`}
              onClick={() => onOpen(image.src)}
              aria-label={`Open ${image.caption} in full screen`}
              className="photo-tile shape-card group relative block w-full text-left"
            >
              <img
                src={asset(image.src)}
                alt={image.alt}
                width={1600}
                height={1067}
                loading="lazy"
                decoding="async"
                className={`w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] ${
                  index === 0 ? 'aspect-[3/2] sm:aspect-[2/1] lg:aspect-[3/1]' : 'aspect-[3/2]'
                }`}
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 top-[42%] bg-gradient-to-t from-[#14150f]/82 via-[#14150f]/34 to-transparent" />
              <span className="pointer-events-none absolute inset-x-5 bottom-5 z-10 text-[#f3eee5]">
                <span className="block font-display text-2xl leading-tight md:text-3xl">{image.caption}</span>
                <span className="mt-1 block text-[.78rem] leading-5 text-[#f5f1e8]/94">{image.note}</span>
              </span>
              <span className="pointer-events-none absolute right-4 top-4 z-10 rounded-full border border-[#f3eee5]/60 px-3 py-1 font-mono-ui text-[.78rem] uppercase tracking-[.12em] text-[#f3eee5] opacity-0 transition-opacity group-hover:opacity-100">
                {image.category}
              </span>
            </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Location() {
  return (
    <section id="location" className="ground-clay px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1380px]">
        <SectionIntro
          number="05"
          kicker="Find your way"
          title={
            <>
              A pin you
              <br />
              <em>can trust.</em>
            </>
          }
          copy="Bhilai is a city best navigated by exactness. Keep the full address handy, or open the verified map pin before you set out."
        />
        <div className="grid gap-8 md:grid-cols-[.88fr_1.12fr]">
          <Reveal className="flex flex-col justify-between rounded-lg bg-[#24251f] p-7 text-[#f3eee5] md:min-h-[440px] md:p-10">
            <div>
              <p className="eyebrow text-[#f0c38e]">The address</p>
              <address data-testid="text-hotel-address" className="mt-8 font-display text-3xl not-italic leading-[1.05] md:text-4xl">
                {hotel.address.plot},
                <br />
                {hotel.address.street},
                <br />
                {hotel.address.locality}, {hotel.address.city}
              </address>
              <p className="mt-5 text-sm leading-6 text-[#f5f1e8]/94">
                {hotel.address.state} {hotel.address.pin}, {hotel.address.country}
                <br />
                Nearest landmark: {hotel.address.landmark}
              </p>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                data-testid="link-get-directions"
                href={hotel.links.directions}
                target="_blank"
                rel="noreferrer"
                className="btn-sheen flex items-center gap-2 rounded-full bg-[#f0c38e] px-5 py-3 text-sm font-bold text-[#24251f] transition-transform hover:-translate-y-1"
              >
                Get directions <ArrowUpRight size={14} />
              </a>
              <a
                data-testid="link-google-maps"
                href={hotel.links.maps}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border border-[#f3eee5]/45 px-5 py-3 text-sm font-semibold transition-colors hover:bg-[#f3eee5] hover:text-[#252625]"
              >
                Open in Maps <ExternalLink size={13} />
              </a>
            </div>
          </Reveal>

          <Reveal delay={1} className="min-h-[360px] overflow-hidden rounded-lg border border-[#24251f]/15 bg-[#b8ad91] shadow-[0_12px_30px_rgba(70,52,39,.12)] md:min-h-[440px]">
            <iframe
              data-testid="iframe-map"
              title={`Map showing ${hotel.fullName} in ${hotel.address.locality}, ${hotel.address.city}`}
              src={hotel.links.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[360px] w-full border-0 md:min-h-[440px]"
            />
          </Reveal>
        </div>

        <div className="mt-10">
          <p className="eyebrow mb-5 text-[#b8593f]">Approximate distances from Pragati Nagar</p>
          <div className="grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
            {hotel.nearby.map((place, index) => (
              <Reveal key={place.name} delay={(Math.min(index, 5) as 0 | 1 | 2 | 3 | 4 | 5)}>
                <div className="border-t border-[#24251f]/22 pt-4">
                  <p className="flex items-center gap-2 text-[#4f463d]">
                    <Train size={14} className="shrink-0 text-[#b8593f]" /> {place.name}
                  </p>
                  <p className="mt-2 font-display text-2xl">{place.distance}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-sm leading-6 text-[#4f463d]">
            Straight-line distances for the Pragati Nagar locality, not driving times. Road journeys will be longer.
          </p>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [active, setActive] = useState(0);
  return (
    <section id="faq" className="ground-sand px-5 py-24 md:px-10 md:py-28">
      <div className="mx-auto max-w-[1040px]">
        <div className="mb-14 flex items-end justify-between gap-8">
          <div>
            <p className="section-number">
              06 <span className="ml-2 inline-block h-px w-7 align-middle bg-[#b8593f]" />
            </p>
            <h2 className="mt-5 font-display text-[clamp(2.6rem,6vw,6rem)] leading-[.88]">
              Before
              <br />
              <em>you arrive.</em>
            </h2>
          </div>
          <p className="hidden max-w-[220px] text-right text-sm leading-6 text-[#4f463d] md:block">
            The questions worth asking before you make plans.
          </p>
        </div>
        <div className="border-t border-[#24251f]/20">
          {faqs.map(([question, answer], index) => (
            <Reveal key={question} delay={(Math.min(index, 5) as 0 | 1 | 2 | 3 | 4 | 5)}>
              <div className="border-b border-[#24251f]/20">
                <button
                  data-testid={`button-faq-${index}`}
                  onClick={() => setActive(active === index ? -1 : index)}
                  aria-expanded={active === index}
                  className="faq-row flex w-full items-center justify-between gap-6 px-1 py-6 text-left md:px-3"
                >
                  <span
                    className={`font-display text-xl leading-tight transition-colors md:text-3xl ${
                      active === index ? 'text-[#b8593f]' : ''
                    }`}
                  >
                    {question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 transition-transform duration-300 ${
                      active === index ? 'rotate-180 text-[#b8593f]' : 'text-[#4f463d]'
                    }`}
                  />
                </button>
                {active === index && (
                  <p
                    data-testid={`text-faq-answer-${index}`}
                    className="faq-answer max-w-2xl px-1 pb-7 text-sm leading-7 text-[#4f463d] md:px-3 md:pr-10"
                  >
                    {answer}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactCta({ onEnquire }: { onEnquire: () => void }) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <section id="contact" className="ground-terra relative overflow-hidden px-5 py-24 text-[#f5f1e8] md:px-10 md:py-28">
      {/* Soft light bloom keeps the flat terracotta from reading as a slab. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-[26rem] w-[26rem] rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(240,195,142,.55), transparent 68%)' }}
      />
      <div ref={ref} className="relative mx-auto grid max-w-[1380px] gap-12 md:grid-cols-[1.25fr_.75fr] md:items-end">
        <div>
          <p className={`rv ${shown ? 'rv-in' : ''} eyebrow mb-6 text-[#f0c38e]`}>07 / Book or enquire</p>
          <h2
            className={`rv rv-1 ${shown ? 'rv-in' : ''} font-display text-[clamp(2.9rem,7.5vw,8rem)] leading-[.86] tracking-[-.05em]`}
          >
            Make room
            <br />
            <em>for the right stay.</em>
          </h2>
          <p className={`rv rv-2 ${shown ? 'rv-in' : ''} mt-8 max-w-md text-sm leading-7 text-[#f5f1e8]/95`}>
            Check-in {hotel.stay.checkIn} · Check-out {hotel.stay.checkOut} · {hotel.stay.roomName} ·{' '}
            {hotel.address.locality}, {hotel.address.city}
          </p>
        </div>

        <div className={`rv rv-3 ${shown ? 'rv-in' : ''} rounded-2xl bg-[#14150f]/22 p-6 backdrop-blur-sm md:p-7`}>
          <p className="text-sm leading-7 text-[#f5f1e8]/95">
            Live rates, availability and payment are handled on the property’s official OYO listing. Prefer to ask
            first? Send an enquiry and bring your dates with you.
          </p>
          <div className="mt-7 flex flex-col gap-3">
            <BookNow
              testId="button-contact-book"
              className="btn-sheen group flex items-center justify-center gap-3 rounded-full bg-[#f0c38e] px-6 py-4 text-sm font-bold text-[#24251f] shadow-[0_10px_26px_rgba(0,0,0,.2)] transition-transform hover:-translate-y-1"
            >
              Book on OYO <ExternalLink size={15} />
            </BookNow>
            <button
              data-testid="button-contact-enquire"
              onClick={onEnquire}
              className="flex items-center justify-center gap-3 rounded-full border border-[#f5f1e8]/55 px-6 py-4 text-sm font-semibold transition-colors hover:bg-[#f5f1e8] hover:text-[#b8593f]"
            >
              Send an enquiry <Send size={15} />
            </button>
            <a
              data-testid="link-contact-phone"
              href={`tel:${hotel.reservations.phone.replaceAll(' ', '')}`}
              className="flex min-h-11 items-center justify-center gap-2 text-sm text-[#f5f1e8]/95 underline-offset-4 hover:underline"
            >
              <Phone size={13} /> {hotel.reservations.label}: {hotel.reservations.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
function Footer() {
  return (
    <footer className="bg-[#24251f] px-5 py-12 text-[#f3eee5] md:px-10">
      <div className="mx-auto max-w-[1380px]">
        <div className="flex flex-col justify-between gap-12 md:flex-row">
          <div className="max-w-xs">
            <Brand light />
            <p className="mt-5 text-sm leading-6 text-[#f5f1e8]/95">
              {addressLines.join(' · ')}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-4 self-start text-sm text-[#f5f1e8]/90">
            <button data-testid="footer-nav-about" onClick={() => scrollToId('about')} className="-my-1 py-2 text-left hover:text-[#f5f1e8]">
              The stay
            </button>
            <button data-testid="footer-nav-rooms" onClick={() => scrollToId('rooms')} className="-my-1 py-2 text-left hover:text-[#f5f1e8]">
              The room
            </button>
            <button data-testid="footer-nav-gallery" onClick={() => scrollToId('gallery')} className="-my-1 py-2 text-left hover:text-[#f5f1e8]">
              Gallery
            </button>
            <button data-testid="footer-nav-location" onClick={() => scrollToId('location')} className="-my-1 py-2 text-left hover:text-[#f5f1e8]">
              Location
            </button>
            <a data-testid="footer-link-maps" href={hotel.links.maps} target="_blank" rel="noreferrer" className="-my-1 py-2 hover:text-[#f5f1e8]">
              Open Maps
            </a>
            <a data-testid="footer-link-booking" href={hotel.links.booking} target="_blank" rel="noreferrer" className="-my-1 py-2 hover:text-[#f5f1e8]">
              Book on OYO
            </a>
          </div>
          <div className="text-sm text-[#f5f1e8]/88">
            <p className="eyebrow mb-3 text-[#f0c38e]">Reservations</p>
            <a
              data-testid="footer-link-phone"
              href={`tel:${hotel.reservations.phone.replaceAll(' ', '')}`}
              className="flex items-center gap-2 hover:text-[#f3eee5]"
            >
              <Phone size={14} className="shrink-0" /> {hotel.reservations.phone}
            </a>
            <p className="mt-2 text-[.82rem] leading-5 text-[#f5f1e8]/94">
              {hotel.reservations.label}. No hotel-owned direct line is publicly listed.
            </p>
          </div>
        </div>
        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-[#f3eee5]/20 pt-5 text-[.82rem] leading-5 text-[#f5f1e8]/94 md:flex-row">
          <p>
            {hotel.fullName} · {hotel.address.locality}, {hotel.address.city}, {hotel.address.state}
          </p>
          <p>
            An information and enquiry site. Photographs are the property’s own, via its official listing.
          </p>
        </div>
      </div>
    </footer>
  );
}

type Prefill = { checkIn?: string; checkOut?: string; guests?: string };

function EnquiryModal({ open, onClose, prefill }: { open: boolean; onClose: () => void; prefill: Prefill }) {
  const trapRef = useFocusTrap<HTMLDivElement>(open);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', contact: '', checkIn: '', checkOut: '', guests: '2 guests', note: '' });

  useEffect(() => {
    if (!open) return;
    setForm((current) => ({
      ...current,
      checkIn: prefill.checkIn || current.checkIn,
      checkOut: prefill.checkOut || current.checkOut,
      guests: prefill.guests || current.guests,
    }));
  }, [open, prefill]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name || !form.contact || !form.checkIn || !form.checkOut) return;
    if (new Date(form.checkOut) <= new Date(form.checkIn)) return;
    setSubmitted(true);
  };

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-end justify-center bg-[#24251f]/70 backdrop-blur-sm md:items-center md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={trapRef}
        className="modal-sheet max-h-[94dvh] w-full max-w-2xl overflow-y-auto rounded-t-[1.6rem] bg-[#f5f1e8] p-6 text-[#24251f] md:rounded-[1.6rem] md:p-10"
      >
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-[#b8593f]">A direct conversation</p>
            <h2 id="enquiry-title" className="mt-3 font-display text-4xl leading-none md:text-5xl">
              Enquire
              <br />
              <em>about your stay.</em>
            </h2>
          </div>
          <button
            data-testid="button-close-enquiry"
            onClick={onClose}
            aria-label="Close enquiry"
            className="shrink-0 rounded-full border border-[#252625]/25 p-2 transition-colors hover:bg-[#e8d5c2]"
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="rounded-xl bg-[#d9c2a5] p-7">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#65766a] text-[#f3eee5]">
              <Check size={22} />
            </div>
            <h3 data-testid="status-enquiry-success" className="font-display text-3xl">
              Your enquiry is prepared.
            </h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#4f463d]">
              Thanks, {form.name}. This site does not transmit bookings, so nothing is reserved yet. To confirm
              availability for {form.checkIn} to {form.checkOut}, book on the official OYO listing or call{' '}
              {hotel.reservations.label} on {hotel.reservations.phone}.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <BookNow
                testId="button-success-book"
                className="flex items-center gap-2 rounded-full bg-[#b8593f] px-5 py-3 text-sm font-semibold text-[#f3eee5]"
              >
                Check availability on OYO <ExternalLink size={14} />
              </BookNow>
              <button
                data-testid="button-close-success"
                onClick={onClose}
                className="rounded-full border border-[#252625]/30 px-5 py-3 text-sm font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-7">
            <div className="grid gap-6 md:grid-cols-2">
              <label className="text-sm">
                <span className="eyebrow text-[#4f463d]">Your name *</span>
                <input
                  data-testid="input-enquiry-name"
                  required
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  className="input-field"
                  placeholder="How should we address you?"
                />
              </label>
              <label className="text-sm">
                <span className="eyebrow text-[#4f463d]">Phone or email *</span>
                <input
                  data-testid="input-enquiry-contact"
                  required
                  value={form.contact}
                  onChange={(e) => update('contact', e.target.value)}
                  className="input-field"
                  placeholder="Where can the team reply?"
                />
              </label>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <label className="text-sm">
                <span className="eyebrow text-[#4f463d]">Check in *</span>
                <input
                  data-testid="input-enquiry-check-in"
                  required
                  type="date"
                  value={form.checkIn}
                  onChange={(e) => update('checkIn', e.target.value)}
                  className="input-field"
                />
              </label>
              <label className="text-sm">
                <span className="eyebrow text-[#4f463d]">Check out *</span>
                <input
                  data-testid="input-enquiry-check-out"
                  required
                  type="date"
                  value={form.checkOut}
                  onChange={(e) => update('checkOut', e.target.value)}
                  className="input-field"
                />
              </label>
              <label className="text-sm">
                <span className="eyebrow text-[#4f463d]">Guests</span>
                <select
                  data-testid="select-enquiry-guests"
                  value={form.guests}
                  onChange={(e) => update('guests', e.target.value)}
                  className="input-field"
                >
                  {['1 guest', '2 guests', '3 guests', '4 guests'].map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block text-sm">
              <span className="eyebrow text-[#4f463d]">A note for the property</span>
              <textarea
                data-testid="textarea-enquiry-note"
                value={form.note}
                onChange={(e) => update('note', e.target.value)}
                className="input-field min-h-[75px] resize-y"
                placeholder="Arrival window, room questions, or anything useful..."
              />
            </label>
            <div className="flex flex-col justify-between gap-5 border-t border-[#cfc3b3] pt-6 md:flex-row md:items-center">
              <p className="max-w-sm text-[.8rem] leading-5 text-[#4f463d]">
                We take no payment and cannot hold a room. Nothing is reserved until you confirm on the official
                listing.
              </p>
              <button
                data-testid="button-submit-enquiry"
                type="submit"
                className="btn-sheen flex items-center justify-center gap-2 rounded-full bg-[#b8593f] px-6 py-4 text-sm font-bold text-[#f5f1e8] shadow-[0_8px_22px_rgba(184,89,63,.3)] transition-transform hover:-translate-y-1"
              >
                Prepare enquiry <Send size={15} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/**
 * Addressed by image src, not list index: the gallery filters its grid, so
 * an index would point at a different photograph once a filter is applied.
 * Arrow keys walk the full gallery in its canonical order.
 */
function Lightbox({ src, onClose, onChange }: { src: string | null; onClose: () => void; onChange: (next: string) => void }) {
  const index = src === null ? -1 : galleryImages.findIndex((image) => image.src === src);
  const trapRef = useFocusTrap<HTMLElement>(index >= 0);

  useEffect(() => {
    if (index < 0) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onChange(galleryImages[(index + 1) % galleryImages.length].src);
      if (event.key === 'ArrowLeft') onChange(galleryImages[(index - 1 + galleryImages.length) % galleryImages.length].src);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index, onChange, onClose]);

  if (index < 0) return null;
  const image = galleryImages[index];

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-[#24251f]/92 p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`${image.caption} — full screen`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <figure ref={trapRef} className="modal-sheet relative w-full max-w-5xl">
        <img
          src={asset(image.src)}
          alt={image.alt}
          width={1600}
          height={1067}
          className="max-h-[72dvh] w-full rounded-lg object-contain"
        />
        <figcaption className="mt-5 px-1 text-[#f3eee5]">
          <p className="eyebrow mb-2 text-[#f0c38e]">
            {String(index + 1).padStart(2, '0')} / {String(galleryImages.length).padStart(2, '0')} · {image.category}
          </p>
          <h2 className="font-display text-3xl md:text-4xl">{image.caption}</h2>
          <p className="mt-1 text-sm text-[#f5f1e8]/90">{image.note}</p>
        </figcaption>

        <button
          data-testid="button-lightbox-close"
          onClick={onClose}
          aria-label="Close gallery"
          className="absolute right-3 top-3 z-10 rounded-full border border-[#f3eee5]/60 bg-[#24251f]/60 p-2 text-[#f3eee5] transition-colors hover:bg-[#f3eee5] hover:text-[#252625]"
        >
          <X size={18} />
        </button>
        <button
          data-testid="button-lightbox-previous"
          onClick={() => onChange(galleryImages[(index - 1 + galleryImages.length) % galleryImages.length].src)}
          aria-label="Previous image"
          className="absolute left-2 top-[35%] z-10 rounded-full border border-[#f3eee5]/60 bg-[#24251f]/60 p-3 text-[#f3eee5] transition-colors hover:bg-[#f3eee5] hover:text-[#252625] md:left-3"
        >
          <ChevronLeft size={19} />
        </button>
        <button
          data-testid="button-lightbox-next"
          onClick={() => onChange(galleryImages[(index + 1) % galleryImages.length].src)}
          aria-label="Next image"
          className="absolute right-2 top-[35%] z-10 rounded-full border border-[#f3eee5]/60 bg-[#24251f]/60 p-3 text-[#f3eee5] transition-colors hover:bg-[#f3eee5] hover:text-[#252625] md:right-3"
        >
          <ChevronRight size={19} />
        </button>
      </figure>
    </div>
  );
}

function Home() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [prefill, setPrefill] = useState<Prefill>({});
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const openEnquiry = useCallback(() => setEnquiryOpen(true), []);

  useEffect(() => {
    const open = (event: Event) => {
      const detail = (event as CustomEvent<Prefill>).detail;
      if (detail) setPrefill(detail);
      setEnquiryOpen(true);
    };
    window.addEventListener('open-enquiry', open);
    return () => window.removeEventListener('open-enquiry', open);
  }, []);

  return (
    <div className="rosewood-page min-h-[100dvh]">
      <div className="noise-layer" />
      <Header onEnquire={openEnquiry} />
      <main>
        <Hero onEnquire={openEnquiry} />
        <About />
        <Room onEnquire={openEnquiry} />
        <Amenities />
        <Gallery onOpen={setLightboxSrc} />
        <Location />
        <Faq />
        <ContactCta onEnquire={openEnquiry} />
      </main>
      <Footer />
      <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} prefill={prefill} />
      <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} onChange={setLightboxSrc} />
    </div>
  );
}

function Router() {
  return (
    <ErrorBoundary resetKey={useLocation()[0]}>
      <Switch>
        <Route path="/" component={Home} />
        <Route
          component={() => (
            <div className="flex min-h-[100dvh] items-center justify-center bg-[#f3eee5] p-10 text-center">
              <div>
                <Sparkles className="mx-auto mb-4 text-[#b8593f]" />
                <h1 className="font-display text-5xl">A quiet wrong turn.</h1>
                <p className="mt-4 text-sm text-[#4f463d]">That page does not exist.</p>
                <a
                  data-testid="button-not-found-home"
                  href={import.meta.env.BASE_URL}
                  className="mt-7 inline-block rounded-full bg-[#24251f] px-5 py-3 text-sm text-[#f3eee5]"
                >
                  Return home
                </a>
              </div>
            </div>
          )}
        />
      </Switch>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
