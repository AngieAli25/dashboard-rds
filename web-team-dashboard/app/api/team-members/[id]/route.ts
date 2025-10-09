import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const member = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!member) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: member.id,
      name: member.name,
      role: member.role,
      active: member.active,
      created_at: member.createdAt.toISOString(),
      updated_at: member.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Error fetching team member:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team member' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.role !== undefined) updateData.role = body.role;
    if (body.active !== undefined) updateData.active = body.active;

    const member = await prisma.teamMember.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      id: member.id,
      name: member.name,
      role: member.role,
      active: member.active,
      created_at: member.createdAt.toISOString(),
      updated_at: member.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      { error: 'Failed to update team member' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    await prisma.teamMember.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 204 });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json(
      { error: 'Failed to delete team member' },
      { status: 500 }
    );
  }
}
