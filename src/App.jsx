import { useEffect, useRef, useState } from 'react'
import './App.css'

const APP_DATA_VERSION = 5

const CATEGORIES_STORAGE_KEY = `categories_v${APP_DATA_VERSION}`
const SELECTED_CATEGORY_STORAGE_KEY = `selectedCategory_v${APP_DATA_VERSION}`
const ORDER_HISTORY_STORAGE_KEY = `orderHistory_v${APP_DATA_VERSION}`
const SOLD_OUT_STORAGE_KEY = `soldOut_v${APP_DATA_VERSION}`

const defaultCategories = [
  {
    id: 1,
    name: '化粧缶',
    items: [
      {
        id: 1,
        name: '001_味の宴',
        price: 3600,
        image: '/products/001.png',
      },
      { id: 2, name: '002_味くらべ', price: 2500 },
      { id: 3, name: '003_ころもち(個々包装)', price: 2700 },
      { id: 4, name: '004_ころもち(ばら詰)', price: 2700 },
      { id: 5, name: '005_華の友', price: 2700 },
      { id: 6, name: '006_四季の集', price: 2500 },
      { id: 7, name: '007_蓬莱', price: 2500 },
      { id: 8, name: '009_マヨネーズ風味', price: 2500 },
      { id: 9, name: '010_海老サラダ', price: 2500 },
      { id: 10, name: '011_田舎焼', price: 2500 },
      { id: 11, name: '013_飛鳥', price: 2500 },
    ],
  },
  {
    id: 2,
    name: '小袋（10袋入）ケース',
    items: [
      { id: 101, name: '100_袋入 詰め合わせ', price: 3600 },
      { id: 102, name: '104_袋入 ころもち', price: 3800 },
      { id: 103, name: '105_袋入 華の友', price: 3800 },
      { id: 104, name: '109_袋入 マヨネーズ風味', price: 3600 },
      { id: 105, name: '110_袋入 海老サラダ', price: 3600 },
      { id: 106, name: '111_袋入 田舎焼', price: 3600 },
      { id: 107, name: '114_袋入 松しぐれ', price: 3600 },
    ],
  },
  {
    id: 3,
    name: '限定商品・大箱',
    items: [
      { id: 201, name: '433_高山「極」甘醤油', price: 1300 },
      { id: 202, name: '425_梅サラダ', price: 600 },
      { id: 203, name: '418_うるちサラダ', price: 600 },
      { id: 204, name: '420_昔風味 塩味', price: 600 },
      { id: 205, name: '421_昔風味 黒砂糖味', price: 600 },
      { id: 206, name: '402_大箱 味くらべ', price: 6500 },
      { id: 207, name: '403_大箱 ころもち(個々包装)', price: 7000 },
      { id: 208, name: '404_大箱 ころもち(ばら詰)', price: 7500 },
      { id: 209, name: '407_大箱 蓬莱', price: 6000 },
    ],
  },
  {
    id: 4,
    name: '送料',
    items: [
      { id: 301, name: '近畿・中国', price: 500 },
      { id: 302, name: '関東・四国・九州', price: 600 },
      {
        id: 303,
        name: '中部(愛知・石川・岐阜・静岡・富山・福井・三重)',
        price: 500,
      },
      { id: 304, name: '中部（長野・新潟）', price: 600 },
      { id: 305, name: '東北', price: 900 },
      { id: 306, name: '北海道・沖縄', price: 1300 },
    ],
  },
  {
    id: 5,
    name: '袋・パッキン・その他',
    items: [
      { id: 401, name: '971_紙袋 小', price: 40 },
      { id: 402, name: '972_紙袋 大', price: 60 },
      { id: 403, name: '973_ビニール袋 小(5枚)', price: 30 },
      { id: 404, name: '974_ビニール袋 大(5枚)', price: 60 },
      { id: 405, name: '981_1缶用パッキン', price: 80 },
      { id: 406, name: '982_2缶用パッキン', price: 100 },
      { id: 407, name: '983_3缶用パッキン', price: 110 },
      { id: 408, name: '984_4缶用パッキン', price: 130 },
      { id: 409, name: '986_6缶用パッキン', price: 150 },
      { id: 410, name: '952_包装紙', price: 30 },
    ],
  },
  {
    id: 6,
    name: '割れおかき',
    items: [
      { id: 501, name: '801_割れ 手赤', price: 3500 },
      { id: 502, name: '802_割れ 手白', price: 3500 },
      { id: 503, name: '803_割れ 蓬莱', price: 3500 },
      { id: 504, name: '804_割れ 老松', price: 3500 },
      { id: 505, name: '805_割れ 浦島', price: 3500 },
      { id: 506, name: '806_割れ 豆かき', price: 3500 },
      { id: 507, name: '807_割れ 田舎焼', price: 3000 },
      { id: 508, name: '808_割れ 海老サラダ', price: 3000 },
    ],
  },
  {
    id: 7,
    name: '詰替パック',
    items: [
      { id: 601, name: '304_詰替 ころもち', price: 1500 },
      { id: 602, name: '309_詰替 マヨネーズ風味', price: 1300 },
      { id: 603, name: '310_詰替 海老サラダ', price: 1300 },
      { id: 604, name: '311_詰替 田舎焼', price: 1300 },
      { id: 605, name: '312_詰替 蓬莱・老松・浦島', price: 1300 },
      { id: 606, name: '314_詰替 松しぐれ', price: 1300 },
      { id: 607, name: '316_詰替 豆かき', price: 1900 },
    ],
  },
]

const shippingOptions = {
  '近畿・中国': [
    { id: 'kinki-1', name: '1缶', price: 500 },
    { id: 'kinki-2-3', name: '2～3缶', price: 600 },
    { id: 'kinki-4-6', name: '4～6缶', price: 700 },
    { id: 'kinki-7-8', name: '7～8缶', price: 800 },
  ],

  '関東・四国・九州': [
    { id: 'kanto-1', name: '1缶', price: 600 },
    { id: 'kanto-2-3', name: '2～3缶', price: 700 },
    { id: 'kanto-4-6', name: '4～6缶', price: 800 },
    { id: 'kanto-7-8', name: '7～8缶', price: 900 },
  ],

  '中部(愛知・石川・岐阜・静岡・富山・福井・三重)': [
    { id: 'chubu-aichi-1', name: '1缶', price: 500 },
    { id: 'chubu-aichi-2-3', name: '2～3缶', price: 600 },
    { id: 'chubu-aichi-4-6', name: '4～6缶', price: 700 },
    { id: 'chubu-aichi-7-8', name: '7～8缶', price: 800 },
  ],

  '中部（長野・新潟）': [
    { id: 'chubu-nagano-1', name: '1缶', price: 600 },
    { id: 'chubu-nagano-2-3', name: '2～3缶', price: 700 },
    { id: 'chubu-nagano-4-6', name: '4～6缶', price: 800 },
    { id: 'chubu-nagano-7-8', name: '7～8缶', price: 900 },
  ],

  東北: [
    { id: 'tohoku-1', name: '1缶', price: 900 },
    { id: 'tohoku-2-3', name: '2～3缶', price: 900 },
    { id: 'tohoku-4-6', name: '4～6缶', price: 1000 },
    { id: 'tohoku-7-8', name: '7～8缶', price: 1000 },
  ],

  '北海道・沖縄': [
    { id: 'hokkaido-1', name: '1缶', price: 1300 },
    { id: 'hokkaido-2-3', name: '2～3缶', price: 1300 },
    { id: 'hokkaido-4-6', name: '4～6缶', price: 1400 },
    { id: 'hokkaido-7-8', name: '7～8缶', price: 1400 },
  ],
}

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

function normalizeCategories(categories) {
  if (!Array.isArray(categories)) {
    return categories
  }

  const packingCodes = {
    401: '971_紙袋 小',
    402: '972_紙袋 大',
    403: '973_ビニール袋 小(5枚)',
    404: '974_ビニール袋 大(5枚)',
    405: '981_1缶用パッキン',
    406: '982_2缶用パッキン',
    407: '983_3缶用パッキン',
    408: '984_4缶用パッキン',
    409: '986_6缶用パッキン',
    410: '952_包装紙',
  }

  return categories.map((category) => ({
    ...category,
    items: Array.isArray(category.items)
      ? category.items.map((product) => {
          if (category.id === 5 && packingCodes[product?.id]) {
            return {
              ...product,
              name: packingCodes[product.id],
            }
          }

          return product
        })
      : [],
  }))
}

function renderCategoryName(category) {
  if (!category) {
    return ''
  }

  if (category.name === '小袋（10袋入）ケース') {
    return (
      <>
        小袋(10袋入)
        <br />
        ケース
      </>
    )
  }

  if (category.name === '限定商品・大箱') {
    return (
      <>
        限定商品
        <br />
        大箱
      </>
    )
  }

  if (category.name === '袋・パッキン・その他') {
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

function getProductCode(product) {
  if (!product) {
    return ''
  }

  const rawName = String(product.name || '')
  const match = rawName.match(/^(\d{3})_/)

  return match ? match[1] : ''
}

function getProductImage(product) {
  if (!product || String(product.id || '').startsWith('shipping-')) {
    return null
  }

  if (getProductCode(product) === '001') {
    return '/products/001.png'
  }

  if (product.image) {
    return product.image
  }

  const code = getProductCode(product)

  return code ? `/products/${code}.png` : null
}

function getProductImageCandidates(product) {
  if (!product || String(product.id || '').startsWith('shipping-')) {
    return []
  }

  if (getProductCode(product) === '001') {
    return ['/products/001.png']
  }

  if (product.image) {
    return [product.image]
  }

  const code = getProductCode(product)

  if (!code) {
    return []
  }

  return [
    `/products/${code}.png`,
    `/products/${code}.jpg`,
    `/products/${code}.jpeg`,
  ]
}

function getProductDisplay(product) {
  if (!product) {
    return { code: '', label: '', name: '', subName: '' }
  }

  const rawName = String(product.name || '')

  if (String(product.id || '').startsWith('shipping-')) {
    const shippingMatch = rawName.match(/^送料\s+(.+?)(\([^)]*\)|（[^）]*）)\s+(.+)$/)

    if (shippingMatch) {
      return {
        code: '',
        label: '送料 ' + shippingMatch[1],
        name: shippingMatch[2],
        subName: shippingMatch[3],
      }
    }

    return {
      code: '',
      label: '',
      name: rawName,
      subName: '',
    }
  }

  const codeMatch = rawName.match(/^(\d{3})_(.*)$/)

  const code = codeMatch
    ? codeMatch[1]
    : getProductCode(product)

  let displayName = codeMatch
    ? codeMatch[2]
    : rawName

  let label = ''

  const spaceMatch = displayName.match(/^(\S+)[\s　]+(.+)$/)

  if (spaceMatch) {
    label = spaceMatch[1].trim()
    displayName = spaceMatch[2].trim()
  }

  // 袋・パッキン系は「3桁数字だけ」を1行目にする
  if (['971', '972', '973', '974', '981', '982', '983', '984', '985', '986', '952'].includes(code)) {
    label = ''

    if (codeMatch) {
      displayName = codeMatch[2].trim()
    }
  }

  let subName = ''
  const parenthesisMatch = displayName.match(/^(.*?)(\s*[\(（].*[\)）])$/)

  if (parenthesisMatch) {
    displayName = parenthesisMatch[1].trim()
    subName = parenthesisMatch[2].trim()
  }

  return { code, label, name: displayName, subName }
}

function getMenuItemNameClass(name) {
  const text = String(name || '')

  if (text.includes('マヨネーズ風味')) {
    return 'menu-item-name name-mayonnaise'
  }

  const length = text.length

  if (length >= 14) {
    return 'menu-item-name name-extra-long'
  }

  if (length >= 8) {
    return 'menu-item-name name-long'
  }

  return 'menu-item-name'
}

function renderShippingRegionName(region) {
  const text = String(region || '')
  const match = text.match(/^(.*?)[(（](.*?)[)）]$/)

  if (!match) {
    return text
  }

  const title = match[1]
  const inside = match[2]

  if (title === '中部' && inside.includes('愛知')) {
    return (
      <span className="shipping-region-name shipping-region-name-chubu">
        <span className="shipping-region-main">中部</span>
        <span className="shipping-region-detail shipping-region-detail-chubu">
          <span className="shipping-region-lines">
            <span>愛知・石川・岐阜・静岡</span>
            <span>富山・福井・三重</span>
          </span>
        </span>
      </span>
    )
  }

  if (title === '中部') {
    return (
      <span className="shipping-region-name">
        <span className="shipping-region-main">中部</span>
        <span className="shipping-region-detail">
          {inside}
        </span>
      </span>
    )
  }

  return (
    <span className="shipping-region-name">
      <span className="shipping-region-main">{title}</span>
      <span className="shipping-region-detail">（{inside}）</span>
    </span>
  )
}

function App() {
  const [screen, setScreen] = useState('order')

  const [categories, setCategories] = useState(() =>
    normalizeCategories(
      loadStorage(
        CATEGORIES_STORAGE_KEY,
        defaultCategories,
      ),
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

  const [soldOut, setSoldOut] = useState(() =>
    loadStorage(
      SOLD_OUT_STORAGE_KEY,
      {},
    ),
  )

  const [selectedShippingRegion, setSelectedShippingRegion] =
    useState(null)

  const [slideDirection, setSlideDirection] =
    useState('')

  const [latestAddedProduct, setLatestAddedProduct] =
    useState(null)

  const [categoryReorderMode, setCategoryReorderMode] =
    useState(false)

  const categoryLongPressTimer = useRef(null)
  const categoryDragId = useRef(null)
  const categoryDragStartX = useRef(0)
  const categoryDragMoved = useRef(false)

  const orderScrollRef = useRef(null)

  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

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

  const currentCategory =
    categories.find(
      (category) =>
        category.id === selectedCategory,
    ) || categories[0]

  const isShippingCategory =
    currentCategory?.id === 4

  const totalAmount = order.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0,
  )

  useEffect(() => {
    if (orderScrollRef.current) {
      orderScrollRef.current.scrollTop =
        orderScrollRef.current.scrollHeight
    }
  }, [order])

  function addToOrder(product) {
    if (soldOut[product.id]) {
      return
    }

    setOrder((current) => {
      const existing = current.find(
        (item) => item.id === product.id,
      )

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
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

    const existing = order.find(
      (item) => item.id === product.id,
    )

    setLatestAddedProduct({
      name: product.name,
      quantity:
        existing?.quantity
          ? existing.quantity + 1
          : 1,
    })

  }

  function changeQuantity(id, amount) {
    setOrder((current) =>
      current
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity + amount,
              }
            : item,
        )
        .filter(
          (item) => item.quantity > 0,
        ),
    )
  }

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

    setOrderHistory((current) => [
      newHistory,
      ...current,
    ])

    setOrder([])

    setLatestAddedProduct(null)

    setSelectedShippingRegion(null)

    setScreen('order')
  }

  function deleteHistory(id) {
    if (
      !window.confirm(
        'この履歴を削除しますか？',
      )
    ) {
      return
    }

    setOrderHistory((current) =>
      current.filter(
        (item) => item.id !== id,
      ),
    )
  }

  function toggleSoldOut(productId) {
    setSoldOut((current) => ({
      ...current,
      [productId]:
        !current[productId],
    }))
  }

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

    const nextIndex =
      direction === 'next'
        ? Math.min(
            currentIndex + 1,
            categories.length - 1,
          )
        : Math.max(
            currentIndex - 1,
            0,
          )

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

    setSelectedShippingRegion(null)

    setTimeout(() => {
      setSlideDirection('')
    }, 250)
  }

  function handleTouchStart(event) {
    touchStartX.current =
      event.changedTouches[0].clientX

    touchStartY.current =
      event.changedTouches[0].clientY
  }

  function handleTouchEnd(event) {
    const endX =
      event.changedTouches[0].clientX

    const endY =
      event.changedTouches[0].clientY

    const diffX =
      endX - touchStartX.current

    const diffY =
      endY - touchStartY.current

    if (Math.abs(diffX) < 50) {
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

  function selectShippingRegion(
    region,
  ) {
    setSelectedShippingRegion(
      region,
    )
  }

  function addShippingToOrder(
    option,
  ) {
    const shippingProduct = {
      id: `shipping-${option.id}`,
      name: `送料 ${selectedShippingRegion} ${option.name}`,
      price: option.price,
    }

    setOrder((current) => {
      const existing = current.find(
        (item) =>
          item.id ===
          shippingProduct.id,
      )

      if (existing) {
        return current.map((item) =>
          item.id ===
          shippingProduct.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
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

    const existing = order.find(
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

  function clearCategoryLongPress() {
    if (categoryLongPressTimer.current) {
      clearTimeout(categoryLongPressTimer.current)
      categoryLongPressTimer.current = null
    }
  }

  function handleCategoryPointerDown(event, category) {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return
    }

    clearCategoryLongPress()
    categoryDragId.current = category.id
    categoryDragStartX.current = event.clientX
    categoryDragMoved.current = false

    categoryLongPressTimer.current = setTimeout(() => {
      setCategoryReorderMode(true)
      categoryDragMoved.current = false
    }, 500)
  }

  function handleCategoryPointerMove(event) {
    if (categoryDragId.current === null) {
      return
    }

    if (Math.abs(event.clientX - categoryDragStartX.current) > 8) {
      categoryDragMoved.current = true
    }

    if (!categoryReorderMode) {
      return
    }

    const buttons = Array.from(
      document.querySelectorAll('.category-button'),
    )

    if (buttons.length === 0) {
      return
    }

    let targetIndex = -1

    for (let index = 0; index < buttons.length; index += 1) {
      const rect = buttons[index].getBoundingClientRect()

      if (event.clientX >= rect.left && event.clientX <= rect.right) {
        targetIndex = index
        break
      }
    }

    if (targetIndex === -1) {
      return
    }

    setCategories((current) => {
      const fromIndex = current.findIndex(
        (item) => item.id === categoryDragId.current,
      )

      if (fromIndex === -1 || fromIndex === targetIndex) {
        return current
      }

      const next = [...current]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(targetIndex, 0, moved)
      return next
    })
  }

  function handleCategoryPointerUp(event) {
    clearCategoryLongPress()

    const wasReordering = categoryReorderMode
    const moved = categoryDragMoved.current
    const draggedId = categoryDragId.current

    categoryDragId.current = null
    categoryDragMoved.current = false
    setCategoryReorderMode(false)

    if (wasReordering || moved) {
      event.preventDefault()
    }

    if (!wasReordering && !moved && draggedId !== null) {
      selectCategory(draggedId)
    }
  }

  function handleCategoryPointerCancel() {
    clearCategoryLongPress()
    categoryDragId.current = null
    categoryDragMoved.current = false
    setCategoryReorderMode(false)
  }

  function selectCategory(id) {
    setSelectedCategory(id)

    setSelectedShippingRegion(null)

    setSlideDirection('')
  }

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

    return (
      <header className="company-header order-summary-header">
        <button
          type="button"
          className="latest-product"
          onClick={() => setScreen('order-content')}
          aria-label="注文内容を表示"
        >
          <span>追加：</span>

          <strong>
            {latestAddedProduct?.name ||
              order[
                order.length - 1
              ]?.name}
          </strong>

          <span>
            ×
            {latestAddedProduct?.quantity ||
              order[
                order.length - 1
              ]?.quantity}
          </span>
        </button>

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
            screen === 'history'
              ? 'active'
              : ''
          }
          onClick={() => setScreen('history')}
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

  function renderCategoryPanel() {
    return (
      <section className="category-panel">
        <div
          className={
            categoryReorderMode
              ? 'category-buttons category-reorder-mode'
              : 'category-buttons'
          }
          onPointerMove={handleCategoryPointerMove}
          onPointerUp={handleCategoryPointerUp}
          onPointerCancel={handleCategoryPointerCancel}
          onPointerLeave={(event) => {
            if (categoryReorderMode) {
              handleCategoryPointerUp(event)
            }
          }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={
                category.id === selectedCategory
                  ? 'category-button active'
                  : 'category-button'
              }
              onPointerDown={(event) =>
                handleCategoryPointerDown(event, category)
              }
              onClick={(event) => {
                if (categoryReorderMode || categoryDragMoved.current) {
                  event.preventDefault()
                  event.stopPropagation()
                }
              }}
            >
              {renderCategoryName(category)}
            </button>
          ))}
        </div>
      </section>
    )
  }

  function renderOrderScreen() {
    return (
      <main className="order-main">
        {/* カテゴリ */}
        {renderCategoryPanel()}

        {/* 送料 */}
        {isShippingCategory ? (
          <section
            className="shipping-panel"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {!selectedShippingRegion ? (
              <>
                <div className="shipping-title">
                  地域を選択
                </div>

                <div className="shipping-region-grid">
                  {Object.keys(
                    shippingOptions,
                  ).map((region) => (
                    <button
                      key={region}
                      className="shipping-region-button"
                      onClick={() =>
                        selectShippingRegion(
                          region,
                        )
                      }
                    >
                      {renderShippingRegionName(region)}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="shipping-selected-region">
                  {renderShippingRegionName(selectedShippingRegion)}
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
          /* 通常商品 */
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
                  const isSoldOut = !!soldOut[product.id]
                  const productImage = getProductImage(product)

                  return (
                    <button
                      key={product.id}
                      className={
                        isSoldOut
                          ? `menu-item sold-out category-${currentCategory?.id || ''}`
                          : `menu-item category-${currentCategory?.id || ''}`
                      }
                      disabled={isSoldOut}
                      onClick={() => addToOrder(product)}
                    >
                      {productImage ? (
                        <img
                          className="menu-item-image"
                          src={productImage}
                          alt=""
                          onError={(event) => {
                            const candidates = getProductImageCandidates(product)
                            const currentIndex = Number(event.currentTarget.dataset.imageIndex || '0')
                            const nextIndex = currentIndex + 1

                            if (nextIndex < candidates.length) {
                              event.currentTarget.dataset.imageIndex = String(nextIndex)
                              event.currentTarget.src = candidates[nextIndex]
                            } else {
                              event.currentTarget.style.display = 'none'
                            }
                          }}
                        />
                      ) : null}

                      <div className="menu-item-info">
                        {(() => {
                          const display = getProductDisplay(product)

                          return (
                            <>
                              <div className="menu-item-heading">
                                {display.code && (
                                  <span className="menu-item-code">
                                    {display.code}
                                  </span>
                                )}
                                {display.label && (
                                  <span className="menu-item-label">
                                    {display.label}
                                  </span>
                                )}
                              </div>

                              <div className={getMenuItemNameClass(display.name)}>
                                <span>{display.name}</span>
                                {display.subName && (
                                  <span className="menu-item-subname">
                                    {display.subName}
                                  </span>
                                )}
                              </div>

                              <span className="menu-item-price">
                                ¥{product.price.toLocaleString()}
                              </span>
                            </>
                          )
                        })()}
                      </div>

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
            order.map((item) => (
              <div
                className={
                  String(item.id || '').startsWith('shipping-')
                    ? 'order-item order-item-shipping'
                    : 'order-item'
                }
                key={item.id}
              >
                {getProductImage(item) ? (
                  <img
                    className="order-item-image"
                    src={getProductImage(item)}
                    alt=""
                    onError={(event) => {
                      const candidates = getProductImageCandidates(item)
                      const currentIndex = Number(event.currentTarget.dataset.imageIndex || '0')
                      const nextIndex = currentIndex + 1

                      if (nextIndex < candidates.length) {
                        event.currentTarget.dataset.imageIndex = String(nextIndex)
                        event.currentTarget.src = candidates[nextIndex]
                      } else {
                        event.currentTarget.style.display = 'none'
                      }
                    }}
                  />
                ) : (
                  <div className="order-item-image-placeholder" aria-hidden="true" />
                )}

                {(() => {
                  const display = getProductDisplay(item)

                  return (
                    <div className="order-item-info">
                      <div className="order-item-name">
                        <div className="order-item-heading">
                          {display.code && (
                            <span className="order-item-code">
                              {display.code}
                            </span>
                          )}
                          {display.label && (
                            <span className="order-item-label">
                              {display.label}
                            </span>
                          )}
                        </div>

                        <div className="order-item-name-text">
                          <span>{display.name}</span>
                          {display.subName && (
                            <span className="order-item-subname">
                              {display.subName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })()}

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
                    {item.quantity}
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
            ))
          )}
        </div>

        <div className="total-row">
          <span>合計</span>

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
          onClick={confirmOrder}
        >
          注文を確定
        </button>
      </main>
    )
  }

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
              key={category.id}
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