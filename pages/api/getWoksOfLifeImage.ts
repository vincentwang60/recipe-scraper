import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import * as cheerio from 'cheerio';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // @ts-expect-error
  let test: {url: string} = req.query  
  const { data } = await axios.get(test.url)
  const $ = cheerio.load(data)
  res.status(200).json({imageSrc: $('.attachment-post-thumbnail').first().attr('data-lazy-src')})
}