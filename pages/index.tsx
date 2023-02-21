import styles from '../styles/Home.module.css'
import {getWoksOfLifeData} from './api/getWoksOfLife'
import clientPromise from './api/createClient'
import {uploadToMongo, getMongoRecipes} from './api/mongoCRUD'
import Logo from './components/logo'
import Search from './components/search'
import Filters from './components/filters'
import Category from './components/category'
import Result from './components/result'

export default function Home(props: {recipeArray: Recipe[]}) {
  const equivalent = {
    'chives': 'scallions',
    'eggplant': 'aubergine',
    'sweet potato': 'yam',
    'zucchini': 'squash',
    'coffee': 'espresso',
    'broth': 'stock',
    'wine': 'sherry',
    'mirin': 'rice wine',
    'noodles': 'pasta' 
  }

  const categoryInfo: {[key: string]: string[]} = {
    'Sauces': ['Mustard', 'Oyster sauce', 'Gochujang', 'Soy sauce', 'Hoison', 'Tomato paste', 'Sriracha', 'Chili oil'],
    'Seasonings': ['Black pepper', 'Kombu', 'Cilantro', 'Mint', 'Cinnamon', 'Parsley', 'Basil', 'MSG', 'Dill', 'Curry Powder'],
    'Dairy and Eggs': ['Butter', 'Condensed Milk', 'Eggs', 'Yogurt', 'Cheese', 'Sour Cream', 'Heavy Cream'],
    'Vegetables': ['Mushrooms', 'Ginger', 'Bok Choy', 'Bell Peppers', 'Lettuce', 'Bamboo', 'Kale', 'Potato', 'Broccoli', 'Celery', 'Chives', 'Garlic', 'Beans', 'Eggplant', 'Cabbage', 'Spinach', 'Sweet potato', 'Zucchini', 'Cucumber', 'Lime', 'Lemon', 'Orange', 'Cauliflower', 'Strawberries', 'Onion', 'Carrot', 'Apple', 'Artichoke', 'Asparagus', 'Avocado', 'Corn', 'Peas', 'Blackberries', 'Raspberries', 'Blueberries', 'Taro', 'Beets', 'Brussel sprouts', 'Tomato', 'Pumpkin', 'Pineapple', 'Mango'],
    'Baking': ['Flour', 'Puff pastry', 'Yeast', 'Vanilla', 'Vinegar', 'Coffee', 'Honey', 'Chocolate', 'Sugar'],
    'Misc.': ['Peanuts', 'Pecans', 'Raisins', 'Broth', 'Grand Marnier', 'Mirin', 'Wine', 'Kimchi', 'Seaweed', 'Chickpeas', 'Pistachio'],
    'Carbs': ['Noodles', 'Rice', 'Udon', 'Ramen', 'Vermicelli'],
    'Protein': ['Chicken', 'Tofu', 'Beef', 'Turkey', 'Pork', 'Sausage', 'Scallops', 'Salmon', 'Shrimp', 'Duck', 'Bacon']
  }

  let categoryComponents: JSX.Element[] = []
  for (const category in categoryInfo) {
    categoryComponents.push(
      <Category category={category} items={categoryInfo[category]} />
    )
  }

  let resultComponents: JSX.Element[] = []
  for (const result of props.recipeArray) {
    resultComponents.push(
      <Result result={result} />
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <Logo/>
        <Search />
      </div>
      <div className={styles.resultCountContainer}>
        <div style={{fontSize: '14px'}} className='text'>1 to 20 of 1037 results</div>
      </div>
      <div className={styles.line} />
      <div className={styles.bottomContainer}>
        <div className={styles.sidebarContainer} >
          <Filters filters = {['Tomatoes', 'Eggs', 'Tofu', 'Cabbage']}/>
          {categoryComponents}
        </div>
        <div className={styles.resultContainer} >
          {resultComponents}
        </div>
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
  let recipeArray = await getMongoRecipes(db.collection('recipes'), 10, 30)
  //console.log('got recipes', recipeArray)
  return {
    props: {recipeArray: recipeArray},
    revalidate: 100
  }
}