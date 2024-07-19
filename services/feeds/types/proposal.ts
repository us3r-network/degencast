export enum ProposalStatus {
  // 未提案
  None = 0,
  // 提案中
  Proposed = 1,
  // 提案被拒绝
  Rejected = 2,
  // 提案被接受
  Accepted = 3,
}

export enum ProposalResult {
  // 未投票（未提案）
  None = 0,
  // 赞成
  Upvote = 1,
  // 反对
  Downvote = 2,
}

export type ProposalEntity = {
  // 发起提案调用的合约地址
  contractAddress: string;
  // 提案阶段状态
  status: ProposalStatus;
  // 当前的结果
  result: ProposalResult;
  // 决定当前结果的时间
  finalizeTime: number;
  // 提案通过的cast,被mint过的数量
  mintedCount?: number;
};
