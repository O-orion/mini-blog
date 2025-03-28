import React from 'react'
import styles from './post.module.css';
import { FaRegHeart } from "react-icons/fa";
import { FaRepeat } from "react-icons/fa6";
import { FaCommentAlt } from "react-icons/fa";

const PostCard = () => {
  return (
            <div className={styles.post}>
              <div className={ styles.post_header } >
                <div className={ styles.image } ></div>
                <p className={ styles.post_text } >Nome</p>
              </div>
    
              <div>
                <p>"A sombra dança onde a luz não alcança." - Autor Desconhecido</p>
              </div>
    
              <div className={ styles.buttons } >
                <button><FaRegHeart color='white' size={16} /></button>
                <button><FaCommentAlt color='white' size={16} /></button>
                <button><FaRepeat color='white' size={16} /></button>
              </div>
            </div>
  )
}

export default PostCard