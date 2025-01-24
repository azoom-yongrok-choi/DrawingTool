interface Point {
  x: number;
  y: number;
}

// RGBA 색상 비교를 위한 임계값
const COLOR_TOLERANCE = 80

// 두 색상의 유사도 비교
const colorMatch = (a: Uint8ClampedArray, b: Uint8ClampedArray): boolean => {
  return Math.abs(a[0] - b[0]) <= COLOR_TOLERANCE &&
         Math.abs(a[1] - b[1]) <= COLOR_TOLERANCE &&
         Math.abs(a[2] - b[2]) <= COLOR_TOLERANCE &&
         Math.abs(a[3] - b[3]) <= COLOR_TOLERANCE
}

// 4방향 플러드 필 알고리즘
export const floodFill = (
  imageData: ImageData,
  startX: number,
  startY: number,
  fillColor: { r: number, g: number, b: number, a: number }
): ImageData => {
  const pixels = imageData.data
  const width = imageData.width
  const height = imageData.height
  
  // 시작점의 색상
  const startPos = (startY * width + startX) * 4
  const startColor = new Uint8ClampedArray([
    pixels[startPos],
    pixels[startPos + 1],
    pixels[startPos + 2],
    pixels[startPos + 3]
  ])

  // 이미 채워진 픽셀을 추적하기 위한 배열
  const visited = new Set<string>()
  
  // 방문할 픽셀 스택
  const stack: Point[] = [{ x: startX, y: startY }]

  while (stack.length > 0) {
    const current = stack.pop()!
    const key = `${current.x},${current.y}`
    
    if (visited.has(key)) continue
    
    const pos = (current.y * width + current.x) * 4
    const currentColor = new Uint8ClampedArray([
      pixels[pos],
      pixels[pos + 1],
      pixels[pos + 2],
      pixels[pos + 3]
    ])

    if (!colorMatch(currentColor, startColor)) continue

    // 현재 픽셀 색상 변경
    pixels[pos] = fillColor.r
    pixels[pos + 1] = fillColor.g
    pixels[pos + 2] = fillColor.b
    pixels[pos + 3] = fillColor.a * 255

    visited.add(key)

    // 4방향 탐색
    const directions = [
      { x: 0, y: 1 },  // 아래
      { x: 0, y: -1 }, // 위
      { x: 1, y: 0 },  // 오른쪽
      { x: -1, y: 0 }  // 왼쪽
    ]

    for (const dir of directions) {
      const newX = current.x + dir.x
      const newY = current.y + dir.y

      if (
        newX >= 0 && newX < width &&
        newY >= 0 && newY < height &&
        !visited.has(`${newX},${newY}`)
      ) {
        stack.push({ x: newX, y: newY })
      }
    }
  }

  return imageData
} 