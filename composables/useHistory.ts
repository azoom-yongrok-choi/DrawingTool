export type LineItem = {
  id: number;
  type: 'line';
  points: number[];
  color?: string;
  width?: number;
}

export type MagicWandItem = {
  id: number;
  type: 'magicwand';
  image: HTMLImageElement;
  color: string;
}

export type DrawingItem = LineItem | MagicWandItem;

class DrawingHistory {
  private history: DrawingItem[][] = []
  private currentIndex = 0

  constructor() {
    // 초기 빈 상태 추가
    this.history.push([])
  }

  get canUndo(): boolean {
    return this.currentIndex > 0
  }

  get canRedo(): boolean {
    return this.currentIndex < this.history.length - 1
  }

  push(state: DrawingItem[]) {
    // 현재 상태가 마지막 상태와 동일하다면 무시
    if (this.currentIndex >= 0 && 
        JSON.stringify(this.history[this.currentIndex]) === JSON.stringify(state)) {
      return
    }

    // 현재 상태의 깊은 복사본 생성
    const deepCopy = state.map(item => {
      if (item.type === 'line') {
        return {
          ...item,
          points: [...item.points],
        } as LineItem
      } else {
        return {
          ...item,
        } as MagicWandItem
      }
    })

    // 현재 인덱스 이후의 기록 삭제
    this.history = this.history.slice(0, this.currentIndex + 1)
    
    // 새로운 상태 추가
    this.history.push(deepCopy)
    this.currentIndex++
  }

  undo(): DrawingItem[] {
    if (this.canUndo) {
      this.currentIndex--
      return this.history[this.currentIndex].map(item => {
        if (item.type === 'line') {
          return {
            ...item,
            points: [...item.points],
          }
        }
        return { ...item }
      })
    }
    return []
  }

  redo(): DrawingItem[] {
    if (this.canRedo) {
      this.currentIndex++
      return this.history[this.currentIndex].map(item => {
        if (item.type === 'line') {
          return {
            ...item,
            points: [...item.points],
          }
        }
        return { ...item }
      })
    }
    return this.history[this.currentIndex] || []
  }

  clear() {
    this.history = [[]]  // 빈 배열을 초기 상태로 설정
    this.currentIndex = 0  // 초기 상태의 인덱스는 0
  }

  getCurrentState(): DrawingItem[] {
    return this.history[this.currentIndex]?.map(item => {
      if (item.type === 'line') {
        return {
          ...item,
          points: [...item.points],
        }
      }
      return { ...item }
    }) || []
  }
}

export const useHistory = () => {
  return new DrawingHistory()
} 