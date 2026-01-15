import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const dogImages = [
      'dog1.png', 'dog2.png', 'dog3.png', 'dog4.png', 'dog5.png',
      'dog6.png', 'dog7.png', 'dog8.png', 'dog9.png', 'dog10.png'
    ];
    
    const muffinImages = [
      'muffin1.png', 'muffin2.png', 'muffin3.png', 'muffin4.png', 'muffin5.png',
      'muffin6.png', 'muffin7.png', 'muffin8.png', 'muffin9.png', 'muffin10.png',
      'muffin11.png', 'muffin12.png', 'muffin13.png'
    ];

    const dogCount = Math.floor(Math.random() * 3) + 4; 
    const muffinCount = 9 - dogCount; 

    const shuffledDogs = [...dogImages].sort(() => 0.5 - Math.random());
    const shuffledMuffins = [...muffinImages].sort(() => 0.5 - Math.random());

    const selectedDogs = shuffledDogs.slice(0, dogCount);
    const selectedMuffins = shuffledMuffins.slice(0, muffinCount);

    const allImages = [
      ...selectedDogs.map(img => ({ image: img, type: 'dog' })),
      ...selectedMuffins.map(img => ({ image: img, type: 'muffin' }))
    ];

    const shuffledImages = allImages.sort(() => 0.5 - Math.random());

    const correctDogIndices = shuffledImages
      .map((item, index) => item.type === 'dog' ? index : -1)
      .filter(index => index !== -1);

    const response = {
      images: shuffledImages,
      correctDogIndices,
      timestamp: Date.now()
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error generating random captcha:', error);
    return NextResponse.json(
      { error: 'Failed to generate captcha' }, 
      { status: 500 }
    );
  }
}