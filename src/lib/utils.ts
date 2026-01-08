// src/lib/utils.ts

import { Character, GroupedAccount, GameAccount, CharacterGear } from './types';
import { getColorByIndex } from './colors';

/**
 * キャラクターリストを、指定されたアカウントリストの順序（色）に基づいてグループ化します
 */
export function groupCharactersByAccount(
  characters: Character[],
  allAccounts: GameAccount[]
): Record<string, GroupedAccount> {

  // 1. アカウントIDから「固定のインデックス（色番号）」を引けるマップを作成
  const accountIdToColorIndex: Record<string, number> = {};
  allAccounts.forEach((acc, index) => {
    accountIdToColorIndex[acc.id] = index;
  });

  // 2. グループ化の実行
  return characters.reduce((acc, char) => {
    const accountData = Array.isArray(char.game_accounts)
      ? char.game_accounts[0]
      : char.game_accounts;

    const accountId = accountData?.id || 'unlinked';

    if (!acc[accountId]) {
      // アカウントリストにあればその順序、なければグレー系(999)
      const colorIndex = accountId !== 'unlinked' ? accountIdToColorIndex[accountId] : 999;
      const color = accountData?.color_code || getColorByIndex(colorIndex);

      acc[accountId] = {
        name: accountData?.name || '未紐付け',
        color: color,
        chars: []
      };
    }
    acc[accountId].chars.push(char);
    return acc;
  }, {} as Record<string, GroupedAccount>);
}

/**
 * 装備配列をスロット名をキーとしたマップに変換します
 */
export function formatGearMap(data: CharacterGear[]): Record<string, CharacterGear> {
  return data.reduce((acc, gear) => {
    acc[gear.slot] = gear;
    return acc;
  }, {} as Record<string, CharacterGear>);
}