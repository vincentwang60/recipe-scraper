// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import * as cheerio from 'cheerio';

async function getWoksOfLifeData() {
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
  console.log(siteData)
  siteData.each(function(i) {
    categoryUrlArray[i] = $(this).attr('href')
  });
  console.log('ahhh', categoryUrlArray)
  for (const category of categoryUrlArray) {
    let res = await getCategoryData(category)
    recipeUrlArray = [...recipeUrlArray, ...res]
    console.log('got category', category)
  }
  console.log(recipeUrlArray.length)
  
  //DELETE MEEEEEEEEEEEEEEEEEEEEEEEEEEEE
  recipeUrlArray = test
  
  for (let recipe of recipeUrlArray) {
    let res = await getRecipeData(recipe)
    console.log('got recipe', recipe)
    recipeArray.push(res)
  }

  return {
    props: { recipeArray },
    revalidate: 100, // rerun after 10 seconds
  }
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
  const { data } = await axios.get(recipeUrl)
  const $ = cheerio.load(data)
  const ingredientData = $('.wprm-recipe-ingredient')
  ingredients = ingredientData.map((i, ingredient) => {
    return {
      amount: $(ingredient).find('.wprm-recipe-ingredient-amount').text(),
      unit: $(ingredient).find('.wprm-recipe-ingredient-unit').text(),
      name: $(ingredient).find('.wprm-recipe-ingredient-name').text(),
      notes: $(ingredient).find('.wprm-recipe-ingredient-notes').text(),
    }
  }).toArray()
  let steps: string[] = []
  $('.wprm-recipe-instruction').each(function(i) {
    steps.push($(this).text())
  })
  return {_id: recipeUrl, ingredients, steps}
}


export default getWoksOfLifeData