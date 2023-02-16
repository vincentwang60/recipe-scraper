import styles from '../../styles/sidebar.module.css'
import {BiCheckbox, BiCheckboxSquare} from 'react-icons/bi'
export default function Category(props: {category: string, items: string[]}) {
    let itemComponents: JSX.Element[] = []
    for (let item of props.items) {
        itemComponents.push(
            <div className={styles.categoryItem}>
                <BiCheckbox size='20px' color='#FFFEEB'/>
                <div style={{marginTop: '3px'}} className='text small'>{item}</div>
            </div>
        )
    }
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className='text'>{props.category}</div>
                <div className='link'>Clear All</div>
            </div>
            <div className={styles.categoryContent}>
                {itemComponents}
            </div>
        </div>
    )
}