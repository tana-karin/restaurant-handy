import { useEffect, useRef, useState } from 'react'
import './App.css'

const APP_DATA_VERSION = 5

const CATEGORIES_STORAGE_KEY = `categories_v${APP_DATA_VERSION}`
const SELECTED_CATEGORY_STORAGE_KEY = `selectedCategory_v${APP_DATA_VERSION}`
const ORDER_HISTORY_STORAGE_KEY = `orderHistory_v${APP_DATA_VERSION}`
const SOLD_OUT_STORAGE_KEY = `soldOut_v${APP_DATA_VERSION}`

/* =====================================
   初期商品データ
===================================== */

const defaultCategories = [
  {
    id: 1,
    name: '化粧缶',
    items: [
      {
        id: 1,
        name: '001_味の宴',
        price: 3600,
      },
      {
        id: 2,
        name: '002_味くらべ',
        price: 2500,
      },
      {
        id: 3,
        name: '003_ころもち(個々包装)',
        price: 2700,
      },
      {
        id: 4,
        name: '004_ころもち(ばら詰)',
        price: 2700,
      },
      {
        id: 5,
        name: '005_華の友',
        price: 2700,
      },
      {
        id: 6,
        name: '006_四季の集',
        price: 2500,
      },
      {
        id: 7,
        name: '007_蓬莱',
        price: 2500,
      },
      {
        id: 8,
        name: '009_マヨネーズ風味',
        price: 2500,
      },
      {
        id: 9,
        name: '010_海老サラダ',
        price: 2500,
      },
      {
        id: 10,
        name: '011_田舎焼',
        price: 2500,
      },
      {
        id: 11,
        name: '013_飛鳥',
        price: 2500,
      },
    ],
  },

  {
    id: 2,
    name: '小袋（10袋入）ケース',
    items: [
      {
        id: 101,
        name: '100_袋入 詰め合わせ',
        price: 3600,
      },
      {
        id: 102,
        name: '104_袋入 ころもち',
        price: 3800,
      },
      {
        id: 103,
        name: '105_袋入 華の友',
        price: 3800,
      },
      {
        id: 104,
        name: '109_袋入 マヨネーズ風味',
        price: 3600,
      },
      {
        id: 105,
        name: '110_袋入 海老サラダ',
        price: 3600,
      },
      {
        id: 106,
        name: '111_袋入 田舎焼',
        price: 3600,
      },
      {
        id: 107,
        name: '114_袋入 松しぐれ',
        price: 3600,
      },
    ],
  },

  {
    id: 3,
    name: '限定商品・大箱',
    items: [
      {
        id: 201,
        name: '433_高山「極」甘醤油',
        price: 1300,
      },
      {
        id: 202,
        name: '425_梅サラダ',
        price: 600,
      },
      {
        id: 203,
        name: '418_うるちサラダ',
        price: 600,
      },
      {
        id: 204,
        name: '420_昔風味 塩味',
        price: 600,
      },
      {
        id: 205,
        name: '421_昔風味 黒砂糖味',
        price: 600,
      },
      {
        id: 206,
        name: '402_大箱 味くらべ',
        price: 6500,
      },
      {
        id: 207,
        name: '403_大箱 ころもち(個々包装)',
        price: 7000,
      },
      {
        id: 208,
        name: '404_大箱 ころもち(ばら詰)',
        price: 7500,
      },
      {
        id: 209,
        name: '407_大箱 蓬莱',
        price: 6000,
      },
    ],
  },

  {
    id: 4,
    name: '送料',
    items: [
      {
        id: 301,
        name: '近畿・中国',
        price: 500,
      },
      {
        id: 302,
        name: '関東・四国・九州',
        price: 600,
      },
      {
        id: 303,
        name: '中部(愛知・石川・岐阜・静岡・富山・福井・三重)',
        price: 500,
      },
      {
        id: 304,
        name: '中部(長野・新潟)',
        price: 600,
      },
      {
        id: 305,
        name: '東北',
        price: 900,
      },
      {
        id: 306,
        name: '北海道・沖縄',
        price: 1300,
      },
    ],
  },

  {
    id: 5,
    name: '袋・パッキン・その他',
    items: [
      {
        id: 401,
        name: '971_紙袋 小',
        price: 40,
      },
      {
        id: 402,
        name: '972_紙袋 大',
        price: 60,
      },
      {
        id: 403,
        name: '973_ビニール袋 小(5枚)',
        price: 30,
      },
      {
        id: 404,
        name: '974_ビニール袋 大(5枚)',
        price: 60,
      },
      {
        id: 405,
        name: '981_1缶用パッキン',
        price: 80,
      },
      {
        id: 406,
        name: '982_2缶用パッキン',
        price: 100,
      },
      {
        id: 407,
        name: '983_3缶用パッキン',
        price: 110,
      },
      {
        id: 408,
        name: '984_4缶用パッキン',
        price: 130,
      },
      {
        id: 409,
        name: '986_6缶用パッキン',
        price: 150,
      },
      {
        id: 410,
        name: '952_包装紙',
        price: 30,
      },
    ],
  },

  {
    id: 6,
    name: '割れおかき',
    items: [
      {
        id: 501,
        name: '割れ 手赤',
        price: 3500,
      },
      {
        id: 502,
        name: '割れ 手白',
        price: 3500,
      },
      {
        id: 503,
        name: '割れ 蓬莱',
        price: 3500,
      },
      {
        id: 504,
        name: '割れ 老松',
        price: 3500,
      },
      {
        id: 505,
        name: '割れ 浦島',
        price: 3500,
      },
      {
        id: 506,
        name: '割れ 豆かき',
        price: 3500,
      },
      {
        id: 507,
        name: '割れ 田舎焼',
        price: 3000,
      },
      {
        id: 508,
        name: '割れ 海老サラダ',
        price: 3000,
      },
    ],
  },

  {
    id: 7,
    name: '詰替パック',
    items: [
      {
        id: 601,
        name: '304_詰替 ころもち',
        price: 1500,
      },
      {
        id: 602,
        name: '309_詰替 マヨネーズ風味',
        price: 1300,
      },
      {
        id: 603,
        name: '310_詰替 海老サラダ',
        price: 1300,
      },
      {
        id: 604,
        name: '311_詰替 田舎焼',
        price: 1300,
      },
      {
        id: 605,
        name: '312_詰替 蓬莱・老松・浦島',
        price: 1300,
      },
      {
        id: 606,
        name: '314_詰替 松しぐれ',
        price: 1300,
      },
      {
        id: 607,
        name: '316_詰替 豆かき',
        price: 1900,
      },
    ],
  },
]

/* =====================================
   送料設定
===================================== */

const shippingOptions = {
  '近畿・中国': [
    {
      id: 'kinki-1',
      name: '1缶',
      price: 500,
    },
    {
      id: 'kinki-2-3',
      name: '2～3缶',
      price: 600,
    },
    {
      id: 'kinki-4-6',
      name: '4～6缶',
      price: 700,
    },
    {
      id: 'kinki-7-8',
      name: '7～8缶',
      price: 800,
    },
  ],

  '関東・四国・九州': [
    {
      id: 'kanto-1',
      name: '1缶',
      price: 600,
    },
    {
      id: 'kanto-2-3',
      name: '2～3缶',
      price: 700,
    },
    {
      id: 'kanto-4-6',
      name: '4～6缶',
      price: 800,
    },
    {
      id: 'kanto-7-8',
      name: '7～8缶',
      price: 900,
    },
  ],

  '中部(愛知・石川・岐阜・静岡・富山・福井・三重)': [
    {
      id: 'chubu-aichi-1',
      name: '1缶',
      price: 500,
    },
    {
      id: 'chubu-aichi-2-3',
      name: '2～3缶',
      price: 600,
    },
    {
      id: 'chubu-aichi-4-6',
      name: '4～6缶',
      price: 700,
    },
    {
      id: 'chubu-aichi-7-8',
      name: '7～8缶',
      price: 800,
    },
  ],

  '中部(長野・新潟)': [
    {
      id: 'chubu-nagano-1',
      name: '1缶',
      price: 600,
    },
    {
      id: 'chubu-nagano-2-3',
      name: '2～3缶',
      price: 700,
    },
    {
      id: 'chubu-nagano-4-6',
      name: '4～6缶',
      price: 800,
    },
    {
      id: 'chubu-nagano-7-8',
      name: '7～8缶',
      price: 900,
    },
  ],

  東北: [
    {
      id: 'tohoku-1',
      name: '1缶',
      price: 900,
    },
    {
      id: 'tohoku-2-3',
      name: '2～3缶',
      price: 900,
    },
    {
      id: 'tohoku-4-6',
      name: '4～6缶',
      price: 1000,
    },
    {
      id: 'tohoku-7-8',
      name: '7～8缶',
      price: 1000,
    },
  ],

  '北海道・沖縄': [
    {
      id: 'hokkaido-1',
      name: '1缶',
      price: 1300,
    },
    {
      id: 'hokkaido-2-3',
      name: '2～3缶',
      price: 1300,
    },
    {
      id: 'hokkaido-4-6',
      name: '4～6缶',
      price: 1400,
    },
    {
      id: 'hokkaido-7-8',
      name: '7～8缶',
      price: 1400,
    },
  ],
}

/* =====================================
   localStorage
===================================== */

function loadStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key)

    if (saved === null) {
      return fallback
    }

    return JSON.parse(saved)
  } catch {
    return fallback
  }
}

/* =====================================
   商品番号を取得

   ① 商品名の最初の3桁がある場合
      001_味の宴 → 001
      425_梅サラダ → 425

   ② 商品名に3桁がない場合
      商品IDを使用
      id:405 → 405
===================================== */

function getProductCode(product) {
  if (!product) {
    return null
  }

  const name = product.name || ''

  const match = name.match(/^(\d{3})/)

  if (match) {
    return match[1]
  }

  if (
    product.id !== undefined &&
    product.id !== null
  ) {
    return String(product.id)
  }

  return null
}

/* =====================================
   商品画像のパス

   001 → /products/001.png
   425 → /products/425.png
   405 → /products/405.png
===================================== */

function getProductImage(product) {
  const code = getProductCode(product)

  if (!code) {
    return null
  }

  return `/products/${code}.png`
}

/* =====================================
   カテゴリ名表示
===================================== */

function renderCategoryName(category) {
  if (!category) {
    return ''
  }

  if (
    category.name ===
    '小袋（10袋入）ケース'
  ) {
    return (
      <>
        小袋（10袋入）
        <br />
        ケース
      </>
    )
  }

  if (
    category.name ===
    '袋・パッキン・その他'
  ) {
    return (
      <>
        袋・パッキン
        <br />
        その他
      </>
    )
  }

  return category.name
}

/* =====================================
   App
===================================== */

function App() {
  const [screen, setScreen] =
    useState('order')

  const [categories, setCategories] =
    useState(() =>
      loadStorage(
        CATEGORIES_STORAGE_KEY,
        defaultCategories,
      ),
    )

  const [selectedCategory, setSelectedCategory] =
    useState(() =>
      loadStorage(
        SELECTED_CATEGORY_STORAGE_KEY,
        1,
      ),
    )

  const [order, setOrder] = useState([])

  const [orderHistory, setOrderHistory] =
    useState(() =>
      loadStorage(
        ORDER_HISTORY_STORAGE_KEY,
        [],
      ),
    )

  const [soldOut, setSoldOut] =
    useState(() =>
      loadStorage(
        SOLD_OUT_STORAGE_KEY,
        {},
      ),
    )

  const [
    selectedShippingRegion,
    setSelectedShippingRegion,
  ] = useState(null)

  const [slideDirection, setSlideDirection] =
    useState('')

  const [latestAddedProduct, setLatestAddedProduct] =
    useState(null)

  const orderScrollRef =
    useRef(null)

  const touchStartX =
    useRef(0)

  const touchStartY =
    useRef(0)

  /* =====================================
     localStorage保存
  ===================================== */

  useEffect(() => {
    localStorage.setItem(
      CATEGORIES_STORAGE_KEY,
      JSON.stringify(categories),
    )
  }, [categories])

  useEffect(() => {
    localStorage.setItem(
      SELECTED_CATEGORY_STORAGE_KEY,
      JSON.stringify(selectedCategory),
    )
  }, [selectedCategory])

  useEffect(() => {
    localStorage.setItem(
      ORDER_HISTORY_STORAGE_KEY,
      JSON.stringify(orderHistory),
    )
  }, [orderHistory])

  useEffect(() => {
    localStorage.setItem(
      SOLD_OUT_STORAGE_KEY,
      JSON.stringify(soldOut),
    )
  }, [soldOut])

  /* =====================================
     現在のカテゴリ
  ===================================== */

  const currentCategory =
    categories.find(
      (category) =>
        category.id ===
        selectedCategory,
    ) || categories[0]

  const isShippingCategory =
    currentCategory?.id === 4

  /* =====================================
     注文合計
  ===================================== */

  const totalAmount =
    order.reduce(
      (sum, item) =>
        sum +
        item.price *
          item.quantity,
      0,
    )

  /* =====================================
     注文リスト自動スクロール
  ===================================== */

  useEffect(() => {
    if (
      orderScrollRef.current
    ) {
      orderScrollRef.current.scrollTop =
        orderScrollRef.current.scrollHeight
    }
  }, [order])

  /* =====================================
     商品を注文に追加
  ===================================== */

  function addToOrder(product) {
    if (soldOut[product.id]) {
      return
    }

    setOrder((current) => {
      const existing =
        current.find(
          (item) =>
            item.id ===
            product.id,
        )

      if (existing) {
        return current.map(
          (item) =>
            item.id ===
            product.id
              ? {
                  ...item,
                  quantity:
                    item.quantity +
                    1,
                }
              : item,
        )
      }

      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ]
    })

    const existing =
      order.find(
        (item) =>
          item.id === product.id,
      )

    setLatestAddedProduct({
      name: product.name,
      quantity:
        existing?.quantity
          ? existing.quantity + 1
          : 1,
    })
  }

  /* =====================================
     数量変更
  ===================================== */

  function changeQuantity(
    id,
    amount,
  ) {
    setOrder((current) =>
      current
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity +
                  amount,
              }
            : item,
        )
        .filter(
          (item) =>
            item.quantity > 0,
        ),
    )
  }

  /* =====================================
     注文確定
  ===================================== */

  function confirmOrder() {
    if (order.length === 0) {
      return
    }

    const newHistory = {
      id: Date.now(),
      date: new Date().toLocaleString(
        'ja-JP',
      ),
      items: order,
      total: totalAmount,
    }

    setOrderHistory(
      (current) => [
        newHistory,
        ...current,
      ],
    )

    setOrder([])

    setLatestAddedProduct(null)

    setSelectedShippingRegion(null)

    setScreen('order')
  }

  /* =====================================
     履歴削除
  ===================================== */

  function deleteHistory(id) {
    if (
      !window.confirm(
        'この履歴を削除しますか？',
      )
    ) {
      return
    }

    setOrderHistory(
      (current) =>
        current.filter(
          (item) =>
            item.id !== id,
        ),
    )
  }

  /* =====================================
     品切れ切り替え
  ===================================== */

  function toggleSoldOut(
    productId,
  ) {
    setSoldOut((current) => ({
      ...current,
      [productId]:
        !current[productId],
    }))
  }

  /* =====================================
     カテゴリ変更
  ===================================== */

  function selectCategory(id) {
    setSelectedCategory(id)

    setSelectedShippingRegion(null)

    setSlideDirection('')
  }

  /* =====================================
     スワイプでカテゴリ変更
  ===================================== */

  function changeCategory(
    id,
    direction,
  ) {
    const currentIndex =
      categories.findIndex(
        (category) =>
          category.id === id,
      )

    if (currentIndex === -1) {
      return
    }

    let nextIndex

    if (direction === 'next') {
      nextIndex =
        Math.min(
          currentIndex + 1,
          categories.length - 1,
        )
    } else {
      nextIndex =
        Math.max(
          currentIndex - 1,
          0,
        )
    }

    if (
      nextIndex === currentIndex
    ) {
      return
    }

    setSlideDirection(
      direction === 'next'
        ? 'slide-next'
        : 'slide-prev',
    )

    setSelectedCategory(
      categories[nextIndex].id,
    )

    setSelectedShippingRegion(
      null,
    )

    setTimeout(() => {
      setSlideDirection('')
    }, 250)
  }

  /* =====================================
     タッチ開始
  ===================================== */

  function handleTouchStart(
    event,
  ) {
    touchStartX.current =
      event.changedTouches[0].clientX

    touchStartY.current =
      event.changedTouches[0].clientY
  }

  /* =====================================
     タッチ終了
  ===================================== */

  function handleTouchEnd(
    event,
  ) {
    const endX =
      event.changedTouches[0].clientX

    const endY =
      event.changedTouches[0].clientY

    const diffX =
      endX -
      touchStartX.current

    const diffY =
      endY -
      touchStartY.current

    if (
      Math.abs(diffX) < 50
    ) {
      return
    }

    if (
      Math.abs(diffX) <
      Math.abs(diffY)
    ) {
      return
    }

    if (diffX < 0) {
      changeCategory(
        selectedCategory,
        'next',
      )
    } else {
      changeCategory(
        selectedCategory,
        'prev',
      )
    }
  }

  /* =====================================
     送料地域選択
  ===================================== */

  function selectShippingRegion(
    region,
  ) {
    setSelectedShippingRegion(
      region,
    )
  }

  /* =====================================
     送料を注文に追加
  ===================================== */

  function addShippingToOrder(
    option,
  ) {
    const shippingProduct = {
      id: `shipping-${option.id}`,
      name: `送料 ${selectedShippingRegion} ${option.name}`,
      price: option.price,
    }

    setOrder((current) => {
      const existing =
        current.find(
          (item) =>
            item.id ===
            shippingProduct.id,
        )

      if (existing) {
        return current.map(
          (item) =>
            item.id ===
            shippingProduct.id
              ? {
                  ...item,
                  quantity:
                    item.quantity +
                    1,
                }
              : item,
        )
      }

      return [
        ...current,
        {
          ...shippingProduct,
          quantity: 1,
        },
      ]
    })

    const existing =
      order.find(
        (item) =>
          item.id ===
          shippingProduct.id,
      )

    setLatestAddedProduct({
      name: shippingProduct.name,
      quantity:
        existing?.quantity
          ? existing.quantity + 1
          : 1,
    })

    setSelectedShippingRegion(null)
  }

  /* =====================================
     ヘッダー
  ===================================== */

  function renderHeader() {
    if (order.length === 0) {
      return (
        <header className="company-header">
          <img
            src="/header-logo.png"
            alt="高山製菓株式会社"
          />
        </header>
      )
    }

    const latestOrderItem =
      order[order.length - 1]

    return (
      <header className="company-header order-summary-header">
        <div className="latest-product">
          <span>追加：</span>

          <strong>
            {latestAddedProduct?.name ||
              latestOrderItem?.name}
          </strong>

          <span>
            ×
            {latestAddedProduct?.quantity ||
              latestOrderItem?.quantity}
          </span>
        </div>

        <div className="header-total">
          <span>合計</span>

          <strong>
            ¥
            {totalAmount.toLocaleString()}
          </strong>
        </div>
      </header>
    )
  }

  /* =====================================
     上部メニュー
  ===================================== */

  function renderTopMenu() {
    return (
      <nav className="top-menu">

        <button
          className={
            screen === 'order'
              ? 'active'
              : ''
          }
          onClick={() => {
            setScreen('order')
            setSelectedShippingRegion(
              null,
            )
          }}
        >
          注文
        </button>

        <button
          className={
            screen ===
            'order-content'
              ? 'active'
              : ''
          }
          onClick={() =>
            setScreen(
              'order-content',
            )
          }
        >
          注文内容
        </button>

        <button
          className={
            screen === 'history'
              ? 'active'
              : ''
          }
          onClick={() =>
            setScreen('history')
          }
        >
          履歴
        </button>

        <button
          className={
            screen === 'sold-out'
              ? 'active'
              : ''
          }
          onClick={() =>
            setScreen('sold-out')
          }
        >
          品切れ設定
        </button>

      </nav>
    )
  }

  /* =====================================
     カテゴリ
  ===================================== */

  function renderCategoryPanel() {
    return (
      <section className="category-panel">

        <div className="category-buttons">
          {categories.map(
            (category) => (
              <button
                key={
                  category.id
                }
                className={
                  category.id ===
                  selectedCategory
                    ? 'category-button active'
                    : 'category-button'
                }
                onClick={() =>
                  selectCategory(
                    category.id,
                  )
                }
              >
                {renderCategoryName(
                  category,
                )}
              </button>
            ),
          )}
        </div>

        <div className="current-category-name">
          {renderCategoryName(
            currentCategory,
          )}
        </div>

      </section>
    )
  }

  /* =====================================
     注文画面
  ===================================== */

  function renderOrderScreen() {
    return (
      <main className="order-main">

        {renderCategoryPanel()}

        {/* =========================
            送料カテゴリ
        ========================= */}

        {isShippingCategory ? (
          <section className="shipping-panel">

            {!selectedShippingRegion ? (
              <>
                <div className="shipping-title">
                  地域を選択
                </div>

                <div className="shipping-region-grid">
                  {Object.keys(
                    shippingOptions,
                  ).map(
                    (region) => (
                      <button
                        key={region}
                        className="shipping-region-button"
                        onClick={() =>
                          selectShippingRegion(
                            region,
                          )
                        }
                      >
                        {region}
                      </button>
                    ),
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="shipping-selected-region">
                  {
                    selectedShippingRegion
                  }
                </div>

                <div className="shipping-title">
                  個数を選択
                </div>

                <div className="shipping-options-grid">
                  {shippingOptions[
                    selectedShippingRegion
                  ].map(
                    (option) => (
                      <button
                        key={
                          option.id
                        }
                        className="shipping-option-button"
                        onClick={() =>
                          addShippingToOrder(
                            option,
                          )
                        }
                      >
                        <span className="shipping-option-name">
                          {
                            option.name
                          }
                        </span>

                        <span className="shipping-option-price">
                          ¥
                          {option.price.toLocaleString()}
                        </span>
                      </button>
                    ),
                  )}
                </div>

                <button
                  className="shipping-back-button"
                  onClick={() =>
                    setSelectedShippingRegion(
                      null,
                    )
                  }
                >
                  地域選択に戻る
                </button>
              </>
            )}

          </section>
        ) : (

          /* =========================
             通常商品
          ========================= */

          <section
            className="menu-panel"
            onTouchStart={
              handleTouchStart
            }
            onTouchEnd={
              handleTouchEnd
            }
          >

            <div
              className={`menu-scroll ${slideDirection}`}
            >

              {currentCategory?.items.map(
                (product) => {
                  const isSoldOut =
                    !!soldOut[
                      product.id
                    ]

                  const productImage =
                    getProductImage(
                      product,
                    )

                  return (
                    <button
                      key={
                        product.id
                      }
                      className={
                        isSoldOut
                          ? 'menu-item sold-out'
                          : 'menu-item'
                      }
                      disabled={
                        isSoldOut
                      }
                      onClick={() =>
                        addToOrder(
                          product,
                        )
                      }
                    >

                      {/* 商品名 */}

                      <span className="menu-item-name">
                        {product.name}
                      </span>

                      {/* 商品画像 */}

                      {productImage && (
                        <img
                          className="menu-item-image"
                          src={
                            productImage
                          }
                          alt={
                            product.name
                          }
                          onError={(
                            event,
                          ) => {
                            event.currentTarget.style.display =
                              'none'
                          }}
                        />
                      )}

                      {/* 値段 */}

                      <span className="menu-item-price">
                        ¥
                        {product.price.toLocaleString()}
                      </span>

                      {/* 品切れ */}

                      {isSoldOut && (
                        <span className="sold-out-label">
                          品切れ
                        </span>
                      )}

                    </button>
                  )
                },
              )}

            </div>

            {/* ページインジケーター */}

            <div className="page-indicator">
              {categories.map(
                (category) => (
                  <span
                    key={
                      category.id
                    }
                    className={
                      category.id ===
                      selectedCategory
                        ? 'active'
                        : ''
                    }
                  />
                ),
              )}
            </div>

          </section>
        )}
      </main>
    )
  }

  /* =====================================
     注文内容画面
  ===================================== */

  function renderOrderContentScreen() {
    return (
      <main className="order-content-screen">

        <div
          className="order-scroll"
          ref={orderScrollRef}
        >

          {order.length === 0 ? (
            <div className="empty-order">
              注文はありません
            </div>
          ) : (
            order.map(
              (item) => (
                <div
                  className="order-item"
                  key={item.id}
                >

                  <div className="order-item-name">
                    {item.name}
                  </div>

                  <div className="order-item-price">
                    ¥
                    {(
                      item.price *
                      item.quantity
                    ).toLocaleString()}
                  </div>

                  <div className="quantity-controls">

                    <button
                      onClick={() =>
                        changeQuantity(
                          item.id,
                          -1,
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {
                        item.quantity
                      }
                    </span>

                    <button
                      onClick={() =>
                        changeQuantity(
                          item.id,
                          1,
                        )
                      }
                    >
                      ＋
                    </button>

                  </div>

                </div>
              ),
            )
          )}

        </div>

        <div className="total-row">
          <span>
            合計
          </span>

          <strong>
            ¥
            {totalAmount.toLocaleString()}
          </strong>
        </div>

        <button
          className="confirm"
          disabled={
            order.length === 0
          }
          onClick={
            confirmOrder
          }
        >
          注文を確定
        </button>

      </main>
    )
  }

  /* =====================================
     履歴画面
  ===================================== */

  function renderHistoryScreen() {
    return (
      <main className="history">

        {orderHistory.length === 0 ? (
          <div className="empty-history">
            履歴はありません
          </div>
        ) : (
          orderHistory.map(
            (item) => (
              <div
                className="history-item"
                key={item.id}
              >

                <div className="history-header">

                  <span>
                    {item.date}
                  </span>

                  <button
                    onClick={() =>
                      deleteHistory(
                        item.id,
                      )
                    }
                  >
                    削除
                  </button>

                </div>

                {item.items.map(
                  (food) => (
                    <div
                      className="history-food"
                      key={food.id}
                    >

                      <span>
                        {food.name}{' '}
                        ×
                        {
                          food.quantity
                        }
                      </span>

                      <span>
                        ¥
                        {(
                          food.price *
                          food.quantity
                        ).toLocaleString()}
                      </span>

                    </div>
                  ),
                )}

                <div className="history-total">
                  合計{' '}
                  {item.total.toLocaleString()}{' '}
                  円
                </div>

              </div>
            ),
          )
        )}

      </main>
    )
  }

  /* =====================================
     品切れ設定画面
     ※送料カテゴリは除外
  ===================================== */

  function renderSoldOutScreen() {
    const productCategories =
      categories.filter(
        (category) =>
          category.id !== 4,
      )

    return (
      <main className="sold-out-screen">

        <div className="sold-out-description">
          品切れの商品をタップしてください。
        </div>

        {productCategories.map(
          (category) => (
            <section
              className="sold-out-category"
              key={
                category.id
              }
            >

              <h2>
                {renderCategoryName(
                  category,
                )}
              </h2>

              <div className="sold-out-grid">

                {category.items.map(
                  (product) => {
                    const isSoldOut =
                      !!soldOut[
                        product.id
                      ]

                    return (
                      <button
                        key={
                          product.id
                        }
                        className={
                          isSoldOut
                            ? 'sold-out-setting-button active'
                            : 'sold-out-setting-button'
                        }
                        onClick={() =>
                          toggleSoldOut(
                            product.id,
                          )
                        }
                      >

                        <span>
                          {
                            product.name
                          }
                        </span>

                        <strong>
                          {isSoldOut
                            ? '品切れ'
                            : '販売中'}
                        </strong>

                      </button>
                    )
                  },
                )}

              </div>

            </section>
          ),
        )}

      </main>
    )
  }

  /* =====================================
     アプリ表示
  ===================================== */

  return (
    <div className="app">

      {renderHeader()}

      {renderTopMenu()}

      {screen === 'order' &&
        renderOrderScreen()}

      {screen ===
        'order-content' &&
        renderOrderContentScreen()}

      {screen === 'history' &&
        renderHistoryScreen()}

      {screen === 'sold-out' &&
        renderSoldOutScreen()}

    </div>
  )
}

export default App