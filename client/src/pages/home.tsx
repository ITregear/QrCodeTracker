import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Clock, Grid, Plus } from "lucide-react";
import type { ScannedData, Product } from "@shared/schema";

type ScannedDataWithProduct = ScannedData & { product: Product };

function formatSpecification(specs: Record<string, any>): JSX.Element {
  return (
    <div className="space-y-2">
      {Object.entries(specs).map(([key, value]) => (
        <div key={key} className="flex items-start justify-between gap-4">
          <span className="font-medium capitalize">{key.replace(/_/g, ' ')}</span>
          <span className="text-right">
            {Array.isArray(value) ? (
              <div className="flex flex-wrap justify-end gap-1">
                {value.map((item, i) => (
                  <span key={i} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-sm">
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground">{value}</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const { data: scannedItems, isLoading } = useQuery<ScannedDataWithProduct[]>({
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
          <div className="ml-auto flex gap-4">
            <Link href="/add-product">
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add New Product
              </Button>
            </Link>
            <Link href="/samples">
              <Button variant="outline">
                <QrCode className="mr-2 h-4 w-4" />
                View Sample QR Codes
              </Button>
            </Link>
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
                  <div className="h-48 bg-muted rounded mb-4" />
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
                    <span>{item.product.name}</span>
                    <Clock className="h-4 w-4 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative h-48 mb-4">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="absolute inset-0 w-full h-full object-contain bg-white/50 backdrop-blur-sm rounded-lg"
                    />
                  </div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-medium">{item.product.category}</p>
                      <p className="text-xl font-bold">
                        ${(item.product.price / 100).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Scanned
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.scannedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-medium mb-2">Specifications</p>
                    {formatSpecification(item.product.specs)}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}