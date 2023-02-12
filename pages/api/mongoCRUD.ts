import { Collection } from 'mongodb'
export async function uploadToMongo(recipeArray: Recipe[], db: Collection<Document>) {
  for (let recipe of recipeArray) {
    console.log('uploading', recipe._id)
    if (await db.countDocuments({_id: recipe._id})){
        console.log(recipe._id, 'exists already!')
    }
    else {
        console.log('Creating new for', recipe._id)
        await db.insertOne({
            // @ts-expect-error
            _id: recipe._id,
            ingredients: recipe.ingredients,
            steps: recipe.steps
        })
    }
  }
}

export async function getMongoRecipes(db: Collection<Document>, start: number = 0, end: number = 20 ): Promise<Recipe[]> {
  let recipes: Recipe[] = []
  let recipesAsCursor = await db.find({},{skip: start, limit: end-start })
  // @ts-expect-error
  await recipesAsCursor.forEach(recipe => {recipes.push({_id: recipe._id, ingredients: recipe.ingredients, steps: recipe.steps})})
  return recipes
}