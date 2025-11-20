import React, { useEffect } from 'react';

export default function Root({ children }) {
  useEffect(() => {
    // Fetch GitHub stars on client side
    fetch('https://api.github.com/repos/apache/iggy')
      .then(res => res.json())
      .then(data => {
        const count = data.stargazers_count;
        const formatted = count >= 1000
          ? `${(count / 1000).toFixed(1)}K`
          : count.toString();

        const starElement = document.getElementById('github-stars');
        if (starElement) {
          starElement.textContent = formatted;
        }
      })
      .catch(() => {
        // Keep default value on error
      });
  }, []);

  return <>{children}</>;
}
