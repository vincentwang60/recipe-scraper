import styles from '../styles/Home.module.css'
import getWoksOfLifeData from './api/getWoksOfLife'
import clientPromise from './api/createClient'
import {uploadToMongo, getMongoRecipes} from './api/mongoCRUD'
import Logo from './components/logo'
import Search from './components/search'

export default function Home(props: {recipeArray: Recipe[]}) {
  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <Logo/>
        <Search />
      </div>
      <div className={styles.resultCountContainer}>
        <div className='text'>1 to 30 of 1037 results</div>
      </div>
      <div className={styles.line} />
      <div className={styles.bottomContainer}>
        ahh
      </div>
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