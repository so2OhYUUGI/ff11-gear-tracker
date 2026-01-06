'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

// 型定義（TypeScript用）
type Item = {
  id: number;
  name: string;
  category: string;
  sub_category: string | null;
  stack_size: number;
  wiki_url: string | null;
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      // ID順に並べ替えて取得
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('id', { ascending: true });

      if (!error && data) {
        setItems(data);
      }
      setLoading(false);
    };

    fetchItems();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">FF11 Gear Tracker</h1>
          <p className="text-gray-600">素材・装備・ポイント管理アプリ</p>
        </header>

        {loading ? (
          <p className="text-center text-gray-500">Loading data...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs px-2 py-1 rounded font-semibold ${item.category === 'currency' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                    {item.category === 'currency' ? 'ポイント' : '素材/装備'}
                  </span>
                  <span className="text-xs text-gray-400">ID: {item.id}</span>
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-1">{item.name}</h2>

                <div className="text-sm text-gray-600 mb-3">
                  {item.sub_category && <span className="mr-2">分類: {item.sub_category}</span>}
                  <span>スタック: {item.stack_size}</span>
                </div>

                {item.wiki_url && (
                  <a
                    href={item.wiki_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 text-sm hover:underline"
                  >
                    用語辞典で見る →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}