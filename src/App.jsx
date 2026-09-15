import { useEffect, useRef, useState } from 'react'
import './App.css'

const defaultCategories = [
  {
    id: 1,
    name: '料理',
    items: [
      { id: 1, name: 'からあげ', price: 500 },
      { id: 2, name: '焼き鳥', price: 600 },
      { id: 3, name: '枝豆', price: 300 },
      { id: 4, name: 'ポテト', price: 400 },
      { id: 5, name: 'だし巻き卵', price: 450 },
      { id: 6, name: '刺身盛り', price: 1200 },
      { id: 7, name: '冷奴', price: 300 },
      { id: 8, name: 'おにぎり', price: 350 },
    ],
  },
  {
    id: 2,
    name: '飲み物',
    items: [
      { id: 101, name: '生ビール', price: 550 },
      { id: 102, name: 'ハイボール', price: 500 },
      { id: 103, name: 'レモンサワー', price: 450 },
      { id: 104, name: 'ウーロン茶', price: 300 },
      { id: 105, name: 'コーラ', price: 300 },
      { id: 106, name: 'ジンジャーエール', price: 300 },
    ],
  },
  {
    id: 3,
    name: 'デザート',
    items: [
      { id: 201, name: 'アイス', price: 300 },
      { id: 202, name: 'プリン', price: 350 },
      { id: 203, name: 'ケーキ', price: 450 },
      { id: 204, name: 'シャーベット', price: 300 },
    ],
  },
]

function App() {
  const [screen, setScreen] = useState('order')

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('categories')

    if (saved) {
      return JSON.parse(saved)
    }

    return defaultCategories
  })

  const [selectedCategory, setSelectedCategory] = useState(() => {
    const saved = localStorage.getItem('selectedCategory')

    if (saved) {
      return Number(saved)
    }

    return defaultCategories[0].id
  })

  const [order, setOrder] = useState([])

  const [orderHistory, setOrderHistory] = useState(() => {
    const saved = localStorage.getItem('orderHistory')

    if (saved) {
      return JSON.parse(saved)
    }

    return []
  })

  const [editingCategoryId, setEditingCategoryId] = useState(null)
  const [categoryName, setCategoryName] = useState('')

  const [editingProduct, setEditingProduct] = useState(null)
  const [productName, setProductName] = useState('')
  const [productPrice, setProductPrice] = useState('')

  const [slideDirection, setSlideDirection] = useState('none')

  // 注文内容のスクロール用
  const orderListRef = useRef(null)

  // 前回の注文商品数
  const previousOrderLengthRef = useRef(order.length)

  // ==============================
  // localStorage保存
  // ==============================

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories))
  }, [categories])

  useEffect(() => {
    localStorage.setItem(
      'selectedCategory',
      String(selectedCategory),
    )
  }, [selectedCategory])

  useEffect(() => {
    localStorage.setItem(
      'orderHistory',
      JSON.stringify(orderHistory),
    )
  }, [orderHistory])

  // ==============================
  // 商品が新しく追加されたら
  // 注文内容を自動スクロール
  // ==============================

  useEffect(() => {
    const previousLength = previousOrderLengthRef.current

    if (order.length > previousLength) {
      setTimeout(() => {
        if (orderListRef.current) {
          orderListRef.current.scrollTo({
            top: orderListRef.current.scrollHeight,
            behavior: 'smooth',
          })
        }
      }, 50)
    }

    previousOrderLengthRef.current = order.length
  }, [order])

  // ==============================
  // 現在のカテゴリ
  // ==============================

  const currentCategory =
    categories.find(
      (category) => category.id === selectedCategory,
    ) || categories[0]

  // ==============================
  // 合計金額
  // ==============================

  const totalPrice = order.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )

  // ==============================
  // 商品追加
  // ==============================

  const addToOrder = (product) => {
    setOrder((currentOrder) => {
      const existing = currentOrder.find(
        (item) => item.id === product.id,
      )

      if (existing) {
        return currentOrder.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        )
      }

      return [
        ...currentOrder,
        {
          ...product,
          quantity: 1,
        },
      ]
    })
  }

  // ==============================
  // 数量変更
  // ==============================

  const changeQuantity = (productId, amount) => {
    setOrder((currentOrder) =>
      currentOrder
        .map((item) => {
          if (item.id !== productId) {
            return item
          }

          return {
            ...item,
            quantity: item.quantity + amount,
          }
        })
        .filter((item) => item.quantity > 0),
    )
  }

  // ==============================
  // 注文確定
  // ==============================

  const confirmOrder = () => {
    if (order.length === 0) {
      return
    }

    const newHistory = {
      id: Date.now(),
      date: new Date().toLocaleString('ja-JP'),
      items: order,
      total: totalPrice,
    }

    setOrderHistory((currentHistory) => [
      newHistory,
      ...currentHistory,
    ])

    setOrder([])

    // 次回追加時の判定をリセット
    previousOrderLengthRef.current = 0
  }

  // ==============================
  // カテゴリ移動
  // ==============================

  const moveCategory = (direction) => {
    if (categories.length <= 1) {
      return
    }

    const currentIndex = categories.findIndex(
      (category) => category.id === selectedCategory,
    )

    let nextIndex

    if (direction === 'next') {
      nextIndex =
        currentIndex >= categories.length - 1
          ? 0
          : currentIndex + 1

      setSlideDirection('slide-left')
    } else {
      nextIndex =
        currentIndex <= 0
          ? categories.length - 1
          : currentIndex - 1

      setSlideDirection('slide-right')
    }

    setSelectedCategory(categories[nextIndex].id)

    setTimeout(() => {
      setSlideDirection('none')
    }, 250)
  }

  // ==============================
  // カテゴリ追加
  // ==============================

  const addCategory = () => {
    const name = window.prompt('カテゴリ名を入力してください')

    if (!name || !name.trim()) {
      return
    }

    const newCategory = {
      id: Date.now(),
      name: name.trim(),
      items: [],
    }

    setCategories((currentCategories) => [
      ...currentCategories,
      newCategory,
    ])

    setSelectedCategory(newCategory.id)
  }

  // ==============================
  // カテゴリ編集開始
  // ==============================

  const startCategoryEdit = (category) => {
    setEditingCategoryId(category.id)
    setCategoryName(category.name)
  }

  // ==============================
  // カテゴリ保存
  // ==============================

  const saveCategory = () => {
    if (!categoryName.trim()) {
      return
    }

    setCategories((currentCategories) =>
      currentCategories.map((category) =>
        category.id === editingCategoryId
          ? {
              ...category,
              name: categoryName.trim(),
            }
          : category,
      ),
    )

    setEditingCategoryId(null)
    setCategoryName('')
  }

  // ==============================
  // カテゴリ削除
  // ==============================

  const deleteCategory = (categoryId) => {
    if (categories.length <= 1) {
      window.alert('カテゴリは最低1つ必要です')
      return
    }

    const category = categories.find(
      (item) => item.id === categoryId,
    )

    if (!category) {
      return
    }

    const result = window.confirm(
      `「${category.name}」を削除しますか？`,
    )

    if (!result) {
      return
    }

    const newCategories = categories.filter(
      (item) => item.id !== categoryId,
    )

    setCategories(newCategories)

    if (selectedCategory === categoryId) {
      setSelectedCategory(newCategories[0].id)
    }
  }

  // ==============================
  // 商品追加開始
  // ==============================

  const startAddProduct = () => {
    setEditingProduct({
      mode: 'add',
      categoryId: selectedCategory,
    })

    setProductName('')
    setProductPrice('')
  }

  // ==============================
  // 商品編集開始
  // ==============================

  const startEditProduct = (product, categoryId) => {
    setEditingProduct({
      mode: 'edit',
      categoryId,
      productId: product.id,
    })

    setProductName(product.name)
    setProductPrice(String(product.price))
  }

  // ==============================
  // 商品保存
  // ==============================

  const saveProduct = () => {
    if (!productName.trim()) {
      return
    }

    const price = Number(productPrice)

    if (!Number.isFinite(price) || price < 0) {
      return
    }

    if (editingProduct.mode === 'add') {
      const newProduct = {
        id: Date.now(),
        name: productName.trim(),
        price,
      }

      setCategories((currentCategories) =>
        currentCategories.map((category) =>
          category.id === editingProduct.categoryId
            ? {
                ...category,
                items: [...category.items, newProduct],
              }
            : category,
        ),
      )
    } else {
      setCategories((currentCategories) =>
        currentCategories.map((category) =>
          category.id === editingProduct.categoryId
            ? {
                ...category,
                items: category.items.map((item) =>
                  item.id === editingProduct.productId
                    ? {
                        ...item,
                        name: productName.trim(),
                        price,
                      }
                    : item,
                ),
              }
            : category,
        ),
      )
    }

    setEditingProduct(null)
    setProductName('')
    setProductPrice('')
  }

  // ==============================
  // 商品削除
  // ==============================

  const deleteProduct = (productId, categoryId) => {
    const category = categories.find(
      (item) => item.id === categoryId,
    )

    const product = category?.items.find(
      (item) => item.id === productId,
    )

    if (!product) {
      return
    }

    const result = window.confirm(
      `「${product.name}」を削除しますか？`,
    )

    if (!result) {
      return
    }

    setCategories((currentCategories) =>
      currentCategories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.filter(
                (item) => item.id !== productId,
              ),
            }
          : category,
      ),
    )
  }

  // ==============================
  // タッチ操作
  // ==============================

  const touchStartX = useRef(null)

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX
  }

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) {
      return
    }

    const endX = event.changedTouches[0].clientX
    const diff = endX - touchStartX.current

    if (Math.abs(diff) > 50) {
      if (diff < 0) {
        moveCategory('next')
      } else {
        moveCategory('prev')
      }
    }

    touchStartX.current = null
  }

  // ==============================
  // 表示
  // ==============================

  return (
    <div className="app">

      {/* ==============================
          上部メニュー
      ============================== */}

      <nav className="top-menu">
        <button
          className={screen === 'order' ? 'active' : ''}
          onClick={() => setScreen('order')}
        >
          注文
        </button>

        <button
          className={screen === 'history' ? 'active' : ''}
          onClick={() => setScreen('history')}
        >
          履歴
        </button>

        <button
          className={screen === 'settings' ? 'active' : ''}
          onClick={() => setScreen('settings')}
        >
          商品設定
        </button>
      </nav>

      {/* ==============================
          注文画面
      ============================== */}

      {screen === 'order' && (
        <main className="order-screen">

          {/* 注文内容 */}
          <section className="order-panel">

            <div className="section-title">
              注文内容
            </div>

            <div
              className="order-list"
              ref={orderListRef}
            >
              {order.length === 0 ? (
                <div className="empty-order">
                  商品を選択してください
                </div>
              ) : (
                order.map((item) => (
                  <div
                    className="order-item"
                    key={item.id}
                  >
                    <div className="order-item-info">
                      <div className="order-item-name">
                        {item.name}
                      </div>

                      <div className="order-item-price">
                        ¥{item.price.toLocaleString()}
                      </div>
                    </div>

                    <div className="quantity-control">
                      <button
                        onClick={() =>
                          changeQuantity(item.id, -1)
                        }
                      >
                        −
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          changeQuantity(item.id, 1)
                        }
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="order-bottom">

              <div className="total-row">
                <span>合計</span>

                <strong>
                  ¥{totalPrice.toLocaleString()}
                </strong>
              </div>

              <button
                className="confirm-button"
                onClick={confirmOrder}
                disabled={order.length === 0}
              >
                注文を確定する
              </button>

            </div>
          </section>

          {/* 商品一覧 */}
          <section
            className="menu-panel"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >

            <div className="category-header">

              <button
                className="category-arrow"
                onClick={() => moveCategory('prev')}
              >
                ‹
              </button>

              <div className="category-title">
                {currentCategory?.name}
              </div>

              <button
                className="category-arrow"
                onClick={() => moveCategory('next')}
              >
                ›
              </button>

            </div>

            <div
              className={`menu-scroll ${slideDirection}`}
            >
              {currentCategory?.items.map((product) => (
                <button
                  className="menu-item"
                  key={product.id}
                  onClick={() => addToOrder(product)}
                >
                  <span>{product.name}</span>

                  <span>
                    ¥{product.price.toLocaleString()}
                  </span>
                </button>
              ))}
            </div>

            <div className="page-indicator">
              {categories.map((category) => (
                <span
                  key={category.id}
                  className={
                    category.id === selectedCategory
                      ? 'active'
                      : ''
                  }
                />
              ))}
            </div>

          </section>
        </main>
      )}

      {/* ==============================
          履歴画面
      ============================== */}

      {screen === 'history' && (
        <main className="history-screen">

          <div className="section-title">
            注文履歴
          </div>

          <div className="history-list">

            {orderHistory.length === 0 ? (
              <div className="empty-history">
                注文履歴はありません
              </div>
            ) : (
              orderHistory.map((history) => (
                <div
                  className="history-card"
                  key={history.id}
                >
                  <div className="history-header">
                    <span>
                      {history.date}
                    </span>

                    <strong>
                      ¥{history.total.toLocaleString()}
                    </strong>
                  </div>

                  <div className="history-items">
                    {history.items.map((item) => (
                      <div
                        className="history-item"
                        key={item.id}
                      >
                        <span>
                          {item.name} × {item.quantity}
                        </span>

                        <span>
                          ¥
                          {(
                            item.price * item.quantity
                          ).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}

          </div>

        </main>
      )}

      {/* ==============================
          商品設定画面
      ============================== */}

      {screen === 'settings' && (
        <main className="settings-screen">

          <div className="section-title">
            商品設定
          </div>

          <div className="settings-content">

            {/* カテゴリ設定 */}

            <section className="settings-section">

              <div className="settings-section-header">
                <h2>カテゴリ</h2>

                <button
                  className="add-button"
                  onClick={addCategory}
                >
                  ＋カテゴリ追加
                </button>
              </div>

              <div className="category-settings-list">

                {categories.map((category) => (
                  <div
                    className="category-setting-item"
                    key={category.id}
                  >
                    {editingCategoryId === category.id ? (
                      <div className="edit-form">

                        <input
                          value={categoryName}
                          onChange={(event) =>
                            setCategoryName(
                              event.target.value,
                            )
                          }
                          autoFocus
                        />

                        <button
                          onClick={saveCategory}
                        >
                          保存
                        </button>

                        <button
                          onClick={() => {
                            setEditingCategoryId(null)
                            setCategoryName('')
                          }}
                        >
                          キャンセル
                        </button>

                      </div>
                    ) : (
                      <>
                        <span>
                          {category.name}
                        </span>

                        <div className="setting-actions">

                          <button
                            onClick={() =>
                              startCategoryEdit(
                                category,
                              )
                            }
                          >
                            編集
                          </button>

                          <button
                            onClick={() =>
                              deleteCategory(
                                category.id,
                              )
                            }
                          >
                            削除
                          </button>

                        </div>
                      </>
                    )}
                  </div>
                ))}

              </div>

            </section>

            {/* 商品設定 */}

            <section className="settings-section">

              <div className="settings-section-header">
                <h2>
                  商品
                  {currentCategory
                    ? `（${currentCategory.name}）`
                    : ''}
                </h2>

                <button
                  className="add-button"
                  onClick={startAddProduct}
                >
                  ＋商品追加
                </button>
              </div>

              <div className="product-settings-list">

                {currentCategory?.items.length === 0 ? (
                  <div className="empty-settings">
                    商品がありません
                  </div>
                ) : (
                  currentCategory?.items.map(
                    (product) => (
                      <div
                        className="product-setting-item"
                        key={product.id}
                      >

                        {editingProduct?.mode ===
                          'edit' &&
                        editingProduct.productId ===
                          product.id ? (
                          <div className="edit-form">

                            <input
                              value={productName}
                              onChange={(event) =>
                                setProductName(
                                  event.target.value,
                                )
                              }
                              placeholder="商品名"
                            />

                            <input
                              type="number"
                              value={productPrice}
                              onChange={(event) =>
                                setProductPrice(
                                  event.target.value,
                                )
                              }
                              placeholder="価格"
                            />

                            <button
                              onClick={saveProduct}
                            >
                              保存
                            </button>

                            <button
                              onClick={() =>
                                setEditingProduct(null)
                              }
                            >
                              キャンセル
                            </button>

                          </div>
                        ) : (
                          <>
                            <div className="product-setting-info">

                              <span>
                                {product.name}
                              </span>

                              <strong>
                                ¥
                                {product.price.toLocaleString()}
                              </strong>

                            </div>

                            <div className="setting-actions">

                              <button
                                onClick={() =>
                                  startEditProduct(
                                    product,
                                    currentCategory.id,
                                  )
                                }
                              >
                                編集
                              </button>

                              <button
                                onClick={() =>
                                  deleteProduct(
                                    product.id,
                                    currentCategory.id,
                                  )
                                }
                              >
                                削除
                              </button>

                            </div>
                          </>
                        )}

                      </div>
                    ),
                  )
                )}

              </div>

            </section>

          </div>

          {/* 商品追加フォーム */}

          {editingProduct?.mode === 'add' && (
            <div className="modal-overlay">

              <div className="modal">

                <h2>商品追加</h2>

                <input
                  value={productName}
                  onChange={(event) =>
                    setProductName(event.target.value)
                  }
                  placeholder="商品名"
                  autoFocus
                />

                <input
                  type="number"
                  value={productPrice}
                  onChange={(event) =>
                    setProductPrice(event.target.value)
                  }
                  placeholder="価格"
                />

                <div className="modal-actions">

                  <button
                    onClick={saveProduct}
                  >
                    保存
                  </button>

                  <button
                    onClick={() =>
                      setEditingProduct(null)
                    }
                  >
                    キャンセル
                  </button>

                </div>

              </div>

            </div>
          )}

        </main>
      )}

    </div>
  )
}

export default App