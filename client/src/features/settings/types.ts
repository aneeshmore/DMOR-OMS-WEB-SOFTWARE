export interface PagePermission {
  id: string;
  pageName: string;
  category: 'Masters' | 'Operation' | 'Report' | 'App Report' | 'System Control';
  create: boolean;
  modify: boolean;
  view: boolean;
  lock: boolean;
  selected: boolean;
}

export type PermissionCategory =
  | 'Masters'
  | 'Operation'
  | 'Report'
  | 'App Report'
  | 'System Control';
