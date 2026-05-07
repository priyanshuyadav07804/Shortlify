'use client';

import { useState } from 'react';
import { Link2, Shield, Zap, CopyIcon, CopyCheckIcon, ChevronRight, QrCodeIcon, DownloadIcon, PaletteIcon, Share2Icon } from 'lucide-react';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const [showQR, setShowQR] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [qrLoading, setQrLoading] = useState(false);
  const [qrStyle, setQrStyle] = useState('dark');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);
    setShowQR(false);

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ originalUrl: url })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to shorten URL');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result?.shortUrl) {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerateQR = async (styleKey = 'dark') => {
    if (!result?.shortUrl) return;
    setQrLoading(true);
    const styles = {
      dark: { dark: '#000000', light: '#ffffff' },
      blue: { dark: '#2563eb', light: '#ffffff' },
      purple: { dark: '#9333ea', light: '#ffffff' },
      emerald: { dark: '#059669', light: '#ffffff' }
    };

    try {
      const res = await fetch('/api/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: result.shortUrl,
          dark: styles[styleKey].dark,
          light: styles[styleKey].light
        })
      });
      const data = await res.json();
      if (res.ok) {
        setQrCodeUrl(data.qrCode);
        setQrStyle(styleKey);
        setShowQR(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setQrLoading(false);
    }
  };

  const handleDownloadQR = () => {
    if (!qrCodeUrl && !result?.qrCode) return;
    const urlToDownload = qrCodeUrl || result?.qrCode;
    const a = document.createElement('a');
    a.href = urlToDownload;
    a.download = `shortlify-qr-${qrStyle}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShareQR = async () => {
    const urlToShare = qrCodeUrl || result?.qrCode;
    if (!urlToShare) return;

    try {
      const response = await fetch(urlToShare);
      const blob = await response.blob();
      const file = new File([blob], `shortlify-qr-${qrStyle}.png`, { type: blob.type });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Shortlify QR Code',
          text: 'Check out my short link!',
          files: [file],
          url: result.shortUrl,
        });
      } else if (navigator.share) {
         await navigator.share({
          title: 'Shortlify Link',
          text: 'Check out my short link!',
          url: result.shortUrl,
        });
      } else {
        alert('Sharing is not supported on this browser.');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-10 py-12 md:py-20 flex flex-col items-center md:items-start justify-center md:justify-start">
      <div className="text-center mb-10 space-y-4 md:text-left md:w-full">
        <h1 className="text-4xl md:text-7xl font-bold leading-tight text-white mb-6">
          Simplify your links,<br className="hidden md:block"/>
          <span className="text-blue-400">Amplify your reach.</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto md:mx-0">
          Paste your long link and get a scannable QR code along with a simplified URL structure effortlessly.
        </p>
      </div>

      <div className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-2xl md:self-start">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 w-full">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Link2 className="h-6 w-6 text-slate-500" />
            </div>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-super-long-url.com/something-long..."
              className="w-full h-full bg-slate-900/50 border border-white/10 focus:ring-2 focus:ring-blue-500/40 rounded-[1.25rem] py-5 pl-14 pr-4 md:text-lg text-white placeholder:text-slate-600 outline-none transition-all shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !url}
            className="w-full md:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-[1.25rem] md:text-lg transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group whitespace-nowrap"
          >
            {loading ? 'Shortening...' : 'Shorten'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 text-red-400 text-sm rounded-xl border border-red-500/20 text-center">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:grid md:grid-cols-2 gap-8 items-center animate-in fade-in zoom-in-95 duration-500">
            <div className="space-y-4 w-full">
              <h3 className="text-xl font-bold tracking-tight text-white mb-2">Your Link is Ready!</h3>
              <p className="text-sm text-slate-400 break-all mb-4">
                You can find your short URL here, copy it and share it anywhere.
              </p>
              
              <div>
                <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Short URL</span>
                <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between gap-4">
                  <span className="font-mono text-blue-400 truncate text-lg font-bold">
                    {result.shortUrl}
                  </span>
                  <button
                    onClick={handleCopy}
                    className={`p-2 transition-all flex items-center gap-2 rounded-xl ${copied ? 'bg-green-500/10 text-green-400 border border-green-500/20 px-3' : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'}`}
                    aria-label="Copy URL"
                  >
                    {copied ? (
                      <>
                        <CopyCheckIcon className="h-4 w-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Copied!</span>
                      </>
                    ) : (
                      <CopyIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="h-full w-full rounded-[40px] bg-gradient-to-b from-white/10 to-transparent border border-white/10 p-1 backdrop-blur-3xl order-last">
              <div className="h-full w-full bg-slate-900/80 rounded-[36px] flex flex-col items-center justify-center p-6 sm:p-8">
                <div className="w-full flex items-center justify-between mb-6">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Result</span>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                  </div>
                </div>

                {!showQR ? (
                  <div className="flex flex-col items-center justify-center py-10">
                     <QrCodeIcon className="h-16 w-16 text-slate-700 mb-6" />
                     <p className="text-slate-400 font-medium mb-6 text-center text-sm">Need a QR Code for physical sharing?</p>
                     <button
                       onClick={() => handleGenerateQR('dark')}
                       disabled={qrLoading}
                       className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-50 flex items-center gap-2 text-sm"
                     >
                       {qrLoading ? 'Generating...' : 'Generate QR Code'}
                     </button>
                  </div>
                ) : (
                  <>
                    <div className="p-3 sm:p-4 bg-white rounded-[2rem] shadow-[0_0_50px_rgba(59,130,246,0.3)] mb-6 relative group w-full max-w-[260px] mx-auto">
                      <img
                        src={qrCodeUrl || result.qrCode}
                        alt="QR Code"
                        className="w-full h-auto aspect-square object-contain mix-blend-multiply transition-all group-hover:opacity-50"
                      />
                      <button onClick={handleDownloadQR} className="absolute inset-0 bg-black/10 rounded-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/40 p-4 rounded-full backdrop-blur-sm cursor-pointer hover:bg-black/60 transition-colors shadow-xl">
                          <DownloadIcon className="h-8 w-8 text-white" />
                        </div>
                      </button>
                    </div>

                    <div className="flex flex-col items-center gap-3 w-full max-w-[200px]">
                      <div className="flex items-center gap-2 mb-1">
                         <PaletteIcon className="w-3 h-3 text-slate-400" />
                         <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">QR Style</span>
                      </div>
                      <div className="flex gap-3 mb-6">
                        {['dark', 'blue', 'purple', 'emerald'].map((style) => (
                           <button
                             key={style}
                             onClick={() => handleGenerateQR(style)}
                             disabled={qrLoading}
                             className={`w-8 h-8 rounded-full transition-all ${qrStyle === style ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-white scale-110' : 'opacity-60 hover:opacity-100 disabled:opacity-50'} ${
                               style === 'dark' ? 'bg-slate-950 border border-white/20' : 
                               style === 'blue' ? 'bg-blue-600' : 
                               style === 'purple' ? 'bg-purple-600' : 
                               'bg-emerald-600'
                             }`}
                             aria-label={`Set QR style to ${style}`}
                           />
                        ))}
                      </div>

                      <button 
                        onClick={handleDownloadQR}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-500/20 transition-all text-xs font-bold uppercase tracking-wider text-white flex justify-center items-center gap-2"
                      >
                         <DownloadIcon className="w-4 h-4" /> Download QR
                      </button>
                      <button 
                        onClick={handleShareQR}
                        className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all text-xs font-bold uppercase tracking-wider text-slate-300 flex justify-center items-center gap-2"
                      >
                         <Share2Icon className="w-4 h-4" /> Share
                      </button>
                    </div>
                  </>
                )}

                <div className="mt-8 w-full pt-6 border-t border-white/5">
                  <div className="flex items-center justify-between p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Shield className="h-4 w-4 text-blue-400" />
                      </div>
                      <span className="text-[10px] sm:text-xs text-blue-400 font-medium">Secured by MongoDB</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Live Status</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <section id="features" className="mt-24 md:mt-32 w-full max-w-7xl mx-auto md:self-start">
        <div className="mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Why Choose Shortlify?</h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed">Shortlify is the most robust, lightning-fast URL shortener designed to make your long links manageable, highly trackable, and easy to share with customizable dynamic QR codes.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/5 p-8 rounded-[2rem] backdrop-blur-md hover:bg-white/10 transition-colors">
            <div className="bg-blue-500/10 p-4 rounded-2xl text-blue-400 shadow-lg shadow-blue-500/5 mb-6 inline-flex">
              <Zap className="h-7 w-7" />
            </div>
            <h3 className="font-semibold text-xl text-slate-200 mb-3">Lightning Fast</h3>
            <p className="text-slate-400 leading-relaxed">Powered by a globally distributed network and Next.js, our URL redirects happen within milliseconds ensuring zero delays for your users.</p>
          </div>
          <div className="bg-white/5 border border-white/5 p-8 rounded-[2rem] backdrop-blur-md hover:bg-white/10 transition-colors">
            <div className="bg-purple-500/10 p-4 rounded-2xl text-purple-400 shadow-lg shadow-purple-500/5 mb-6 inline-flex">
              <QrCodeIcon className="h-7 w-7" />
            </div>
            <h3 className="font-semibold text-xl text-slate-200 mb-3">Custom QR Codes</h3>
            <p className="text-slate-400 leading-relaxed">Don&apos;t just shorten links—create engaging QR codes with dark, blue, purple, or emerald themes that stand out anywhere.</p>
          </div>
          <div className="bg-white/5 border border-white/5 p-8 rounded-[2rem] backdrop-blur-md hover:bg-white/10 transition-colors">
            <div className="bg-emerald-500/10 p-4 rounded-2xl text-emerald-400 shadow-lg shadow-emerald-500/5 mb-6 inline-flex">
              <Shield className="h-7 w-7" />
            </div>
            <h3 className="font-semibold text-xl text-slate-200 mb-3">Secure Defaults</h3>
            <p className="text-slate-400 leading-relaxed">Every short link utilizes cryptographic entropy for maximum security, uniqueness, and data privacy preventing unauthorized link enumeration.</p>
          </div>
        </div>
      </section>

      <section id="faq" className="mt-24 md:mt-32 w-full max-w-4xl mx-auto md:self-start mb-24">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 text-center md:text-left">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: 'Is Shortlify completely free to use?', a: 'Yes! Our core features including limitless URL shortening and QR code downloading are entirely free for all users.' },
            { q: 'Do my shortened links ever expire?', a: 'No, generated short links are permanent and do not expire as long as our service is running.' },
            { q: 'Can I customize my QR code?', a: 'Absolutely. Once your short link is generated, you can swap between multiple color palettes and download a high-res image directly.' },
            { q: 'How does the underlying technology work?', a: 'We process your long URL, generate a unique Base64Url hash, and securely map it in our robust MongoDB backend. When visitors interact with the short URL, they are instantly redirected.' },
          ].map((faq, i) => (
            <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/5">
              <h4 className="text-lg font-semibold text-slate-200 mb-2">{faq.q}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
