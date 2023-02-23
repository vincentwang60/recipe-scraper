// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import * as cheerio from 'cheerio';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from './createClient';
import { uploadToMongo } from './server';

export default async function getWoksOfLifeData(req: NextApiRequest, res: NextApiResponse) {
  let test = [
    'https://thewoksoflife.com/empanada-recipe-beef-cheese/'
    ,'https://thewoksoflife.com/asian-braised-short-ribs-with-chili-lime-potatoes/'
    ,'https://thewoksoflife.com/asian-pot-roast/'
    ,'https://thewoksoflife.com/beef-with-broccoli-all-purpose-stir-fry-sauce/'
    ,'https://thewoksoflife.com/beef-egg-stir-fry-rice/'
    ,'https://thewoksoflife.com/beef-kimchi-fried-rice/'
    ,'https://thewoksoflife.com/beef-and-mushroom-stir-fry/'
  ]
  const numOfCategories = 15;
  let categoryUrlArray: any[] = [];
  let recipeUrlArray: string[] = [];
  let recipeArray: Recipe[] = [];

  const { data } = await axios.get('https://thewoksoflife.com/recipe-list/')
  const $ = cheerio.load(data)
  const siteData = $('.seemore')
  siteData.splice(numOfCategories)
  siteData.each(function(i) {
    categoryUrlArray[i] = $(this).attr('href')
  });
  console.log('category url array', categoryUrlArray)
  for (const category of categoryUrlArray) {
    let res = await getCategoryData(category)
    recipeUrlArray = [...recipeUrlArray, ...res]
    console.log('got category', category)
  }
  console.log(recipeUrlArray.length)
  
  //DELETE MEEEEEEEEEEEEEEEEEEEEEEEEEEEE
  //recipeUrlArray = test
  
  let count = 0
  for (let recipe of recipeUrlArray) {
    count += 1
    let res = await getRecipeData(recipe)
    console.log('got recipe', recipe, count, 'of', recipeUrlArray.length)
    recipeArray.push(res)
  }
  
  const client = await clientPromise
  const db = client.db("recipes")
  uploadToMongo(recipeArray, db.collection('recipes'))

  res.status(200).json({recipeArray: recipeArray})
}

async function getCategoryData(categoryUrl: string) {
  const { data } = await axios.get('https://thewoksoflife.com/recipe-list/'+categoryUrl)
  const $ = cheerio.load(data)
  const siteData = $('.kd-listing a')
  let categoryData: any[] = []
  siteData.each(function(i) {
    categoryData.push($(this).attr('href'))
  })
  return categoryData
}

async function getRecipeData(recipeUrl: string): Promise<Recipe> {
  let ingredients: Ingredient[] = []
  let steps: string[] = []
  let rating: number | undefined = undefined
  let time: string = '';

  const { data } = await axios.get(recipeUrl)
  const $ = cheerio.load(data)

  let title: string = $('.entry-title').first().text()

  let scrapedRating = Number($('.wprm-recipe-rating-average').text())
  if (scrapedRating != 0){
    rating = scrapedRating
  }

  const scrapedTime = $('.wprm-recipe-total-time-container')
  scrapedTime.each(function(i) {
    time += $(this).text().slice(7)
  })

  let updated: string = $('.entry-modified-time').text()
  updated = updated.slice(8)

  const ingredientData = $('.wprm-recipe-ingredient')
  ingredients = ingredientData.map((i, ingredient) => {
    return {
      amount: $(ingredient).find('.wprm-recipe-ingredient-amount').text(),
      unit: $(ingredient).find('.wprm-recipe-ingredient-unit').text(),
      name: $(ingredient).find('.wprm-recipe-ingredient-name').text(),
      notes: $(ingredient).find('.wprm-recipe-ingredient-notes').text(),
    }
  }).toArray()

  $('.wprm-recipe-instruction').each(function(i) {
    steps.push($(this).text())
  })
  
  return {_id: recipeUrl, ingredients, steps, title, rating, time, updated}
}