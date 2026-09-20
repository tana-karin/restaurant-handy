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
      { id: 8, name: '009_ﾏﾖﾈｰｽﾞ風味', price: 2500 },
      { id: 9, name: '010_海老ｻﾗﾀﾞ', price: 2500 },
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
      { id: 104, name: '109_袋入 ﾏﾖﾈｰｽﾞ風味', price: 3600 },
      { id: 105, name: '110_袋入 海老ｻﾗﾀﾞ', price: 3600 },
      { id: 106, name: '111_袋入 田舎焼', price: 3600 },
      { id: 107, name: '114_袋入 松しぐれ', price: 3600 },
    ],
  },
  {
    id: 3,
    name: '限定商品・大箱',
    items: [
      { id: 201, name: '433_高山「極」甘醤油', price: 1300 },
      { id: 202, name: '425_梅ｻﾗﾀﾞ', price: 600 },
      { id: 203, name: '418_うるちｻﾗﾀﾞ', price: 600 },
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
      { id: 403, name: '973_ﾋﾞﾆｰﾙ袋 小(5枚)', price: 30 },
      { id: 404, name: '974_ﾋﾞﾆｰﾙ袋 大(5枚)', price: 60 },
      { id: 405, name: '981_1缶用ﾊﾟｯｷﾝ', price: 80 },
      { id: 406, name: '982_2缶用ﾊﾟｯｷﾝ', price: 100 },
      { id: 407, name: '983_3缶用ﾊﾟｯｷﾝ', price: 110 },
      { id: 408, name: '984_4缶用ﾊﾟｯｷﾝ', price: 130 },
      { id: 409, name: '986_6缶用ﾊﾟｯｷﾝ', price: 150 },
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
      { id: 508, name: '808_割れ 海老ｻﾗﾀﾞ', price: 3000 },
    ],
  },
  {
    id: 7,
    name: '詰替パック',
    items: [
      { id: 601, name: '304_詰替 ころもち', price: 1500 },
      { id: 602, name: '309_詰替 ﾏﾖﾈｰｽﾞ風味', price: 1300 },
      { id: 603, name: '310_詰替 海老ｻﾗﾀﾞ', price: 1300 },
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

// --------------------------------------------------
// localStorageから保存済みデータを読み込む処理
// --------------------------------------------------
// ・指定されたキーに保存データがあるか確認する
// ・データが存在する場合はJSON文字列を元のデータに戻す
// ・保存データがない場合、または壊れたJSONの場合はfallbackを返す
// ・この処理により、保存データの異常でアプリ全体が停止するのを防ぐ
// --------------------------------------------------
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

// --------------------------------------------------
// 商品カテゴリーの保存データを現在の正式な商品名に合わせる処理
// --------------------------------------------------
// ・localStorageに古い商品名が残っている場合でも、現在の正式名称を表示する
// ・特に袋・ﾊﾟｯｷﾝ系の商品名は商品IDを基準に正式名称へ統一する
// ・価格、商品画像、カテゴリー順など、商品名以外のデータは変更しない
// ・保存データが配列ではない場合は、そのまま返して初期化側で処理する
// --------------------------------------------------
// --------------------------------------------------
// 保存済み商品名を現在の表記へそろえる処理
// --------------------------------------------------
// ・以前のlocalStorageに全角の「マヨネーズ」「サラダ」などが残っていても、
//   現在の指定表記で表示できるように商品名だけを変換します。
// ・カテゴリ名や価格、商品ID、並び順などは変更しません。
// ・この処理後も、現在のカテゴリ配列そのものはそのまま保存されるため、
//   ユーザーが並べ替えたカテゴリ順も維持されます。
// --------------------------------------------------
function normalizeProductName(name) {
  return String(name || '')
    .replaceAll('マヨネーズ', 'ﾏﾖﾈｰｽﾞ')
    .replaceAll('サラダ', 'ｻﾗﾀﾞ')
    .replaceAll('ビニール', 'ﾋﾞﾆｰﾙ')
    .replaceAll('パッキン', 'ﾊﾟｯｷﾝ')
}

function normalizeCategories(categories) {
  if (!Array.isArray(categories)) {
    return categories
  }

  const packingCodes = {
    401: '971_紙袋 小',
    402: '972_紙袋 大',
    403: '973_ﾋﾞﾆｰﾙ袋 小(5枚)',
    404: '974_ﾋﾞﾆｰﾙ袋 大(5枚)',
    405: '981_1缶用ﾊﾟｯｷﾝ',
    406: '982_2缶用ﾊﾟｯｷﾝ',
    407: '983_3缶用ﾊﾟｯｷﾝ',
    408: '984_4缶用ﾊﾟｯｷﾝ',
    409: '986_6缶用ﾊﾟｯｷﾝ',
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

          return {
            ...product,
            name: normalizeProductName(product?.name),
          }
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


  if (product.image) {
    return [product.image]
  }

  const code = getProductCode(product)

  if (!code) {
    return []
  }

  const candidates = [
    `/products/${code}.png`,
    `/products/${code}.jpg`,
    `/products/${code}.jpeg`,
  ]

  // 001「味の宴」は、画像ファイル名が商品番号ではなく
  // 「味の宴.png」や既存のutageSS.jpgになっている場合にも表示できるようにします。
  // 商品番号画像が存在する場合は、これまでどおり商品番号画像を最初に使用します。
  if (code === '001') {
    candidates.push('/products/味の宴.png')
    candidates.push('/products/utageSS.jpg')
    candidates.push('/味の宴.png')
    candidates.push('/utageSS.jpg')
    candidates.push('/utageSS(1).jpg')
    candidates.push('/utageSS(2).jpg')
  }

  return candidates
}

function getProductDisplay(product) {
  if (!product) {
    return { code: '', label: '', name: '', subName: '', shippingOption: '' }
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
  if (['971', '972', '973', '974', '981', '982', '983', '984', '986', '952'].includes(code)) {
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

  if (text.includes('ﾏﾖﾈｰｽﾞ風味')) {
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
  const text = String(region || '').replace(/\s+/g, ' ').trim()

  if (text === '中部 愛知・石川・岐阜・静岡・富山・福井・三重') {
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

  if (text === '中部 長野・新潟') {
    return (
      <span className="shipping-region-name">
        <span className="shipping-region-main">中部</span>
        <span className="shipping-region-detail">長野・新潟</span>
      </span>
    )
  }

  const match = text.match(/^(.*?)[(（](.*?)[)）]$/)
  if (!match) {
    return text
  }

  const title = match[1].trim()
  const inside = match[2].trim()

  return (
    <span className="shipping-region-name">
      <span className="shipping-region-main">{title}</span>
      <span className="shipping-region-detail">（{inside}）</span>
    </span>
  )
}

function renderOrderItemDisplay(item) {
  const display = getProductDisplay(item)
  const isShipping = String(item?.id || '').startsWith('shipping-')
  if (!isShipping) return display

  const raw = String(item?.name || '')
  const match = raw.match(/^送料\s+中部\s+(愛知・石川・岐阜・静岡・富山・福井・三重|長野・新潟)\s+(.+)$/)
  if (match) {
    if (match[1].includes('愛知')) {
      return {
        ...display,
        code: '',
        label: '送料 中部',
        name: '愛知・石川・岐阜・静岡',
        subName: '富山・福井・三重',
        shippingOption: match[2],
      }
    }
    return {
      ...display,
      code: '',
      label: '送料 中部',
      name: '長野・新潟',
      subName: '',
      shippingOption: match[2],
    }
  }

  return display
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

  // --------------------------------------------------
// 通常商品を注文内容へ追加する処理
// --------------------------------------------------
// ・品切れ設定されている商品は追加しない
// ・同じ商品がすでに注文にある場合は数量を1個増やす
// ・まだ注文にない商品なら、商品番号・商品名・価格・数量を新規追加する
// ・最後に追加した商品の情報を更新し、画面上部の「追加：商品名 ×数量」に反映する
// ・商品ボタンを押しただけでは注文内容画面へ移動しない
// --------------------------------------------------
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

  // --------------------------------------------------
// 注文商品の数量を増減する処理
// --------------------------------------------------
// ・amountが+1なら数量を1つ増やす
// ・amountが-1なら数量を1つ減らす
// ・数量が0以下になった商品は注文一覧から削除する
// --------------------------------------------------
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

  // --------------------------------------------------
// 現在の注文を確定して履歴へ保存する処理
// --------------------------------------------------
// ・注文が空の場合は何もしない
// ・注文日時、注文商品、合計金額を1件の履歴データとして作成する
// ・新しい履歴を履歴一覧の先頭へ追加する
// ・確定後は現在の注文を空に戻す
// ・送料選択状態と上部の追加商品表示もリセットして注文画面へ戻る
// ・「注文を確定しました」のポップアップは表示しない
// --------------------------------------------------
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

  // --------------------------------------------------
// 商品の品切れ／販売中を切り替える処理
// --------------------------------------------------
// ・対象商品のIDをキーにして現在の状態を反転する
// ・品切れにすると通常の商品ボタンは押せなくなる
// ・状態はuseEffectを通してlocalStorageにも保存される
// --------------------------------------------------
function toggleSoldOut(productId) {
    setSoldOut((current) => ({
      ...current,
      [productId]:
        !current[productId],
    }))
  }

  // --------------------------------------------------
// スワイプによってカテゴリーを前後へ切り替える処理
// --------------------------------------------------
// ・現在選択中のカテゴリー位置を探す
// ・nextなら次のカテゴリー、prevなら前のカテゴリーへ移動する
// ・端まで到達している場合は、それ以上移動しない
// ・切り替え時にスライド用CSSクラスを設定し、短時間後に解除する
// ・送料カテゴリーから別カテゴリーへ移動した場合は地域選択状態も解除する
// --------------------------------------------------
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

  // --------------------------------------------------
// 選択した送料を注文内容へ追加する処理
// --------------------------------------------------
// ・1段階目で選択した地域と2段階目で選択した個数から送料商品を作る
// ・同じ送料がすでに注文にある場合は数量を1つ増やす
// ・まだない場合は送料を新しい注文商品として追加する
// ・追加後は地域選択状態を解除し、次の送料を選べる状態に戻す
// ・上部の「追加：送料 ...」表示も更新する
// --------------------------------------------------
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

  // --------------------------------------------------
// カテゴリーボタンの通常タップ／長押し開始を判定する処理
// --------------------------------------------------
// ・通常のタップならカテゴリー選択として扱う
// ・500ms以上押し続けると並べ替えモードへ切り替える
// ・ドラッグ開始位置と対象カテゴリーIDを記録する
// ・少しでも横方向へ動いた場合は、通常タップではなく並べ替え操作として扱う
// --------------------------------------------------
function handleCategoryPointerDown(event, category) {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return
    }

    clearCategoryLongPress()

    // スマホの指がボタンの外へ移動しても、同じボタンでpointermove/upを受け取れるようにします。
    // これにより長押し後のドラッグ並べ替えが途中で切れにくくなります。
    if (event.currentTarget?.setPointerCapture && event.pointerId !== undefined) {
      try {
        event.currentTarget.setPointerCapture(event.pointerId)
      } catch {
        // Pointer Captureに対応していない環境では通常のpointerイベントをそのまま使用します。
      }
    }

    categoryDragId.current = category.id
    categoryDragStartX.current = event.clientX
    categoryDragMoved.current = false

    categoryLongPressTimer.current = setTimeout(() => {
      setCategoryReorderMode(true)
      categoryDragMoved.current = false
    }, 500)
  }

  // --------------------------------------------------
// カテゴリーを長押しした後にドラッグして並べ替える処理
// --------------------------------------------------
// ・並べ替えモードになる前は、横方向の移動量だけを記録する
// ・並べ替えモード中は現在のポインター位置にあるボタンを調べる
// ・元のカテゴリーを取り出し、移動先の位置へ差し込む
// ・変更されたカテゴリー配列はuseEffectでlocalStorageへ保存される
// --------------------------------------------------
function handleCategoryPointerMove(event) {
    if (categoryDragId.current === null) {
      return
    }

    if (Math.abs(event.clientX - categoryDragStartX.current) > 8) {
      categoryDragMoved.current = true

      // 長押し前に指が動いた場合は、通常のタップ判定を解除し、
      // 500ms後に意図せず並べ替えモードへ入らないよう長押しタイマーも停止します。
      if (!categoryReorderMode) {
        clearCategoryLongPress()
        return
      }
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

    if (event.currentTarget?.releasePointerCapture && event.pointerId !== undefined) {
      try {
        if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId)
        }
      } catch {
        // Pointer Captureを解除できない環境では、そのまま終了します。
      }
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

  // --------------------------------------------------
// カテゴリーをタップして選択する処理
// --------------------------------------------------
// ・選択中カテゴリーIDを更新する
// ・送料カテゴリーで選んでいた地域があれば解除する
// ・カテゴリー切り替えアニメーション状態をリセットする
// --------------------------------------------------
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
              onPointerMove={handleCategoryPointerMove}
              onPointerUp={(event) => handleCategoryPointerUp(event)}
              onPointerCancel={handleCategoryPointerCancel}
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
              style={{
                // 商品数を2列で並べたときに必要になる行数を計算します。
                // 例えば11商品なら、2列×6行になるため6行分の高さを確保します。
                // カテゴリごとに商品数が違っても、この値をCSSへ渡すことで
                // そのカテゴリの商品ボタンを画面内へ均等に収めます。
                '--menu-row-count': Math.max(
                  1,
                  Math.ceil(
                    (currentCategory?.items?.length || 0) / 2,
                  ),
                ),
              }}
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
                  const display = renderOrderItemDisplay(item)

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
                          {display.shippingOption && (
                            <span className="order-item-shipping-option">
                              {display.shippingOption}
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