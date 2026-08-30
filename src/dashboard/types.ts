export interface Member {
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export interface Room {
  id: string;
  code: string;
  title: string;
  updatedAt: string;
  isLive?: boolean;
  members: Member[];
}

export type TabType = 'all' | 'owned' | 'joined';