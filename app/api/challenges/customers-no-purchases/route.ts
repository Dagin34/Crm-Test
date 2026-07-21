import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Challenge 1: Find Customers Without Purchases
 * 
 * TODO: Implement this endpoint to return all customers who have never made a purchase.
 * 
 * Requirements:
 * - Find customers in the database
 * - Filter for those with NO sales records
 * - Return only: id, name, email
 * - Handle any errors gracefully
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Implement your solution here
    // Step 1: Query all customers
    // Step 2: Filter those without any sales
    // Step 3: Return the filtered list

    const customers = await prisma.customer.findMany();

    if (!customers || customers.length === 0) {
      return NextResponse.json(
        { data: 'There are no Customers!' },
        { status: 200 }
      );
    }

    const sales = await prisma.sale.findMany();
    const withoutPurchases = customers.filter(customer => !sales.some(sale => sale.customerId === customer.id));
    const result = withoutPurchases.map(customer => ({
      id: customer.id,
      name: customer.name,
      email: customer.email
    }));

    return NextResponse.json(
      { data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error('Challenge 1 Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
