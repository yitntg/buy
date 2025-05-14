export class AvatarService {
  static getDefaultAvatarUrl(identifier: string): string {
    // 根据标识符生成默认头像 URL
    const baseUrl = 'https://ui-avatars.com/api/';
    const name = identifier.split('@')[0]; // 使用邮箱前缀或用户名
    return `${baseUrl}?name=${encodeURIComponent(name)}&background=random&color=fff`;
  }

  static generateAvatarFromEmail(email: string): string {
    return this.getDefaultAvatarUrl(email);
  }

  static generateAvatarFromUsername(username: string): string {
    return this.getDefaultAvatarUrl(username);
  }
} 