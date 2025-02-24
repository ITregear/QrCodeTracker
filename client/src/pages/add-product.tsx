import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Download, Plus } from "lucide-react";
import { insertProductSchema, type InsertProduct } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AddProduct() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>();

  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      productId: "",
      name: "",
      category: "",
      price: 0,
      imageUrl: "",
      specs: {},
    },
  });

  const saveProduct = useMutation({
    mutationFn: async (data: InsertProduct) => {
      // Generate a unique product ID if not provided
      if (!data.productId) {
        data.productId = `PROD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }

      // Convert price to cents
      data.price = Math.round(Number(data.price) * 100);

      // Ensure specs is an object
      if (typeof data.specs === 'string') {
        try {
          data.specs = JSON.parse(data.specs);
        } catch (e) {
          throw new Error('Invalid JSON format for specifications');
        }
      }

      const response = await apiRequest("POST", "/api/products", data);
      // Generate QR code URL
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.productId)}`;
      setQrCodeUrl(qrUrl);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: "Product added successfully",
      });
    },
  });

  const onSubmit = (data: InsertProduct) => {
    saveProduct.mutate(data);
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${form.getValues().productId}-qr.png`;
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
          <h1 className="text-xl font-semibold">Add New Product</h1>
        </div>
      </header>

      <main className="container px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Product Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com/image.jpg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specifications (JSON)</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field}
                          value={typeof field.value === 'object' ? JSON.stringify(field.value, null, 2) : field.value}
                          placeholder={`{
  "processor": "Intel i7",
  "memory": "16GB",
  "storage": "512GB SSD"
}`}
                          className="font-mono min-h-[150px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Save Product
                </Button>
              </form>
            </Form>

            {qrCodeUrl && (
              <div className="mt-8 text-center">
                <h3 className="font-semibold mb-4">Generated QR Code</h3>
                <img
                  src={qrCodeUrl}
                  alt="Product QR Code"
                  className="mx-auto mb-4"
                />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={downloadQRCode}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}