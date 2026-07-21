import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ProductReport {
  name: string;
  currentStock: number;
  totalSold: number;
}

/**
 * Challenge 3: Product Inventory Report
 * 
 * TODO: Implement this endpoint to generate a product report.
 * 
 * Requirements:
 * - Get all products
 * - Include current stock_quantity
 * - Calculate total quantity sold from sales table
 * - Include products with 0 sales (never sold)
 * - Sort by totalSold in descending order
 * - Return format: { name, currentStock, totalSold }
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Implement your solution here
    // Step 1: Get all products with their stock
    // Step 2: For each product, calculate total quantity sold
    // Step 3: Aggregate sales data (sum of quantities)
    // Step 4: Combine the data
    // Step 5: Sort by totalSold descending
    // Step 6: Return formatted response

    const products = await prisma.product.findMany();
    const productReports: ProductReport[] = [];

    for (const product of products) {
      const totalSold = await prisma.sale.aggregate({
        where: { productId: product.id },
        _sum: { quantity: true }
      });

      productReports.push({
        name: product.name,
        currentStock: product.stockQuantity,
        totalSold: totalSold._sum.quantity || 0
      });
    }

    // Hint: Consider using:
    // - prisma.product.findMany()
    // - prisma.sale.groupBy() with _sum aggregation
    // - Or raw SQL for complex joins


    // Remove this and implement:
    return NextResponse.json(
      { data: productReports },
      { status: 200 }
    );
  } catch (error) {
    console.error('Challenge 3 Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
