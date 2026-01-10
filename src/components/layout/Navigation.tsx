
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
		const itemClasses = `navigation-item ${isActive ? 'navigation-item--active' : 'navigation-item--inactive'}`;

		return (
			<Link
				href={item.href}
				className={itemClasses}
			>
				<span className="text-xl md:text-lg">{item.icon}</span>
				<span className="navigation-item__label">{item.label}</span>
			</Link>
		);
	};

	return (
		<>
			<aside className="navigation-sidebar">
				<div className="p-6">
					<h1 className="main-title text-white">FF11 Tracker</h1>
				</div>
				<nav className="flex-1 px-4 space-y-2">
					{NAV_ITEMS.map((item) => (
						<NavItem key={item.href} item={item} />
					))}
				</nav>
			</aside>

			<nav className="navigation-bottom">
				{NAV_ITEMS.map((item) => (
					<NavItem key={item.href} item={item} />
				))}
			</nav>
		</>
	);
}
