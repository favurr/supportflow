import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { ArrowRight, Discord, GitHub, Twitter } from 'lucide-react';
import { CSSMotion } from 'framer-motion';
import VideoSection from './components/hero';
import DashboardLayout from './dashboard/layout';

const Home = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {})
        .then(() => {
          video.style.opacity = '1';
        })
        .then(() => {
          const fadeOut = () => {
            video.style.opacity = '0';
          };
          requestAnimationFrame(fadeOut);
        });

      video.addEventListener('timeupdate', () => {
        const remainingTime = video.duration - video.currentTime;
        if (remainingTime <= 0.55) {
          const fadeOut = () => {
            video.style.opacity = '0';
          };
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
        video.removeEventListener('timeupdate', () => {})
        video.removeEventListener('ended', () => {})
      }
    }
  }, []);

  return (
    <DashboardLayout>
      {children}
      <VideoSection videoRef={videoRef} />
      <div className="max-w-6xl mx-auto px-6 py-6 md:py-12 text-center space-y-6 -translate-y-[20%]">
        <div className="max-w-2xl w-full md:max-w-none mx-auto text-center text-foreground">
          <h1 className="text-7xl md:text-8xl lg:text-9xl text-white font-semibold">Know it then</h1>
          <em className="italic">all</em>
        </div>

        <div className="max-w-xl w-full md:max-w-none mx-auto p-6 pr-2 py-2 flex items-center gap-3">
          <input type="text" className="w-full px-4 py-2 border border-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white" placeholder="Enter your email"/>
          <button className="bg-white rounded-full p-3 text-black rounded-full text-sm font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15.91 12.09c-2.56-2.57-6.42-5.18-10.4 0S6.52 16.49 12 15C17.48 15 22 17.48 22 22c0 4.42-3.58 8-8 8S6 28 6 24c0-1.1-.54-2.5-.91-3.81"/></svg>
          </button>
        </div>

        <div className="text-white text-sm leading-relaxed px-4">
          Stay updated with the latest news and insights. Subscribe to our newsletter today and never miss out on exciting updates.
        </div>
      </div>

      <div className="flex justify-center gap-4 pb-12">
        <Button variant="outline" className="rounded-full p-4 lg:p-5 transition">
          <Discord size="20"/>
          Discord</Button>
        <Button variant="outline" className="rounded-full p-4 lg:p-5 transition">
          <GitHub size="20"/>
          GitHub</Button>
        <Button variant="outline" className="rounded-full p-4 lg:p-5 transition">
          <Twitter size="20"/>
          Twitter</Button>
      </div>
    </DashboardLayout>
  );
}

export default Home;