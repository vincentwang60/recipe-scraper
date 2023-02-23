import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import {Collection } from 'mongodb'
import * as cheerio from 'cheerio';
import clientPromise from './createClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise
  const db: Collection<Document> = client.db("recipes").collection('recipes')
  // @ts-expect-error
  let reqString: {url: string} = req.query  
  // @ts-expect-error
  let recipe: Recipe = await db.findOne({_id: reqString.url})
  const { data } = await axios.get(reqString.url)
  const $ = cheerio.load(data)
  res.status(200).json({imageSrc: $('.attachment-post-thumbnail').first().attr('data-lazy-src'), recipe: recipe})
}