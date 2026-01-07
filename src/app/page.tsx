import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Dashboard } from '@/components/Dashboard'

export default async function Home() {
  const supabase = await createClient()

  // 1. ユーザー情報取得
  const { data: { user } } = await supabase.auth.getUser()

  // 2. アイテム一覧取得
  const { data: items } = await supabase
    .from('items')
    .select('*')
    .order('id', { ascending: true })

  // 3. ログインしている場合のみ、キャラと在庫を取得
  let characters: any[] = []
  let inventoryMap: Record<number, number> = {}

  if (user) {
    // キャラ取得 (RLSポリシーにより自分のキャラだけ取得できる)
    const { data: chars } = await supabase.from('characters').select('id, name')
    characters = chars || []

    // 在庫取得 (とりあえず1人目のキャラの分だけ簡易取得)
    if (characters.length > 0) {
      const { data: inv } = await supabase
        .from('inventories')
        .select('item_id, quantity')
        .eq('character_id', characters[0].id)

      // 配列を使いやすい連想配列 { itemId: quantity } に変換
      inv?.forEach((row) => {
        inventoryMap[row.item_id] = row.quantity
      })
    }
  }

  // ログアウト処理
  const signOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    return redirect('/login')
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* ヘッダー */}
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">FF11 Gear Tracker</h1>
            <p className="text-gray-600">素材・装備・ポイント管理アプリ</p>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700 hidden sm:inline">
                  Login: {user.email}
                </span>
                <form action={signOut}>
                  <button className="bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded text-sm shadow-sm transition-colors">
                    ログアウト
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-indigo-600 text-white px-6 py-2 rounded shadow hover:bg-indigo-700 transition-colors"
              >
                ログイン
              </Link>
            )}
          </div>
        </header>

        {/* コンテンツエリア */}
        {user ? (
          <Dashboard
            items={items || []}
            characters={characters}
            initialInventory={inventoryMap}
            userId={user.id}
          />
        ) : (
          // 未ログイン時の表示
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">ようこそ！</h2>
            <p className="text-gray-600 mb-8">
              RMEA素材やアンバスポイントを一元管理しましょう。<br />
              ログインすると、在庫の記録や目標設定が可能になります。
            </p>
            <Link
              href="/login"
              className="inline-block bg-indigo-600 text-white text-lg px-8 py-3 rounded-lg hover:bg-indigo-700 shadow transition-transform hover:scale-105"
            >
              今すぐ始める
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}