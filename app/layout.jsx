import './globals.css';
import MouseTracker from './components/MouseTracker';
import ScrollToTop from './components/ScrollToTop';

export const metadata = {
  title: 'Shortlify - URL Shortener',
  description: 'A URL shortener and QR code generator built with Next.js and MongoDB.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body suppressHydrationWarning className="antialiased min-h-screen bg-slate-950 font-sans relative overflow-x-hidden text-slate-100 flex flex-col">
        <MouseTracker />
        <ScrollToTop />
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="fixed top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
        
        <nav id="top" className="h-20 px-6 md:px-10 flex flex-shrink-0 items-center justify-between border-b border-white/5 backdrop-blur-xl bg-white/5 z-10 w-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            </div>
            <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Shortlify</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
        </nav>
        
        {children}
      </body>
    </html>
  );
}
