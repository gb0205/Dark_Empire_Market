
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default async function HomePage() {
  return (
    <div className="space-y-12">
      <section className="relative text-center py-16 md:py-24 rounded-lg shadow-xl overflow-hidden min-h-[60vh] flex flex-col justify-center items-center">
        <Image
          src="/images/home/epic-fleet.jpg"
          alt="Epic Imperial fleet in space"
          fill
          className="object-cover opacity-30 pointer-events-none"
          priority
        />
        <div className="relative z-10 p-6 bg-background/50 backdrop-blur-sm rounded-md max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-orbitron font-bold text-primary mb-6">
            Welcome to the Dark Empire Market
          </h1>
          <p className="text-xl md:text-2xl text-foreground/90 mb-8">
            Your premier destination for artifacts, weaponry, and essentials curated by the discerning agents of the Empire.
          </p>
          <Link href="/products" passHref>
            <Button size="lg" className="bg-primary hover:bg-primary/80 text-primary-foreground text-lg py-3 px-8 group">
              Explore the Imperial Arsenal <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-orbitron font-semibold text-primary mb-4">Power. Precision. Perfection.</h2>
            <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
              At the Dark Empire Market, we understand the needs of those who shape the galaxy.
              Our inventory is meticulously selected to ensure only the highest quality and most
              effective tools of power reach your hands. From advanced weaponry to rare artifacts,
              every item is an extension of Imperial might.
            </p>
            <Link href="/register" passHref>
              <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                Enlist for Exclusive Access
              </Button>
            </Link>
          </div>
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
             <Image
                src="/images/home/darth_vader.jpg"
                alt="Darth Vader, Sith Lord of the Galactic Empire"
                fill
                className="object-cover"
                priority
              />
          </div>
        </div>
      </section>

       <section className="py-12 text-center">
        <h2 className="text-3xl font-orbitron font-semibold text-accent mb-4">The Galaxy Awaits Your Command</h2>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">
          Equip yourself with the best the Empire has to offer. Our commitment to excellence is unwavering,
          just like your loyalty.
        </p>
         <Link href="/cart" passHref>
            <Button variant="secondary" size="lg">
              View Your Requisitions
            </Button>
          </Link>
      </section>
    </div>
  );
}
