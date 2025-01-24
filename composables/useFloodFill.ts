interface Point {
  x: number;
  y: number;
}

export const floodFill = async (
  stage: any, 
  pos: { x: number, y: number }, 
  tolerance: number = 30,
  fillColor: string = '#0000FF'
): Promise<HTMLImageElement | null> => {
  // 현재 스테이지의 전체 상태를 캡처
  const dataURL = stage.toDataURL()
  const img = new Image()
  img.src = dataURL

  await new Promise(resolve => { img.onload = resolve })

  // 임시 캔버스 생성 및 현재 상태 그리기
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = stage.width()
  tempCanvas.height = stage.height()
  const ctx = tempCanvas.getContext('2d')
  if (!ctx) return null

  // 현재 스테이지 상태 그리기
  ctx.drawImage(img, 0, 0)

  // 현재 픽셀의 이미지 데이터 가져오기
  const imageData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
  const data = imageData.data
  const width = imageData.width
  const height = imageData.height
  
  // 시작 픽셀의 위치가 캔버스 범위를 벗어나면 중단
  const startX = Math.round(pos.x)
  const startY = Math.round(pos.y)
  if (startX < 0 || startX >= width || startY < 0 || startY >= height) {
    return null
  }

  // 방문한 픽셀을 추적하기 위한 Set
  const visited = new Set<string>()
  const stack = [[startX, startY]]
  
  // 시작 픽셀의 색상 가져오기
  const basePos = (startY * width + startX) * 4
  const baseR = data[basePos]
  const baseG = data[basePos + 1]
  const baseB = data[basePos + 2]
  const baseA = data[basePos + 3]

  // fillColor를 RGB로 변환
  const fillR = parseInt(fillColor.slice(1, 3), 16)
  const fillG = parseInt(fillColor.slice(3, 5), 16)
  const fillB = parseInt(fillColor.slice(5, 7), 16)

  // 색상 차이가 허용치 이내인지 확인하는 함수
  const checkTolerance = (r: number, g: number, b: number, a: number): boolean => {
    const diffR = Math.abs(r - baseR)
    const diffG = Math.abs(g - baseG)
    const diffB = Math.abs(b - baseB)
    const diffA = Math.abs(a - baseA)
    
    // tolerance를 0-100 범위의 퍼센트에서 실제 RGB 값 범위(0-255)로 변환
    const maxDiff = (tolerance / 100) * 255
    
    return diffR <= maxDiff && diffG <= maxDiff && diffB <= maxDiff && diffA <= maxDiff
  }

  // 새로운 캔버스 생성 (선택 영역만을 위한)
  const selectionCanvas = document.createElement('canvas')
  selectionCanvas.width = width
  selectionCanvas.height = height
  const selectionCtx = selectionCanvas.getContext('2d')
  if (!selectionCtx) return null

  // 배경을 투명하게 설정
  selectionCtx.clearRect(0, 0, width, height)

  // 선택 영역을 위한 이미지 데이터 생성
  const selectionImageData = selectionCtx.createImageData(width, height)
  const selectionData = selectionImageData.data

  while (stack.length > 0) {
    const [x, y] = stack.pop()!
    const key = `${x},${y}`
    
    // 이미 방문한 픽셀이면 건너뛰기
    if (visited.has(key)) continue
    visited.add(key)

    const pos = (y * width + x) * 4
    
    // 현재 픽셀의 색상이 허용 범위 내인지 확인
    if (checkTolerance(data[pos], data[pos + 1], data[pos + 2], data[pos + 3])) {
      // 선택한 영역에 색상 적용
      selectionData[pos] = fillR
      selectionData[pos + 1] = fillG
      selectionData[pos + 2] = fillB
      selectionData[pos + 3] = 128 // 반투명

      // 주변 픽셀 확인 (8방향)
      const neighbors = [
        [x + 1, y],     // 오른쪽
        [x - 1, y],     // 왼쪽
        [x, y + 1],     // 아래
        [x, y - 1],     // 위
        [x + 1, y + 1], // 오른쪽 아래
        [x + 1, y - 1], // 오른쪽 위
        [x - 1, y + 1], // 왼쪽 아래
        [x - 1, y - 1]  // 왼쪽 위
      ]

      for (const [nx, ny] of neighbors) {
        // 캔버스 범위를 벗어나면 건너뛰기
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue
        // 이미 방문한 픽셀이면 건너뛰기
        if (visited.has(`${nx},${ny}`)) continue
        stack.push([nx, ny])
      }
    }
  }

  // 선택 영역 이미지 데이터를 캔버스에 그리기
  selectionCtx.putImageData(selectionImageData, 0, 0)

  // 결과를 새 이미지로 변환
  const resultImage = new Image()
  resultImage.src = selectionCanvas.toDataURL()
  await new Promise(resolve => { resultImage.onload = resolve })

  return resultImage
} 