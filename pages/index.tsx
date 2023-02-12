import styles from '../styles/Home.module.css'
import getWoksOfLifeData from './api/getWoksOfLife'
import clientPromise from './api/createClient'
import {uploadToMongo, getMongoRecipes} from './api/mongoCRUD'

export default function Home(props: {recipeArray: Recipe[]}) {
  return (
    <div className={styles.container}>
      ahh
    </div>
  )
}

export async function getStaticProps() {
  const scrapeWoksOfLife = false;
  const client = await clientPromise
  const db = client.db("recipes")
  if (scrapeWoksOfLife){
    const woksOfLifeData = await getWoksOfLifeData()
    console.log('got woks of life data:', woksOfLifeData.props.recipeArray.length)
    uploadToMongo(woksOfLifeData.props.recipeArray, db.collection('recipes'))
    return woksOfLifeData
  }
  let recipeArray = await getMongoRecipes(db.collection('recipes'), 0, 20)
  console.log('got recipes', recipeArray.length)
  return {
    props: {recipeArray: recipeArray},
    revalidate: 100
  }
}