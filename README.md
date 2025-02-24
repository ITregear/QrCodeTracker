# QR Code Product Scanner

A web-based QR code scanner application that retrieves product information from a PostgreSQL database using unique product identifiers. This application allows you to scan QR codes, view product details, and manage your product catalog.

## Features

### 1. Product Scanning
![QR Scanner](https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RWBrzy?ver=85d4)

- Access the scanner through the "Scan New Code" button
- Point your device's camera at a product QR code
- View detailed product information instantly after scanning
- Automatic history tracking of all scanned items

### 2. Product Management
- Add new products to the database
- Generate unique QR codes for each product
- Download QR codes for printing or sharing
- View comprehensive product details including:
  - Product name and category
  - Price information
  - Product specifications
  - High-quality product images

### 3. Scan History
- Track all previously scanned items
- View scan timestamps
- Access full product details from scan history
- Organized display of product specifications

## Getting Started

### Prerequisites
1. Node.js (v18 or higher)
2. PostgreSQL database
3. Modern web browser with camera access

### Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd qr-code-scanner
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
- Create a PostgreSQL database
- Set the DATABASE_URL environment variable:
```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

4. Initialize the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Usage Guide

### Adding a New Product

1. Click "Add New Product" in the navigation bar
2. Fill in the required fields:
   - Product Name
   - Category
   - Price
   - Image URL
   - Specifications (in JSON format)
3. Click "Save Product"
4. Download the generated QR code for the product

### Scanning Products

1. Click "Scan New Code" in the navigation bar
2. Allow camera access when prompted
3. Point your camera at a product QR code
4. View the product details after successful scan

### Viewing Sample QR Codes

1. Click "View Sample QR Codes" in the navigation bar
2. Browse through available sample products
3. Download QR codes for testing

### Viewing Scan History

1. Navigate to the home page
2. View all previously scanned products
3. Each entry shows:
   - Product image
   - Name and category
   - Price
   - Scan timestamp
   - Detailed specifications

## Notes

- All prices are stored in cents and displayed in dollars
- Product specifications should be provided in valid JSON format
- QR codes are automatically generated using the product ID
- The scanner works best in well-lit conditions
