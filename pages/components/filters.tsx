import styles from '../../styles/filters.module.css'
import { IoClose } from 'react-icons/io5'
export default function Filters(props: {filters: string[]}) {
    let filterComponents: JSX.Element[] = []
    for (let filter of props.filters) {
        filterComponents.push(
            <div className={styles.filterItem}>
                <div className='text'>{filter}</div>
                <IoClose style={{paddingLeft: '5px'}} size='15px' color='#272D2D'/>
            </div>
        )
    }
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className='text'>Filters</div>
                <div className='link'>Clear All</div>
            </div>
            <div className={styles.content}>
                {filterComponents}
            </div>
        </div>
    )
}