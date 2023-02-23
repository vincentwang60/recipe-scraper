import { AggregationCursor, Collection } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from './createClient';

export async function uploadToMongo(recipeArray: Recipe[], db: Collection<Document>) {
  let count = 0
  for (let recipe of recipeArray) {
    count += 1
    console.log('uploading', recipe._id, 'recipe', count, 'of', recipeArray.length)
    if (await db.countDocuments({_id: recipe._id})){
        console.log(recipe._id, 'exists already')
    }
    else {
        console.log('Creating new for', recipe._id)
        await db.insertOne({
          // @ts-expect-error
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





async function getSortedRecipes(db: Collection<Document>, filters: string[]): Promise<AggregationCursor<Document>> {
  let matchArray = []
  let addFieldObject: {[key: string]: any} = {}
  let groupObject: {[key: string]: any} = {
    '_id': '$_id',
    'ingredients': { $push: '$ingredients'},
    'steps': { $push: '$steps'},
    'title': { $first: '$title'},
    'rating': { $first: '$rating'},
    'time': { $first: '$time'},
    'updated': { $first: '$updated'},
    
  }
  let matchSumArray: string[] = []
  for (let filter of filters) {
    matchArray.push({"ingredients.name": {"$regex": filter+".{0,1}(?=s| |$)"}})
    let filterRegex = new RegExp(filter + '.{0,1}(?=s| |$)')
    addFieldObject[filter+'Score'] = {$cond: [ {$regexMatch: { input: "$ingredients.name", regex: filterRegex }} , 1, 0 ]}
    groupObject[filter+"Score"] = {$max: '$'+filter+'Score'}
    matchSumArray.push('$'+filter+'Score')
  }
  let sortedRecipeCursor: AggregationCursor<Document> = await db.aggregate(
    [
      { 
        '$match': {
            '$or': matchArray
      }},
      { '$unwind': '$ingredients'},
      { '$addFields': addFieldObject},
      { $group: groupObject },
      { '$addFields': {
        matchScore: {$sum: matchSumArray}
      }},
      { '$sort': { matchScore: -1 }}
    ]
  )
  return sortedRecipeCursor
}

export default async function getMongoRecipes(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise
  const db: Collection<Document> = client.db("recipes").collection('recipes')
  // @ts-expect-error
  let reqString: {filters: string} = req.query
  let filters = reqString.filters.split('|')
  let sortedRecipeCursor = await getSortedRecipes(db, filters)
  res.status(200).json(await sortedRecipeCursor.toArray())
}