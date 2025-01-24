interface DrawingItem {
  id: number;
  points: number[];
  type: 'line' | 'magicwand';
  color?: string;
  width?: number;
  image?: HTMLImageElement;
  imageData?: ImageData;
}

class DrawingHistory {
  private history: DrawingItem[][] = []
  private step: number = -1

  constructor() {
    // 초기 빈 상태 추가
    this.push([])
  }

  get canUndo(): boolean {
    return this.step > 0
  }

  get canRedo(): boolean {
    return this.step < this.history.length - 1
  }

  get currentState(): DrawingItem[] {
    if (this.step === -1) return []
    return this.history[this.step].map(item => {
      const newItem = {...item}
      if (item.image) {
        newItem.image = item.image
      }
      if (item.imageData) {
        newItem.imageData = item.imageData
      }
      return newItem
    })
  }

  push(state: DrawingItem[]): void {
    this.step++
    this.history.length = this.step + 1
    this.history[this.step] = state.map(item => {
      const newItem = {...item}
      if (item.image) {
        newItem.image = item.image
      }
      if (item.imageData) {
        newItem.imageData = item.imageData
      }
      return newItem
    })
  }

  undo(): DrawingItem[] {
    if (!this.canUndo) return this.currentState
    this.step--
    return this.currentState
  }

  redo(): DrawingItem[] {
    if (!this.canRedo) return this.currentState
    this.step++
    return this.currentState
  }

  clear(): void {
    this.push([])
  }
}

export const useHistory = () => {
  return new DrawingHistory()
}

export type { DrawingItem } 