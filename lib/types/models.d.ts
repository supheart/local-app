export type ObjectId = string;
type File = { name: string; url: string; __type: string };

export interface Workspace {
  objectId: string;
  name: string;
};

export interface User extends BaseParseObject {
  username: string;
  avatar?: File;

  emailVerified: boolean;
  email?: string;
  deleted: boolean;
  enabled: boolean;
  nickname?: string;
  isSystem: boolean;
  role?: Record<string, any>;
}
