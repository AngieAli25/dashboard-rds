import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    const transformedMembers = teamMembers.map((member) => ({
      id: member.id,
      name: member.name,
      role: member.role as 'developer' | 'seo',
      active: member.active,
      created_at: member.createdAt.toISOString(),
      updated_at: member.updatedAt.toISOString(),
    }));

    return NextResponse.json(transformedMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const member = await prisma.teamMember.create({
      data: {
        name: body.name,
        role: body.role,
        active: body.active ?? true,
      },
    });

    return NextResponse.json({
      id: member.id,
      name: member.name,
      role: member.role,
      active: member.active,
      created_at: member.createdAt.toISOString(),
      updated_at: member.updatedAt.toISOString(),
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    );
  }
}
