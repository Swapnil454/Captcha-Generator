import { promises as fs } from "fs"
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    
    const imageName = searchParams.get('image');
    
    if (!imageName) {
      return new NextResponse('Image name required', { 
        status: 400,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    if (imageName.includes('..') || imageName.includes('/') || imageName.includes('\\')) {
      return new NextResponse('Invalid image name', { 
        status: 400,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    const imagePath = path.join(process.cwd(), 'public', 'dogs-and-muffins', imageName);
    
    try {
      await fs.access(imagePath);
    } catch {
      const fallbackPath = path.join(process.cwd(), 'public', 'dogs-and-muffins', 'dog1.png');
      try {
        const fallbackBuffer = await fs.readFile(fallbackPath);
        return new NextResponse(fallbackBuffer, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=86400',
          },
        });
      } catch {
        return new NextResponse('Image not found', { 
          status: 404,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    }
    
    const imageBuffer = await fs.readFile(imagePath);
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
      },
    });
    
  } catch (error) {
    console.error('Error serving captcha image:', error);
    return new NextResponse('Internal server error', { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}