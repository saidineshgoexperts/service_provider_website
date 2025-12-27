'use client';

import { CardMedia, CardContent, Typography } from '@mui/material';
import styles from '../HoverCard.module.css';

export default function HoverCard({ category, isHovered, onHover }) {
  return (
    <div className={styles.container}>
      <div className={`${styles.card} ${isHovered ? styles.hovered : ''}`} onMouseEnter={onHover}>
        {/* SLIDE 1 - EXACT SAME AS ORIGINAL */}
        <div className={`${styles.slide} ${styles.slide1}`}>
          <div className={styles.content}>
            <div className={styles.icon}>
              {/* SHOW CATEGORY IMAGE - NOT FA ICON */}
              <CardMedia
                component="img"
                image={category.image}
                alt={category.alt}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.3,
                }}
              />
            </div>
          </div>
        </div>

        {/* SLIDE 2 - EXACT SAME AS ORIGINAL */}
        <div className={`${styles.slide} ${styles.slide2}`}>
          <div className={styles.content}>
            <Typography
              component="h3"
              sx={{
                fontSize: '24px',
                textAlign: 'center',
                color: '#414141',
                mb: 1,
                fontFamily: 'sans-serif',
              }}
            >
              {category.title}
            </Typography>
            <Typography
              component="p"
              sx={{
                textAlign: 'center',
                color: '#414141',
                fontFamily: 'sans-serif',
                margin: 0,
                padding: 0,
              }}
            >
              Explore {category.title.toLowerCase()}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
