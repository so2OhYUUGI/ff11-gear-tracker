'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UI_STYLE } from '@/lib/styles';

const NAV_ITEMS = [
	{ label: 'Home', href: '/', icon: '🏠' },
	{ label: 'Gear', href: '/gear', icon: '⚔️' },
	{ label: 'Target', href: '/target', icon: '🎯' },
	{ label: 'Chars', href: '/characters', icon: '👥' },
];

export default function Navigation() {
	const pathname = usePathname();

	const NavItem = ({ item }: { item: typeof NAV_ITEMS[0] }) => {
		const isActive = pathname === item.href;
		return (
			<Link
				href={item.href}
				className={`${UI_STYLE.nav.item} ${isActive ? UI_STYLE.nav.itemActive : UI_STYLE.nav.itemInactive}`}
			>
				<span className="text-xl md:text-lg">{item.icon}</span>
				<span className={UI_STYLE.nav.label}>{item.label}</span>
			</Link>
		);
	};

	return (
		<>
			<aside className={UI_STYLE.nav.sidebar}>
				<div className="p-6">
					<h1 className={UI_STYLE.mainTitle + " text-white"}>FF11 Tracker</h1>
				</div>
				<nav className="flex-1 px-4 space-y-2">
					{NAV_ITEMS.map((item) => (
						<NavItem key={item.href} item={item} />
					))}
				</nav>
			</aside>

			<nav className={UI_STYLE.nav.bottom}>
				{NAV_ITEMS.map((item) => (
					<NavItem key={item.href} item={item} />
				))}
			</nav>
		</>
	);
}