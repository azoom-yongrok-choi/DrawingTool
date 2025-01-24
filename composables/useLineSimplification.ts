// 점과 선분 사이의 수직 거리 계산
const perpendicularDistance = (point: number[], lineStart: number[], lineEnd: number[]): number => {
  const [x, y] = point
  const [x1, y1] = lineStart
  const [x2, y2] = lineEnd

  const area = Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1)
  const bottom = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2))
  return area / bottom
}

// Douglas-Peucker 알고리즘 구현
const douglasPeucker = (points: number[], epsilon: number): number[] => {
  if (points.length < 4) return points

  let maxDistance = 0
  let maxIndex = 0
  
  // 시작점과 끝점
  const start = [points[0], points[1]]
  const end = [points[points.length - 2], points[points.length - 1]]

  // 모든 중간점에 대해 시작-끝 선분과의 거리 계산
  for (let i = 2; i < points.length - 2; i += 2) {
    const distance = perpendicularDistance(
      [points[i], points[i + 1]],
      start,
      end
    )

    if (distance > maxDistance) {
      maxDistance = distance
      maxIndex = i
    }
  }

  // 최대 거리가 임계값보다 크면 재귀적으로 분할
  if (maxDistance > epsilon) {
    const firstHalf = douglasPeucker(points.slice(0, maxIndex + 2), epsilon)
    const secondHalf = douglasPeucker(points.slice(maxIndex, points.length), epsilon)
    return firstHalf.slice(0, -2).concat(secondHalf)
  }

  // 임계값보다 작으면 시작점과 끝점만 반환
  return [...start, ...end]
}

export const simplifyLine = (points: number[], epsilon: number = 1): number[] => {
  return douglasPeucker(points, epsilon)
} 