interface Res {
  success: boolean
  data: {
    cards: {
      content: {
        word: string
        rawUrl: string
        desc?: string
      }[]
    }[]
  }
}

export default defineSource(async () => {
  const data: Res = await myFetch(`https://top.baidu.com/api/board?platform=pc&tab=realtime`)
  const items = data?.data?.cards?.[0]?.content
  if (data?.success !== true || !Array.isArray(items) || items.length === 0) {
    throw new Error("百度热搜接口未返回有效榜单")
  }

  return items.map((k) => {
    return {
      id: k.rawUrl,
      title: k.word,
      url: k.rawUrl,
      extra: {
        hover: k.desc,
      },
    }
  })
})
