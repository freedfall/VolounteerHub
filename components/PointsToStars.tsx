// components/PointsToStars.tsx
import React from 'react';
import { View, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import filledStar from '../images/icons/filledStar.png';
import emptyStar from '../images/icons/emptyStar.png';

interface PointsToStarsProps {
  points: number; // Очки пользователя
  maxPoints?: number; // Максимально возможные очки (по умолчанию 100)
  starSize?: number; // Размер звезды (по умолчанию 24)
  // halfStar?: ImageSourcePropType;
}

const PointsToStars: React.FC<PointsToStarsProps> = ({
  points,
  maxPoints = 100,
  starSize = 24,
  // halfStar,
}) => {
  // Ограничиваем очки в пределах от 0 до maxPoints
  const normalizedPoints = Math.max(0, Math.min(points, maxPoints));

  // Рассчитываем рейтинг из 5 звёзд
  const rating = (normalizedPoints / maxPoints) * 5;

  // Для простоты используем только заполненные и пустые звёзды
  const filledStars = Math.round(rating);
  const emptyStars = 5 - filledStars;

  const stars = [];

  for (let i = 0; i < filledStars; i++) {
    stars.push(
      <Image
        key={`filled-${i}`}
        source={filledStar}
        style={[styles.star, { width: starSize, height: starSize }]}
        resizeMode="contain"
      />
    );
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Image
        key={`empty-${i}`}
        source={emptyStar}
        style={[styles.star, { width: starSize, height: starSize }]}
        resizeMode="contain"
      />
    );
  }

  return <View style={styles.container}>{stars}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  star: {
    marginHorizontal: 2,
  },
});

export default PointsToStars;
