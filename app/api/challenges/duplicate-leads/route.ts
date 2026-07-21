import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface DuplicateLeadResult {
  email: string | null;
  leadIds: string | null;
}

/**
 * Challenge 2: Find Duplicate Lead Emails
 * 
 * TODO: Implement this endpoint to find emails that appear multiple times in the leads table.
 * 
 * Requirements:
 * - Find emails that appear 2 or more times
 * - For each duplicate email, list all the lead IDs (comma-separated)
 * - Return format: { email, leadIds: "1,2,3" }
 * - Handle edge cases (no duplicates, null emails)
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Implement your solution here
    // Step 1: Group leads by email
    // Step 2: Count occurrences of each email
    // Step 3: Filter for emails with count >= 2
    // Step 4: Collect the lead IDs for each email
    // Step 5: Return formatted response
    const groupedLeads = await prisma.lead.groupBy({
      by: ['email'],
      _count: { id: true }
    });
    const filteredLeads = groupedLeads.filter(group => group._count.id >= 2 && group.email !== null);
    const duplicateLeadResults: DuplicateLeadResult[] = [];

    for (const group of filteredLeads) {
      const leads = await prisma.lead.findMany({
        where: { email: group.email }
      });
      duplicateLeadResults.push({
        email: group.email,
        leadIds: leads.map(lead => lead.id).join(', ')
      });
    }

    return NextResponse.json(
      { data: duplicateLeadResults },
      { status: 200 }
    );
  } catch (error) {
    console.error('Challenge 2 Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
