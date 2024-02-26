import type { Common } from '..'

/**
 * User
 */
export interface User extends Common {
  /**
   * 头像
   */
  avatar?: string
  /**
   * 个人简介
   */
  bio?: string
  /**
   * 邮箱
   */
  email?: string
  /**
   * 昵称
   */
  nickname?: string
  /**
   * 密码
   */
  password: string
  /**
   * 在线状态
   */
  status?: string
  /**
   * 用户名
   */
  username: string
  [property: string]: any
}

export interface Friend extends User {
  /**
   * 备注
   */
  note?: string
  /**
   * 好友分组
   */
  group?: string
  [property: string]: any
}
