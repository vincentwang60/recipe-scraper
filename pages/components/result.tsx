import styles from '../../styles/result.module.css'
import{useEffect, useState} from 'react'
import {AiOutlineClockCircle, AiOutlineLink} from 'react-icons/ai'

export default function Result(props: {url: string}) {
    let [image, setImage] = useState(<div></div>)
    let [recipe, setRecipe] = useState<Recipe>()

    let ingredientComponents: JSX.Element[] = []
    let count = 0
    if (recipe) {
        for (let item of recipe.ingredients) {
            count += 1
            ingredientComponents.push(
                <ul key = {count} className={styles.ingredient}>
                    <li style={{paddingRight: '10px', marginTop: '3px', fontWeight: '300'}} className='text'>{item.amount} {item.unit} {item.name}</li>
                </ul>
            )
        }
    }

    useEffect(()=> {
        async function getRecipe() {
            const response = await fetch("/api/getWoksOfLifeRecipe?url="+props.url);
            return response.json()
        }
        getRecipe().then((data)=>{
            setImage(<img className={styles.image} src={data.imageSrc} />)
            setRecipe(data.recipe)
        })
    }, [props.url])
    
    if (recipe) {
        return (
            <div className={styles.container}>
                <div className={styles.containerFlair}>
                    <div className={styles.containerOutline}>
                        <div className={styles.imageContainer}>
                            {image}
                        </div>
                        <div className={styles.mainContainer}>
                            <div className={styles.title}>{recipe.title}</div>
                            <div className={styles.info}>
                                <div className={styles.time}>
                                    <AiOutlineClockCircle className={styles.icon} size='20px' color='#FFFEEB'/>
                                    <div style={{marginTop: '3px'}} className='text'>Cook Time: {recipe.time}</div>
                                </div>
                                <div className={styles.link}>
                                    <AiOutlineLink className={styles.icon} size='20px' color='#FFFEEB'/>
                                    <a href={recipe._id+'#recipe'} target="_blank" style={{marginTop: '1px', textDecoration: 'underline'}} className='text'>{recipe._id}</a>
                                </div>
                                <div className={styles.rating}>
                                    <div style={{marginTop: '3px'}} className='text'>Rating: {recipe.rating}/5</div>
                                </div>
                            </div>
                            <div style={{paddingTop: '10px'}}className='text'>Ingredients:</div>
                            <div className={styles.ingredientContainer}>
                                {ingredientComponents}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div>Loading</div>
    )
}