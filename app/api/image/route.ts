import { promises as fs } from "fs"
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'

export async function GET(req: NextRequest) {
    try {
        console.log("API route accessed");
        
        // Use path.join for proper path handling
        const imagePath = path.join(process.cwd(), 'public', 'dogs-and-muffins', 'dog1.png');
        
        // Use async version of fs to avoid blocking
        const imageBuffer = await fs.readFile(imagePath);
        
        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=86400', // Cache for 1 day
            },
        });
    } catch (error) {
        console.error('Error reading image:', error);
        return new NextResponse('Image not found', { 
            status: 404,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }
}