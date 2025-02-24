import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function Scanner() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [error, setError] = useState<string>();

  const saveScan = useMutation({
    mutationFn: async (qrId: string) => {
      try {
        const data = JSON.parse(qrId);
        return await apiRequest("POST", "/api/scanned", {
          qrId,
          data,
          scannedAt: new Date().toISOString(),
        });
      } catch {
        throw new Error("Invalid QR code format. Expected JSON data.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scanned"] });
      toast({
        title: "Success",
        description: "QR code scanned and saved successfully",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (qrId) => {
        scanner.clear();
        saveScan.mutate(qrId);
      },
      (error) => {
        console.error(error);
      }
    );

    return () => {
      scanner.clear();
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => setLocation("/")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          {error && (
            <div className="flex items-center gap-2 text-destructive mb-4">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}
          <div id="qr-reader" className="w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
