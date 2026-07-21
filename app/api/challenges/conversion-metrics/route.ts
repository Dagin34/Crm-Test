import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ConversionMetrics {
  totalLeads: number;
  convertedLeads: number;
  conversionRate: number; // percentage, rounded to 2 decimals
  averageLeadScore: number;
}

/**
 * Challenge 4: Lead Conversion Metrics (BONUS)
 * 
 * TODO: Implement this endpoint to calculate lead conversion metrics.
 * 
 * Requirements:
 * - Count total leads in the database
 * - Count leads with status "Converted"
 * - Calculate conversion rate as percentage (convertedLeads / totalLeads * 100)
 * - Calculate average lead score across all leads
 * - Round conversionRate to 2 decimal places
 * - Return format: { totalLeads, convertedLeads, conversionRate, averageLeadScore }
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Implement your solution here
    // Step 1: Get total count of leads
    // Step 2: Get count of converted leads (status = 'Converted')
    // Step 3: Calculate conversion rate
    // Step 4: Get average lead score
    // Step 5: Return formatted response

    const leads = await prisma.lead.findMany();
    const totalLeads = leads.length;
    const convertedLeads = leads.filter(lead => lead.status === 'Converted').length;
    const conversionRate = totalLeads > 0 ? parseFloat(((convertedLeads / totalLeads) * 100).toFixed(2)) : 0;

    const averageLeadScore = totalLeads > 0 ? parseFloat((leads.reduce((sum, lead) => sum + lead.score, 0) / totalLeads).toFixed(2)) : 0;

    const response: ConversionMetrics = {
      totalLeads,
      convertedLeads,
      conversionRate,
      averageLeadScore
    }

    return NextResponse.json(
      { data: response },
      { status: 200 }
    );
  } catch (error) {
    console.error('Challenge 4 Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
