import type { Common } from '..'

export enum FriendRequestStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Rejected = 'rejected',
}

export interface Contact extends Common {
  // 发起好友申请的用户 id
  userId: string
  // 被申请的用户 id
  friendId: string
  // 申请状态
  status: FriendRequestStatus
  // 申请理由
  reason: string
  // friend 给 user 的备注
  friendRemark: string
  // user 给 friend 的备注
  userRemark: string
  // 好友关系建立时间
  establishAt: string
}
