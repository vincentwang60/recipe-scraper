// @ts-nocheck
import { Collection } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from './createClient';
export async function uploadToMongo(recipeArray: Recipe[], db: Collection<Document>) {
  for (let recipe of recipeArray) {
    console.log('uploading', recipe._id)
    if (await db.countDocuments({_id: recipe._id})){
        console.log(recipe._id, 'exists already!')
    }
    else {
        console.log('Creating new for', recipe._id)
        await db.insertOne({
            _id: recipe._id,
            ingredients: recipe.ingredients,
            steps: recipe.steps,
            title: recipe.title,
            rating: recipe.rating,
            time: recipe.time,
            updated: recipe.updated
        })
    }
  }
}

export default async function getMongoRecipes(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise
  const db = client.db("recipes").collection('recipes')
  let reqString: {start: number, count: number, filters: string} = req.query
  let filters = reqString.filters.split('|')
  let recipes: Recipe[] = []
  //let recipesAsCursor = await db.find({"$and": query},{skip: Number(reqString.start), limit: Number(reqString.count) })
  
  let recipesAsCursor = await db.aggregate(
    [
      { '$match': {
        '$or': [
            { "ingredients.name": { "$regex": "pineapple.{0,1}(?=s| |$)" }},
            { "ingredients.name": { "$regex": "mango.{0,1}(?=s| |$)" }},
        ]
      }},
      { '$unwind': '$ingredients'},
      { '$addFields': {
        pineappleScore: {$regexFind: { input: "$ingredients.name", regex: /pineapple.{0,1}(?=s| |$)/ }},
        mangoScore: {$regexFind: { input: "$ingredients.name", regex: /mango.{0,1}(?=s| |$)/ }}
      }},
      { "$group": {
        "_id": "$_id",
        "ingredients": {
            "$push": {
                "amount": "$amount",
                "unit": "$unit",
                "name": "$name",
                "notes": "$notes",
            } 
          } 
      }}
    ]
  )

  await recipesAsCursor.forEach(recipe => {recipes.push({
    _id: recipe._id,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    title: recipe.title,
    rating: recipe.rating,
    time: recipe.time,
    updated: recipe.updated,
  })})
  console.log('temp')
  res.status(200).json(recipes)
}