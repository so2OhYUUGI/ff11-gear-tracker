// src/lib/utils.ts

import { Character, GroupedAccount, CharacterGear } from './types';
import { getSystemColor } from './colors';

export function groupCharactersByAccount(characters: Character[]): Record<string, GroupedAccount> {
  return characters.reduce((acc, char) => {
    const accountData = Array.isArray(char.game_accounts) ? char.game_accounts[0] : char.game_accounts;
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

export function formatGearMap(data: CharacterGear[]): Record<string, CharacterGear> {
  return data.reduce((acc, gear) => {
    acc[gear.slot] = gear;
    return acc;
  }, {} as Record<string, CharacterGear>);
}