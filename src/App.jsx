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
      { id: 101, name: '100_袋入 詰合せ', price: 3600 },
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
      { id: 301, name: '901_近距離', price: 500 },
      { id: 302, name: '902_中距離', price: 600 },
      { id: 305, name: '905_遠距離', price: 900 },
      { id: 306, name: '906_北海道・沖縄', price: 1300 },
      { id: 994, name: '994_送料', price: 0 },
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
  近距離: [
    { id: 'near-1', name: '1缶', price: 500 },
    { id: 'near-2-3', name: '2・3缶\n1ケース\n1缶+1ケース', price: 600 },
    { id: 'near-4-6', name: '4・5・6缶\n2・3ケース\n1缶+2ケース\n2・3缶+1ケース', price: 700 },
    { id: 'near-7-8', name: '7・8缶\n4ケース\n2・3缶+2ケース\n4缶+1ケース', price: 800 },
  ],

  中距離: [
    { id: 'middle-1', name: '1缶', price: 600 },
    { id: 'middle-2-3', name: '2・3缶\n1ケース\n1缶+1ケース', price: 700 },
    { id: 'middle-4-6', name: '4・5・6缶\n2・3ケース\n1缶+2ケース\n2・3缶+1ケース', price: 800 },
    { id: 'middle-7-8', name: '7・8缶\n4ケース\n2・3缶+2ケース\n4缶+1ケース', price: 900 },
  ],

  遠距離: [
    { id: 'far-1', name: '1缶', price: 900 },
    { id: 'far-2-3', name: '2・3缶\n1ケース\n1缶+1ケース', price: 900 },
    { id: 'far-4-6', name: '4・5・6缶\n2・3ケース\n1缶+2ケース\n2・3缶+1ケース', price: 1000 },
    { id: 'far-7-8', name: '7・8缶\n4ケース\n2・3缶+2ケース\n4缶+1ケース', price: 1000 },
  ],

  '北海道・沖縄': [
    { id: 'hokkaido-1', name: '1缶', price: 1300 },
    { id: 'hokkaido-2-3', name: '2・3缶\n1ケース\n1缶+1ケース', price: 1300 },
    { id: 'hokkaido-4-6', name: '4・5・6缶\n2・3ケース\n1缶+2ケース\n2・3缶+1ケース', price: 1400 },
    { id: 'hokkaido-7-8', name: '7・8缶\n4ケース\n2・3缶+2ケース\n4缶+1ケース', price: 1400 },
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
const shippingInitials = [
  'あ', 'い', 'え',
  'お', 'か', 'き',
  'く', 'こ', 'さ',
  'し', 'ち', 'と',
  'な', 'に', 'ひ',
  'ふ', 'ほ', 'み',
  'や', 'わ',
]

const shippingPrefecturesByInitial = {
  あ: ['青森県', '秋田県', '愛知県'],
  い: ['岩手県', '茨城県', '石川県'],
  え: ['愛媛県'],
  お: ['大阪府', '岡山県', '大分県', '沖縄県'],
  か: ['神奈川県', '香川県', '鹿児島県'],
  き: ['京都府', '岐阜県'],
  く: ['熊本県', '群馬県'],
  こ: ['高知県'],
  さ: ['埼玉県', '佐賀県'],
  し: ['静岡県', '滋賀県', '島根県'],
  ち: ['千葉県'],
  と: ['栃木県', '東京都', '富山県', '鳥取県', '徳島県'],
  な: ['長野県', '奈良県', '長崎県'],
  に: ['新潟県'],
  ひ: ['兵庫県', '広島県'],
  ふ: ['福島県', '福井県', '福岡県'],
  ほ: ['北海道'],
  み: ['宮城県', '三重県', '宮崎県'],
  や: ['山形県', '山梨県', '山口県'],
  わ: ['和歌山県'],
}

const shippingPrefectureRegion = {
  北海道: '北海道・沖縄',
  青森県: '遠距離',
  岩手県: '遠距離',
  宮城県: '遠距離',
  秋田県: '遠距離',
  山形県: '遠距離',
  福島県: '遠距離',
  茨城県: '中距離',
  栃木県: '中距離',
  群馬県: '中距離',
  埼玉県: '中距離',
  千葉県: '中距離',
  東京都: '中距離',
  神奈川県: '中距離',
  山梨県: '中距離',
  新潟県: '中距離',
  長野県: '中距離',
  富山県: '近距離',
  石川県: '近距離',
  福井県: '近距離',
  岐阜県: '近距離',
  静岡県: '近距離',
  愛知県: '近距離',
  三重県: '近距離',
  滋賀県: '近距離',
  京都府: '近距離',
  大阪府: '近距離',
  兵庫県: '近距離',
  奈良県: '近距離',
  和歌山県: '近距離',
  鳥取県: '近距離',
  島根県: '近距離',
  岡山県: '近距離',
  広島県: '近距離',
  山口県: '近距離',
  徳島県: '中距離',
  香川県: '中距離',
  愛媛県: '中距離',
  高知県: '中距離',
  福岡県: '中距離',
  佐賀県: '中距離',
  長崎県: '中距離',
  熊本県: '中距離',
  大分県: '中距離',
  宮崎県: '中距離',
  鹿児島県: '中距離',
  沖縄県: '北海道・沖縄',
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

  const migratedCategories = categories.map((category) => ({
    ...category,
    items: Array.isArray(category.items)
      ? category.items.map((product) => {
          if (category.id === 4 && product?.id === 999) {
            return {
              ...product,
              id: 994,
              name: '994_送料',
            }
          }

          if (category.id === 4) {
            const shippingNameMap = {
              301: '901_近距離',
              302: '902_中距離',
              303: '901_近距離',
              304: '902_中距離',
              305: '905_遠距離',
              306: '906_北海道・沖縄',
              994: '994_送料',
            }

            if (shippingNameMap[product?.id]) {
              return {
                ...product,
                id: Number(product.id) === 303
                  ? 301
                  : Number(product.id) === 304
                    ? 302
                    : product.id,
                name: shippingNameMap[product.id],
              }
            }
          }

          return product
        })
      : [],
  }))

  categories = migratedCategories

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
      ? category.id === 4
        ? category.items
            .map((product) => {
              if (product?.id === 301) {
                return { ...product, name: '901_近距離' }
              }
              if (product?.id === 302) {
                return { ...product, name: '902_中距離' }
              }
              if (product?.id === 305) {
                return { ...product, name: '905_遠距離' }
              }
              if (product?.id === 306) {
                return { ...product, name: '906_北海道・沖縄' }
              }
              if (product?.id === 994) {
                return { ...product, name: '994_送料' }
              }
              return product
            })
            .filter((product, index, items) =>
              items.findIndex((item) => item?.id === product?.id) === index
            )
        : category.items.map((product) => {
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
        小袋
        <br />
        (10袋入)
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
        袋
        <br />
        パッキン
        <br />
        その他
      </>
    )
  }

  if (category.name === '割れおかき') {
    return (
      <>
        割れ
        <br />
        おかき
      </>
    )
  }

  if (category.name === '詰替パック') {
    return (
      <>
        詰替
        <br />
        パック
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
  const match = rawName.match(/(\d{3})/)

  return match ? match[1] : ''
}

function getProductImageCandidates(product) {
  if (!product) {
    return []
  }

  // 送料の注文項目は商品番号が名前に含まれないため、994.pngを使います。
  if (String(product.id || '').startsWith('shipping-')) {
    return ['/products/994.png']
  }

  // 割れおかき(801～808)は、商品IDから画像番号を直接決めます。
  // 商品名やlocalStorageに残っている古いimage情報に影響されず、
  // 501～508 → 801～808 の対応で画像を確実に読み込みます。
  const productIdToImageCode = {
    501: '801',
    502: '802',
    503: '803',
    504: '804',
    505: '805',
    506: '806',
    507: '807',
    508: '808',
  }

  const directImageCode = productIdToImageCode[Number(product.id)]

  if (directImageCode) {
    return [
      `/products/${directImageCode}.png`,
      `/products/${directImageCode}.jpg`,
      `/products/${directImageCode}.jpeg`,
      `/products/${directImageCode}.webp`,
    ]
  }

  const code = getProductCode(product)

  if (!code) {
    return []
  }

  // その他の商品は、これまでどおり個別画像を最初に試します。
  // 見つからない場合は商品番号の画像を順番に試します。
  const candidates = [
    ...(product.image ? [product.image] : []),
    `/products/${code}.png`,
    `/products/${code}.jpg`,
    `/products/${code}.jpeg`,
    `/products/${code}.webp`,
  ]

  // 001だけは以前から使用している画像名も候補に残します。
  if (code === '001') {
    candidates.push('/products/味の宴.png')
    candidates.push('/products/utageSS.jpg')
    candidates.push('/味の宴.png')
    candidates.push('/utageSS.jpg')
    candidates.push('/utageSS(1).jpg')
    candidates.push('/utageSS(2).jpg')
  }

  return [...new Set(candidates)]
}

function getProductImage(product) {
  return getProductImageCandidates(product)[0] || null
}

function handleProductImageError(event, candidates) {
  const image = event.currentTarget
  const currentIndex = Number(image.dataset.imageIndex || 0)
  const nextIndex = currentIndex + 1

  if (nextIndex >= candidates.length) {
    image.style.display = 'none'
    return
  }

  image.dataset.imageIndex = String(nextIndex)
  image.src = candidates[nextIndex]
}

function getProductDisplay(product) {
  if (!product) {
    return { code: '', label: '', name: '', subName: '', shippingOption: '' }
  }

  const rawName = String(product.name || '')

  if (String(product.id || '').startsWith('shipping-')) {
    // 送料だけは、注文内容確認画面の通常商品と同じ表示位置を使います。
    // 商品番号の位置には「送料」、商品名の位置には選択した都道府県を表示します。
    // 送料の地域名ではなく、実際に選択した都道府県1つだけを表示します。
    // その下には選択した個数・組み合わせのボタン名を1行で表示します。
    const shippingMatch = rawName.match(/^送料\s+(.+?)\s+([\s\S]+)$/)

    if (shippingMatch) {
      return {
        code: '送料',
        label: '',
        name: shippingMatch[1],
        subName: '',
        shippingOption: shippingMatch[2],
      }
    }

    return {
      code: '送料',
      label: '',
      name: rawName.replace(/^送料\s*/, ''),
      subName: '',
      shippingOption: '',
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

  const isHiddenCodeProduct =
    code === '994' ||
    ['801', '802', '803', '804', '805', '806', '807', '808'].includes(code)

  if (isHiddenCodeProduct) {
    label = ''
  }

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

  // 送料は地域名を表示せず、選択した都道府県だけをそのまま表示します。
  // 中部（愛知・石川・岐阜・静岡・富山・福井・三重）でも、
  // 「愛知県」など実際に選択した1つの都道府県だけになります。
  // 商品番号の位置には「送料」を表示し、都道府県の下に送料の選択名を表示します。
  return {
    ...display,
    code: '送料',
    label: '',
  }
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

  const [selectedShippingInitial, setSelectedShippingInitial] =
    useState(null)

  const [selectedShippingPrefecture, setSelectedShippingPrefecture] =
    useState(null)

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

    resetShippingSelection()

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

  function clearAllHistory() {
    if (orderHistory.length === 0) {
      return
    }

    if (
      !window.confirm(
        '履歴をすべて削除しますか？',
      )
    ) {
      return
    }

    setOrderHistory([])
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

    resetShippingSelection()

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

  // --------------------------------------------------
  // 送料の1段階目「頭文字」を選択する処理
  // --------------------------------------------------
  // ・頭文字を保存する
  // ・都道府県と送料地域の古い選択状態を解除する
  // --------------------------------------------------
  function selectShippingInitial(initial) {
    setSelectedShippingInitial(initial)
    setSelectedShippingPrefecture(null)
    setSelectedShippingRegion(null)
  }

  // --------------------------------------------------
  // 送料の2段階目「都道府県」を選択する処理
  // --------------------------------------------------
  // ・都道府県を保存する
  // ・その都道府県に対応する従来の送料地域を取得する
  // --------------------------------------------------
  function selectShippingPrefecture(prefecture) {
    const region = shippingPrefectureRegion[prefecture] || null

    setSelectedShippingPrefecture(prefecture)
    setSelectedShippingRegion(region)
  }

  // --------------------------------------------------
  // 送料選択を最初の頭文字選択まで戻す処理
  // --------------------------------------------------
  function resetShippingSelection() {
    setSelectedShippingInitial(null)
    setSelectedShippingPrefecture(null)
    setSelectedShippingRegion(null)
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
function addShippingToOrder(option) {
    const shippingProduct = {
      id: `shipping-${selectedShippingPrefecture}-${option.id}`,
      name: `送料 ${selectedShippingPrefecture} ${option.name}`,
      price: option.price,
    }

    setOrder((current) => {
      const existing = current.find(
        (item) => item.id === shippingProduct.id,
      )

      if (existing) {
        return current.map((item) =>
          item.id === shippingProduct.id
            ? {
                ...item,
                quantity: item.quantity + 1,
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
      (item) => item.id === shippingProduct.id,
    )

    setLatestAddedProduct({
      name: shippingProduct.name,
      quantity: existing?.quantity
        ? existing.quantity + 1
        : 1,
    })

    resetShippingSelection()
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

    resetShippingSelection()

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
            {!selectedShippingInitial ? (
              <>
                <div className="shipping-title">
                  都道府県の頭文字を選択
                </div>

                <div className="shipping-initial-groups">
                  {[
                    {
                      label: 'あ行',
                      initials: ['あ', 'い', 'え', 'お'],
                    },
                    {
                      label: 'か行',
                      initials: ['か', 'き', 'く', 'こ'],
                    },
                    {
                      label: 'さ行',
                      initials: ['さ', 'し'],
                    },
                    {
                      label: 'た行',
                      initials: ['ち', 'と'],
                    },
                    {
                      label: 'な行',
                      initials: ['な', 'に'],
                    },
                    {
                      label: 'は行',
                      initials: ['ひ', 'ふ', 'ほ'],
                    },
                    {
                      label: 'ま・や・わ行',
                      initials: ['み', 'や', 'わ'],
                    },
                  ].map((group) => (
                    <div
                      key={group.label}
                      className="shipping-initial-group"
                    >
                      <div className="shipping-initial-group-title">
                        {group.label}
                      </div>

                      <div className="shipping-initial-buttons">
                        {group.initials.map((initial) => (
                          <button
                            key={initial}
                            type="button"
                            className="shipping-initial-button"
                            onClick={() => selectShippingInitial(initial)}
                          >
                            {initial}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : !selectedShippingPrefecture ? (
              <>
                <div className="shipping-title">
                  都道府県を選択
                </div>

                <div className="shipping-selected-initial">
                  {selectedShippingInitial} から選択
                </div>

                <div className="shipping-prefecture-grid">
                  {shippingPrefecturesByInitial[selectedShippingInitial].map(
                    (prefecture) => {
                      const prefectures =
                        shippingPrefecturesByInitial[selectedShippingInitial]

                      const firstKanji = prefecture.charAt(0)
                      const sameFirstKanjiCount = prefectures.filter(
                        (item) => item.charAt(0) === firstKanji,
                      ).length

                      return (
                        <button
                          key={prefecture}
                          type="button"
                          className="shipping-prefecture-button"
                          onClick={() =>
                            selectShippingPrefecture(prefecture)
                          }
                        >
                          {sameFirstKanjiCount > 1 ? (
                            <>
                              <span>{prefecture.charAt(0)}</span>
                              <span className="shipping-prefecture-distinct">
                                {prefecture.charAt(1)}
                              </span>
                              <span>{prefecture.slice(2)}</span>
                            </>
                          ) : (
                            prefecture
                          )}
                        </button>
                      )
                    },
                  )}
                </div>

                <button
                  type="button"
                  className="shipping-back-button"
                  onClick={() => {
                    setSelectedShippingInitial(null)
                    setSelectedShippingPrefecture(null)
                    setSelectedShippingRegion(null)
                  }}
                >
                  頭文字選択に戻る
                </button>
              </>
            ) : (
              <>
                <div className="shipping-title">
                  個数を選択
                </div>

                <div className="shipping-selected-prefecture">
                  {selectedShippingPrefecture}
                </div>

                <div className="shipping-options-grid">
                  {shippingOptions[selectedShippingRegion].map((option) => (
                    <button
                      key={option.id}
                      className="shipping-option-button"
                      onClick={() => addShippingToOrder(option)}
                    >
                      <span className="shipping-option-name">
                        {option.name}
                      </span>

                      <span className="shipping-option-price">
                        ¥{option.price.toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="shipping-back-button"
                  onClick={() => {
                    setSelectedShippingPrefecture(null)
                    setSelectedShippingRegion(null)
                  }}
                >
                  都道府県選択に戻る
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
                  const productImageCandidates = getProductImageCandidates(product)
                  const productImage = productImageCandidates[0] || null

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
                          onError={(event) =>
                            handleProductImageError(
                              event,
                              productImageCandidates,
                            )
                          }
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
                    onError={(event) =>
                      handleProductImageError(
                        event,
                        getProductImageCandidates(item),
                      )
                    }
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
                            <span
                              className={
                                String(display.shippingOption).length >= 10
                                  ? 'order-item-shipping-option order-item-shipping-option-long'
                                  : String(display.shippingOption).length >= 7
                                    ? 'order-item-shipping-option order-item-shipping-option-medium'
                                    : 'order-item-shipping-option'
                              }
                            >
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
        <button
          type="button"
          className="history-clear-all"
          onClick={clearAllHistory}
          disabled={orderHistory.length === 0}
        >
          履歴を全削除
        </button>

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