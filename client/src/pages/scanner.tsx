import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function Scanner() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [error, setError] = useState<string>();

  const saveScan = useMutation({
    mutationFn: async (qrId: string) => {
      return await apiRequest("POST", "/api/scanned", {
        qrId,
        scannedAt: new Date().toISOString()
      });
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
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1,
        rememberLastUsedCamera: true,
      },
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
          <h1 className="text-xl font-semibold">Scan QR Code</h1>
        </div>
      </header>

      <main className="container px-4 py-8">
        <Card className="max-w-2xl mx-auto overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="h-5 w-5" />
              <span>Camera Preview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {error && (
              <div className="flex items-center gap-2 text-destructive mb-4 p-4 rounded-lg bg-destructive/10">
                <AlertCircle className="h-4 w-4" />
                <p>{error}</p>
              </div>
            )}
            <div id="qr-reader" className="w-full [&_video]:rounded-lg" />
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Position the QR code within the frame to scan
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}