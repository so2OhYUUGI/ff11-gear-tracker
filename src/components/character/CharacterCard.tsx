
'use client';

import { useRouter } from 'next/navigation';

// Character interface - can be expanded as needed
interface Character {
  id: string;
  name: string;
  world: string;
  last_job_code: string | null;
  accountName: string;
  accountColor: string;
}

interface CharacterCardProps {
  char: Character;
}

export default function CharacterCard({ char }: CharacterCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/gear?charId=${char.id}`);
  };

  return (
    <button
      onClick={handleCardClick}
      className="character-card group w-48 h-48 flex-shrink-0"
      style={{
        borderTopColor: char.accountColor,
      } as React.CSSProperties}
    >
      <div
        className="character-card__account-badge top-2"
        style={{ backgroundColor: char.accountColor }} // Dynamic style: stays inline
      >
        {char.accountName}
      </div>

      <div className="character-card__content w-full flex flex-col items-center justify-center h-full text-center">
        <div className="character-card__world">{char.world}</div>
        <h4 className="character-card__name">{char.name}</h4>
        <div
          className="character-card__job-badge"
          style={{ position: 'static' }} // Defeated: This is the only way.
        >
          {char.last_job_code || 'N/A'}
        </div>
      </div>

      <div className="character-card__select-text">SELECT ➔</div>
    </button>
  );
}
