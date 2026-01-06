'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

// 型定義
type Item = {
	id: number
	name: string
	category: string
	sub_category: string | null
	stack_size: number
}

type Character = {
	id: string
	name: string
}

type InventoryMap = Record<number, number> // アイテムID: 所持数

export default function Dashboard({
	items,
	characters,
	initialInventory,
	userId
}: {
	items: Item[]
	characters: Character[]
	initialInventory: InventoryMap
	userId: string
}) {
	const supabase = createClient()
	const router = useRouter()

	// 状態管理
	const [selectedCharId, setSelectedCharId] = useState<string>(characters[0]?.id || '')
	const [inventory, setInventory] = useState<InventoryMap>(initialInventory)
	const [isCreating, setIsCreating] = useState(false)

	// 1. キャラクター作成処理
	const createCharacter = async () => {
		setIsCreating(true)
		try {
			// 簡易化のため、アカウントとキャラを同時に作ります
			// 1. アカウント作成
			const { data: account, error: accError } = await supabase
				.from('game_accounts')
				.insert({ user_id: userId, account_name: 'メイン垢' })
				.select()
				.single()

			if (accError) throw accError

			// 2. キャラ作成
			const { error: charError } = await supabase
				.from('characters')
				.insert({ account_id: account.id, name: 'MainCharacter' })

			if (charError) throw charError

			// 画面更新
			router.refresh()
		} catch (e) {
			alert('キャラ作成エラー: ' + (e as Error).message)
		} finally {
			setIsCreating(false)
		}
	}

	// 2. 在庫更新処理
	const updateInventory = async (itemId: number, newQuantity: number) => {
		if (!selectedCharId) return alert('キャラクターを選択してください')
		if (newQuantity < 0) return

		// 画面の表示を先に更新（サクサク動くように）
		setInventory((prev) => ({ ...prev, [itemId]: newQuantity }))

		// DB更新
		const { error } = await supabase
			.from('inventories')
			.upsert(
				{
					character_id: selectedCharId,
					item_id: itemId,
					quantity: newQuantity,
					location: 'inventory'
				},
				{ onConflict: 'character_id, item_id, location' }
			)

		if (error) console.error('保存失敗', error)
	}

	return (
		<div>
			{/* --- キャラクター選択エリア --- */}
			<div className="bg-white p-4 rounded-lg shadow mb-6 border border-gray-200">
				<h2 className="text-lg font-bold mb-2">操作キャラクター</h2>

				{characters.length === 0 ? (
					<div className="text-center py-4">
						<p className="mb-4 text-gray-600">まずはキャラクターを作成しましょう</p>
						<button
							onClick={createCharacter}
							disabled={isCreating}
							className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
						>
							{isCreating ? '作成中...' : 'メインキャラを作成する'}
						</button>
					</div>
				) : (
					<div className="flex gap-4 items-center">
						<select
							value={selectedCharId}
							onChange={(e) => setSelectedCharId(e.target.value)}
							className="border p-2 rounded w-64"
						>
							{characters.map((c) => (
								<option key={c.id} value={c.id}>{c.name}</option>
							))}
						</select>
						<span className="text-sm text-green-600">● 選択中</span>
					</div>
				)}
			</div>

			{/* --- アイテムリストエリア --- */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{items.map((item) => {
					const currentQty = inventory[item.id] || 0

					return (
						<div key={item.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
							<div className="flex justify-between items-start mb-2">
								<span className={`text-xs px-2 py-1 rounded font-semibold ${item.category === 'currency' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
									}`}>
									{item.category === 'currency' ? 'ポイント' : '素材/装備'}
								</span>
								<span className="text-xs text-gray-400">ID: {item.id}</span>
							</div>

							<h2 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h2>
							<div className="text-sm text-gray-600 mb-4">
								スタック: {item.stack_size}
							</div>

							{/* 在庫入力コントロール */}
							{characters.length > 0 && (
								<div className="bg-gray-50 p-3 rounded border flex items-center justify-between">
									<span className="text-sm font-bold text-gray-700">所持数:</span>
									<div className="flex items-center gap-2">
										<button
											onClick={() => updateInventory(item.id, currentQty - 1)}
											className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 font-bold"
										>
											-
										</button>
										<input
											type="number"
											value={currentQty}
											onChange={(e) => updateInventory(item.id, parseInt(e.target.value) || 0)}
											className="w-16 text-center border rounded p-1"
										/>
										<button
											onClick={() => updateInventory(item.id, currentQty + 1)}
											className="w-8 h-8 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-bold"
										>
											+
										</button>
									</div>
								</div>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}