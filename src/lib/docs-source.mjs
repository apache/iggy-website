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

// The GitHub file of a docs page, for the source link of the page and the
// Source line of its Markdown copy. content/docs is fetched from two
// repositories (see scripts/fetch-docs.mjs), and connectors/ comes from
// apache/iggy-connectors.

/**
 * @param {string} path The page file, relative to content/docs.
 * @returns {string}
 */
export function docsSourceUrl(path) {
  const [first, ...rest] = path.split("/");
  return first === "connectors"
    ? `https://github.com/apache/iggy-connectors/blob/master/docs/${rest.join("/")}`
    : `https://github.com/apache/iggy/blob/master/docs/${path}`;
}
