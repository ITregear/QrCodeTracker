import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Clock, Grid } from "lucide-react";
import type { ScannedData } from "@shared/schema";

export default function Home() {
  const { data: scannedItems, isLoading } = useQuery<ScannedData[]>({
    queryKey: ["/api/scanned"],
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center space-x-4">
            <Grid className="h-6 w-6" />
            <h1 className="text-xl font-semibold">QR Scanner</h1>
          </div>
          <div className="ml-auto">
            <Link href="/scanner">
              <Button className="shadow-lg hover:shadow-xl transition-all">
                <QrCode className="mr-2 h-4 w-4" />
                Scan New Code
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded" />
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded" />
                </CardContent>
              </Card>
            ))
          ) : scannedItems?.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <QrCode className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Scans Yet</h2>
              <p className="text-muted-foreground">
                Start by scanning your first QR code
              </p>
            </div>
          ) : (
            scannedItems?.map((item) => (
              <Card key={item.id} className="overflow-hidden backdrop-blur-sm bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span>QR ID: {item.qrId}</span>
                    <Clock className="h-4 w-4 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted/50 p-4 rounded-lg overflow-auto max-h-40 text-sm">
                    {JSON.stringify(item.data, null, 2)}
                  </pre>
                  <p className="text-sm text-muted-foreground mt-4 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(item.scannedAt).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}