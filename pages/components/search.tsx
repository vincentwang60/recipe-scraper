import {AiOutlineSearch, AiFillPlusSquare} from 'react-icons/ai'
import styles from '../../styles/search.module.css'
import {KeyboardEvent, SyntheticEvent, useState, useMemo, useEffect, useRef} from 'react'
import gsap from 'gsap'

export default function Search(props: {ingredients: {[key: string]: string[]}, filters: string[], setFilters: any}) {
    const [showMenu, setShowMenu] = useState(false)
    const [value, setValue] = useState<string>('')
    const [results, setResults] = useState<string[]>([])
    const resultsRef = useRef(null);
    const searchRef = useRef(null);
    const menuUp = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";
    const menuDown = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
  
    const tl = useMemo(() => gsap.timeline({ paused: true , defaults: {duration: 0.25, ease: 'power4.out'}}), []);
  
    useEffect(()=>{
      if (resultsRef.current && searchRef.current){
        tl.fromTo(
          resultsRef.current,
          { clipPath: menuUp, visibility: "hidden"},
          { clipPath: menuDown, visibility: "visible" },
          0
        )
        .fromTo(
          searchRef.current,
          {borderRadius: '5px'},
          {borderRadius: '5px 5px 0px 0px'},
          0
        );
      }
    },[resultsRef, searchRef])
  
    useEffect(()=>{
      if(showMenu){
        tl.play()
      }
      else{
        tl.reverse()
      }
    }, [showMenu])

    useEffect(()=> {
      const match = []
      for (const category in props.ingredients){
        for (const ingredient of props.ingredients[category]) {
          if (ingredient.toLowerCase().includes(value.toLowerCase()) && match.length < 10) {
            match.push(ingredient)
          }
        }
      }
      setResults(match)
    }, [value])


    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          if (results.length){
            props.setFilters(props.filters.concat([results[0]]))
            setValue('')
          }
        }
    }

    const handleChange = (event: SyntheticEvent) => {
        setValue((event.target as HTMLInputElement).value)
    }

    return (
        <div className={styles.container}>
            <div className={styles.searchContainer}>
                <div ref={searchRef} className={styles.search}>
                    <AiOutlineSearch size='1.5vw' color='#272D2D'/>
                    <input 
                      onBlur={()=>{setShowMenu(false)}} 
                      onFocus={()=>{setShowMenu(true)}} 
                      onChange={handleChange} 
                      type='text' 
                      value={value} 
                      onKeyDown={handleKeyDown} 
                      placeholder="Type in what's in your pantry" 
                      className={styles.text} 
                    />
                </div>
                <div className={styles.resultsContainer}>
                    <div ref={resultsRef} className={styles.results}>
                      {results.length ? results.map((result)=>{ return (
                        <div onClick={()=>{
                          props.setFilters(props.filters.concat([result]))
                          setValue('')
                        }} className={styles.result}
                        >
                          {result}
                          <div style={{display: 'flex'}}>
                            <div className={styles.addContainer}>
                              <AiFillPlusSquare size='1.5vw' color='#64A6BD'/>
                              <div className={styles.addText}>
                                Add Optional
                              </div>
                            </div>
                            <div className={styles.addContainer}>
                              <AiFillPlusSquare size='1.5vw' color='#64A6BD'/>
                              <div className={styles.addText}>
                                Add Required
                              </div>
                            </div>
                          </div>
                        </div>
                      )})
                      : <div className={styles.result}>No matching ingredients</div>
                      }
                    </div>
                </div>
            </div>
        </div>
    )
}