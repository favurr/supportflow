'use client';

import { useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export default function VideoSection({ videoRef }: { videoRef: React.MutableRefObject<HTMLVideoElement | null> }) {
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const heroVideoUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4';

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = () => {
      video.currentTime = 0;
      video.play().catch(e => console.error('Video play failed:', e));
    };

    video.addEventListener('canplay', playVideo);

    const fadeIn = () => {
      video.style.opacity = '1';
    }

    video.addEventListener('timeupdate', () => {
      const remainingTime = video.duration - video.currentTime;
      if (remainingTime <= 0.55) {
        const fadeOut = () => {
          video.style.opacity = '0';
        }
        requestAnimationFrame(fadeOut);
      }
    });

    video.addEventListener('ended', () => {
      setTimeout(() => {
        video.currentTime = 0;
        video.play();
      }, 100);
    });

    return () => {
      video.removeEventListener('canplay', playVideo);
      video.removeEventListener('timeupdate', () => {});
      video.removeEventListener('ended', () => {});
    };
  }, []);

  return (
    <section className="relative overflow-hidden min-h-screen w-full">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover object-bottom"
        muted
        autoPlay
        playsInline
        preload="auto"
        src={heroVideoUrl}
      />
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]">
        <h1 className="text-7xl md:text-8xl lg:text-9xl text-white font-serif tracking-tight whitespace-nowrap">
          Know it then <em className="italic font-serif">all</em>
        </h1>
        <div className="max-w-xl w-full mt-8">
          <div className="liquid-glass rounded-full px-6 py-2 flex items-center gap-3">
            <input
              type="text"
              className="w-full px-4 py-2 border border-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Enter your email"
            />
            <button className="bg-white rounded-full p-3 text-black">
              <ArrowRight size="20" />
            </button>
          </div>
        </div>
        <p className="mt-4 text-white text-sm leading-relaxed px-4">
          Stay updated with the latest news and insights. Subscribe to our newsletter today and never miss out on exciting updates.
        </p>
        <button className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors mt-4">
          Sign Up
        </button>
      </div>
    </section>
  );
}