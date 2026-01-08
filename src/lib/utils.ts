import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { Character, GroupedAccount } from './types';
import { getSystemColor } from './colors';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function groupCharactersByAccount(characters: Character[]): Record<string, GroupedAccount> {
  return characters.reduce((acc, char) => {
    const accountData = Array.isArray(char.game_accounts)
      ? char.game_accounts[0]
      : char.game_accounts;

    const accountId = accountData?.id || 'unlinked';

    if (!acc[accountId]) {
      acc[accountId] = {
        name: accountData?.name || '未紐付け',
        color: accountData?.color_code || getSystemColor(accountId),
        chars: []
      };
    }
    acc[accountId].chars.push(char);
    return acc;
  }, {} as Record<string, GroupedAccount>);
}