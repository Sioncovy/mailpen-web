import type { Common, UserPublic } from '..'

export enum FriendRequestStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Rejected = 'rejected',
}

export enum FriendStatus {
  Normal = 'normal',
  Blocked = 'blocked',
}

export interface Request extends Common {
  user: UserPublic
  friend: UserPublic
  status: FriendRequestStatus
  reason?: string
}

export interface Contact extends Common {
  user: UserPublic
  friend: UserPublic
  // 好友状态
  status: FriendStatus
  // 好友申请记录
  request: Request
  remark?: string
}
