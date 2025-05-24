export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 py-8 text-center text-sm text-foreground/60">
      <div className="container mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} Dark Empire Market. All rights reserved by the Galactic Empire.</p>
        <p className="mt-2">Serving the galaxy, one dark deed at a time.</p>
      </div>
    </footer>
  );
}
