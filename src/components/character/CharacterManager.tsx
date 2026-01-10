
'use client';

import CharacterCard from './CharacterCard';
import Link from 'next/link';

// Expanded Character interface to match data structure
interface Character {
  id: string;
  name: string;
  world: string;
  last_job_code: string | null;
  accountName: string;
  accountColor: string;
}

interface CharacterManagerProps {
	groupedCharacters: Record<string, { name: string, color: string, chars: any[] }>;
}

export default function CharacterManager({ groupedCharacters }: CharacterManagerProps) {

  // Flatten the grouped characters into a single list for easier mapping
	const allCharacters: Character[] = Object.values(groupedCharacters).flatMap(group =>
		group.chars.map(char => ({
			...char,
			accountName: group.name,
			accountColor: group.color
		}))
	);

	return (
		<div className="space-y-6">
			<header className="px-1">
				<h2 className="section-title">Characters</h2>
				<p className="page-description">Select a character to manage their gear.</p>
			</header>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{allCharacters.map((char) => (
					<CharacterCard key={char.id} char={char} />
				))}

        {/* "Add New" Card */}
				<Link href="/characters/create" className="character-card character-card--new">
					<span className="text-3xl font-bold">+</span>
					<span className="form-label mt-1">New Character</span>
				</Link>
			</div>
		</div>
	);
}
