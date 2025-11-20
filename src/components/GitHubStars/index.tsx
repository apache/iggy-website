import React, { useEffect, useState } from 'react';

export default function GitHubStars(): JSX.Element {
  const [stars, setStars] = useState('3.2K'); // fallback

  useEffect(() => {
    fetch('https://api.github.com/repos/apache/iggy')
      .then(res => res.json())
      .then(data => {
        const count = data.stargazers_count;
        const formatted = count >= 1000
          ? `${(count / 1000).toFixed(1)}K`
          : count.toString();
        setStars(formatted);
      })
      .catch(() => {
        // Keep fallback value on error
      });
  }, []);

  return <>{stars}</>;
}
