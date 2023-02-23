import styles from '../styles/Home.module.css'
import Logo from './components/logo'
import Search from './components/search'
import Filters from './components/filters'
import Category from './components/category'
import Result from './components/result'
import {useState, useEffect} from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  let {query, isReady} = useRouter()
  let [syncWoksOfLife, setSyncWoksOfLife] = useState(false);
  let [resultComponents, setResultComponents] = useState<JSX.Element[]>([]);
  let [recipeArray, setRecipeArray] = useState<string[]>([]);
  let categoryComponents: JSX.Element[] = []
  let [start, setStart] = useState<number>(-1)
  let [count, setCount] = useState<number>(-1)

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

  for (const category in categoryInfo) {
    categoryComponents.push(
      <Category category={category} items={categoryInfo[category]} />
    )
  }

  useEffect(()=>{
    async function getRecipes(): Promise<string[]>{
      const response = await fetch("/api/server?filters=")
      //const response = await fetch("/api/server?filters=tomato|egg")
      return response.json()
    }
    if (start !== -1 && count !== -1) {
      getRecipes().then((recipes)=>{
        console.log('got recipes', recipes)
        setRecipeArray(recipes)
      })
    }
  },[start, count])

  useEffect(()=>{
    if (isReady) {
      if (query.start) {
        setStart(Number(query.start))
      }
      else {
        setStart(0)
      }
      if (query.count) {
        setCount(Number(query.count))
      }
      else {
        setCount(15)
      }
    }
  },[query])

  useEffect(()=> {
    async function getWoksOfLife() {
        const response = await fetch("/api/getWoksOfLife");
        console.log('fetched woks of life data')
        return response.json()
    }
    if (syncWoksOfLife) {
      setSyncWoksOfLife(false)
      getWoksOfLife()
    }
  }, [syncWoksOfLife])


  useEffect(()=>{
    if (recipeArray){
      let newResultComponents: JSX.Element[] = []
      for (const url of recipeArray.slice(start, start+count)) {
        newResultComponents.push(
          <Result url={url} />
        )
      }
      setResultComponents(newResultComponents)
    }
  },[recipeArray])

  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <Logo/>
        <Search />
      </div>
      <div className={styles.resultCountContainer}>
        <div style={{fontSize: '14px'}} className='text'>{start+1} to {start+count} of {recipeArray.length} results</div>
        <div onClick={()=>{setSyncWoksOfLife(true)}}>SYNC WOKS OF LIFE REMOVE MEEEEEE</div>
      </div>
      <div className={styles.line} />
      <div className={styles.bottomContainer}>
        <div className={styles.sidebarContainer} >
          <Filters filters = {[]}/>
          {categoryComponents}
        </div>
        <div className={styles.resultContainer} >
          {resultComponents}
        </div>
      </div>
    </div>
  )
}