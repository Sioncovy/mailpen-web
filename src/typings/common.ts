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
  _id: string
  /**
   * 更新时间
   */
  updatedAt: string
}

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export enum Language {
  Zh = 'zh',
  En = 'en',
}

export enum Status {
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
}
