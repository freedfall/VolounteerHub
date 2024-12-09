// components/PointsToStars.tsx
import React from 'react';
import { View, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import filledStar from '../images/icons/filledStar.png';
import emptyStar from '../images/icons/emptyStar.png';

interface PointsToStarsProps {
  points: number;
  maxPoints?: number;
  starSize?: number;
  // halfStar?: ImageSourcePropType;
}

const PointsToStars: React.FC<PointsToStarsProps> = ({
  points,
  maxPoints = 5,
  starSize = 24,
}) => {
  const filledStars = points;
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
    marginVertical: 5,
  },
  star: {
    marginHorizontal: 2,
  },
});

export default PointsToStars;
