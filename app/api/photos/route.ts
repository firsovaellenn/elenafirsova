import { NextRequest, NextResponse } from "next/server";
import { isDatabaseAvailable } from "@/lib/db";
import { createPhoto, getAllPhotos, deletePhoto } from "@/lib/models";
import { mockPhotos } from "@/lib/mock-data";
import { z } from "zod";

export const dynamic = "force-static";

const createPhotoSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  width: z.number().positive().default(800),
  height: z.number().positive().default(1000),
  order: z.number().int().nonnegative().default(0),
});

export async function GET() {
  const dbAvailable = await isDatabaseAvailable();

  if (!dbAvailable) {
    return NextResponse.json({ photos: mockPhotos });
  }

  try {
    const uploaded = await getAllPhotos();
    return NextResponse.json({ photos: uploaded });
  } catch {
    return NextResponse.json({ photos: mockPhotos });
  }
}

export async function POST(request: NextRequest) {
  const dbAvailable = await isDatabaseAvailable();

  if (!dbAvailable) {
    return NextResponse.json(
      { error: "База данных недоступна" },
      { status: 503 }
    );
  }

  const parsed = createPhotoSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Некорректные данные", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const photo = await createPhoto({
    id: `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ...parsed.data,
  });

  return NextResponse.json({ photo }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const dbAvailable = await isDatabaseAvailable();

  if (!dbAvailable) {
    return NextResponse.json(
      { error: "База данных недоступна" },
      { status: 503 }
    );
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Не указан id фото" }, { status: 400 });
  }

  await deletePhoto(id);
  return NextResponse.json({ success: true });
}
