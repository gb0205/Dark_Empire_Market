import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center px-4">
      <AlertTriangle className="h-24 w-24 text-destructive mb-6" />
      <h1 className="text-5xl font-orbitron font-bold text-primary mb-4">404 - Sector Not Found</h1>
      <p className="text-xl text-foreground/80 mb-2">
        The Imperial Navcomputer could not find the requested sector.
      </p>
      <p className="text-md text-muted-foreground mb-8 max-w-md">
        Perhaps these coordinates are in uncharted territory, or maybe a rebel spy has tampered with the data.
        Return to the known galaxy.
      </p>
      <Link href="/" passHref>
        <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Return to Imperial Holonet
        </Button>
      </Link>
    </div>
  )
}
