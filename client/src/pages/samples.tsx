import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sampleData = [
  {
    qrId: "MS-PRODUCT-001",
    data: {
      name: "Surface Laptop 4",
      category: "Computers",
      price: 999.99,
      specs: {
        processor: "AMD Ryzen 5",
        ram: "8GB",
        storage: "256GB SSD"
      }
    }
  },
  {
    qrId: "MS-PRODUCT-002",
    data: {
      name: "Xbox Series X",
      category: "Gaming",
      price: 499.99,
      specs: {
        storage: "1TB SSD",
        resolution: "4K",
        features: ["Ray Tracing", "Quick Resume"]
      }
    }
  },
  {
    qrId: "MS-PRODUCT-003",
    data: {
      name: "Microsoft 365",
      category: "Software",
      price: 69.99,
      subscription: {
        type: "Annual",
        includes: ["Word", "Excel", "PowerPoint", "Teams"]
      }
    }
  }
];

export default function Samples() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4">
          <h1 className="text-xl font-semibold">Sample QR Codes</h1>
        </div>
      </header>

      <main className="container px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sampleData.map((item) => (
            <Card key={item.qrId}>
              <CardHeader>
                <CardTitle>{item.qrId}</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                    JSON.stringify(item)
                  )}`}
                  alt={`QR Code for ${item.qrId}`}
                  className="w-full h-auto"
                />
                <pre className="mt-4 bg-muted/50 p-4 rounded-lg overflow-auto max-h-40 text-sm">
                  {JSON.stringify(item.data, null, 2)}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
