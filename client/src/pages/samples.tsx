import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { useLocation } from "wouter";

const sampleData = [
  {
    productId: "MS-PRODUCT-001",
    name: "Surface Laptop 4",
    category: "Computers",
    price: 99999, // Stored in cents
    imageUrl: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RWBrzy?ver=85d4",
    specs: {
      processor: "AMD Ryzen 5",
      ram: "8GB",
      storage: "256GB SSD"
    }
  },
  {
    productId: "MS-PRODUCT-002",
    name: "Xbox Series X",
    category: "Gaming",
    price: 49999,
    imageUrl: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RWFauV?ver=b4f5",
    specs: {
      storage: "1TB SSD",
      resolution: "4K",
      features: ["Ray Tracing", "Quick Resume"]
    }
  },
  {
    productId: "MS-PRODUCT-003",
    name: "Microsoft 365",
    category: "Software",
    price: 6999,
    imageUrl: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4OAgf?ver=bec4",
    specs: {
      type: "Annual",
      includes: ["Word", "Excel", "PowerPoint", "Teams"]
    }
  }
];

export default function Samples() {
  const [, setLocation] = useLocation();

  const downloadQRCode = (productId: string) => {
    const imgElement = document.querySelector(`#qr-${productId}`) as HTMLImageElement;
    if (!imgElement) return;

    const link = document.createElement('a');
    link.download = `${productId}-qr.png`;
    link.href = imgElement.src;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4">
          <Button
            variant="ghost"
            className="mr-4"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold">Sample QR Codes</h1>
        </div>
      </header>

      <main className="container px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sampleData.map((item) => (
            <Card key={item.productId}>
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  id={`qr-${item.productId}`}
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                    item.productId
                  )}`}
                  alt={`QR Code for ${item.name}`}
                  className="w-full h-auto mb-4"
                />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => downloadQRCode(item.productId)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code
                </Button>
                <pre className="mt-4 bg-muted/50 p-4 rounded-lg overflow-auto max-h-40 text-sm">
                  {JSON.stringify(item.specs, null, 2)}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}