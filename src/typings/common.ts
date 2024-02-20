/**
 * Common
 */
export interface Common {
  /**
   * 创建时间
   */
  createdAt: string
  /**
   * id
   */
  id: string
  /**
   * 更新时间
   */
  updatedAt: string
  [property: string]: any
}

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export enum Language {
  Zh = 'zh',
  En = 'en',
}
