interface CctvArticle {
  id: string
  title: string
  url: string
  brief?: string
  focus_date?: string
}

export default defineSource(async () => {
  const text: string = await myFetch("https://news.cctv.com/2019/07/gaiban/cmsdatainterface/page/news_1.jsonp", { responseType: "text" })
  const match = /^news\s*\(([\s\S]*)\)\s*;?$/.exec(text.trim())
  if (!match) throw new Error("CCTV: invalid news feed")

  const data: { data?: { list?: CctvArticle[] } } = JSON.parse(match[1])
  const list = data?.data?.list
  if (!Array.isArray(list)) throw new Error("CCTV: missing news list")

  const items = list.filter(k => k?.id && k.title?.trim() && /^https?:\/\//i.test(k.url)).map(k => ({
    id: k.id,
    title: k.title.trim(),
    url: k.url,
    pubDate: k.focus_date ? tranformToUTC(k.focus_date) : undefined,
    extra: { hover: k.brief },
  }))
  if (!items.length) throw new Error("CCTV: empty news list")
  return items
})
