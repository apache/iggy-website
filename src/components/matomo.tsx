/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

declare global {
  interface Window {
    _paq?: unknown[][];
  }
}

/**
 * Records a page view on client-side navigation.
 *
 * The tracking snippet in the root layout fires one trackPageView on the
 * initial load. This site is a Next.js app, so every subsequent move between
 * pages is client-side routing and produces no further page view, which would
 * leave Matomo reporting entry pages only. This records the rest.
 *
 * The first render is skipped: the snippet has already counted it.
 */
function MatomoRouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialLoad = useRef(true);

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }

    const query = searchParams.toString();
    const url = window.location.origin + pathname + (query ? `?${query}` : "");

    window._paq = window._paq || [];
    window._paq.push(["setReferrerUrl", document.referrer]);
    window._paq.push(["setCustomUrl", url]);
    window._paq.push(["setDocumentTitle", document.title]);
    window._paq.push(["trackPageView"]);
    window._paq.push(["enableLinkTracking"]);
  }, [pathname, searchParams]);

  return null;
}

export function Matomo() {
  return (
    <Suspense fallback={null}>
      <MatomoRouteTracker />
    </Suspense>
  );
}
