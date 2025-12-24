import React, { useEffect } from "react";

export default function Root({ children }) {
  useEffect(() => {
    let cancelled = false;

    const fetchAndUpdateStars = () => {
      fetch("https://api.github.com/repos/apache/iggy")
        .then((res) => res.json())
        .then((data) => {
          if (cancelled) return;
          const count = data.stargazers_count;
          const formatted =
            count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count.toString();

          const updateElement = () => {
            const starElement = document.getElementById("github-stars");
            if (starElement) {
              starElement.textContent = formatted;
              return true;
            }
            return false;
          };

          // Try immediately
          if (updateElement()) return;

          // If element not found, watch for it
          const observer = new MutationObserver(() => {
            if (updateElement()) {
              observer.disconnect();
            }
          });
          observer.observe(document.body, { childList: true, subtree: true });

          // Cleanup observer after 10 seconds
          setTimeout(() => observer.disconnect(), 10000);
        })
        .catch(() => {});
    };

    fetchAndUpdateStars();

    return () => {
      cancelled = true;
    };
  }, []);

  return <>{children}</>;
}
