import { format } from "date-fns";
import { useWishListStore } from "~/store/wishlist";

import { MetaFunction } from "@remix-run/node";
export const meta: MetaFunction = () => {
  return [
    { title: "Remix Todo App - 收藏列表" },
    {
      name: "description",
      content: "Remix Todo App 的收藏列表頁面，顯示用戶收藏的項目。",
    },
  ];
};
/** - 收藏列表頁 */
export default function Favorites() {
  const { wishList } = useWishListStore();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">我的收藏</h1>
      <p>這裡將顯示用戶收藏的項目。</p>
      {/* 你可以在這裡添加更多內容或組件來顯示收藏的項目 */}

      <ul className="list-disc pl-5">
        {wishList.map((item, index) => (
          <li key={index} className="mb-2">
            {item.content} -{" "}
            <span className="text-gray-500">
              創建時間:
              {format(new Date(item.createTime), "yyyy-MM-dd HH:mm:ss")}
            </span>
            <button
              className="btn btn-sm btn-error ml-2"
              onClick={() => {
                // 這裡可以添加刪除收藏的邏輯
                console.log(`刪除收藏: ${item.content}`);
              }}
            >
              刪除
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-gray-500">這是收藏列表的範例。</p>
    </div>
  );
}
