// components/ImageWithFallback.js
import React, { useState } from 'react';
import { Image } from 'react-native';

export default function ImageWithFallback({ source, style, ...props }) {
  const [errorCount, setErrorCount] = useState(0);
  const [imgSource, setImgSource] = useState(source);

  const handleError = () => {
    if (errorCount < 3) { // Retry 3 times
      setErrorCount(prev => prev + 1);
      setImgSource({ ...source, uri: `${source.uri}&retry=${errorCount}` });
    }
  };

  return (
    <Image
      {...props}
      source={imgSource}
      onError={handleError}
      style={style}
    />
  );
}