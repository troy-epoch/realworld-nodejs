# realworld-nodejs
1. query implemented: getUser, getCurrentUser, getProfile
2. mutation implemented: createUser, loginUser, createArticle

## prisma
1. create database `graphl`
2. create tables
 CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(1023) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bio` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `following` boolean NOT NULL DEFAULT false,
  PRIMARY KEY (`id`),
  UNIQUE(`email`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `article` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `author` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` varchar(511) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(511) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tags` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `favorited` boolean NOT NULL DEFAULT false,
  `favoritesCount` Int DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE(`slug`),
  KEY `idx_author` (`author`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
3. create .env file and put database cred as 
   DATABASE_URL="mysql://user:password@host:port/database?schema=public"
4. terminal
   npx prisma init
   npx prisma db pull
   npx prisma generate

## run server
 1. terminal cd subgraph-article, npm install && npm start
 2. terminal cd subgraph-user, npm install && npm start
 3. terminal npm install && npm start

## federation
### https://www.apollographql.com/tutorials/voyage-part1/publishing-the-subgraphs-with-rover, https://www.apollographql.com/docs/federation/managed-federation/deployment/
  1. install rover CLI
     terminal curl -sSL https://rover.apollo.dev/nix/latest | sh
  2. creating env variables in file .env
     APOLLO_KEY=
     APOLLO_GRAPH_REF=
  3. go to apollo studio, create new graph
     a. fill title, and use default Graph Architecture and next
     b. you will see something like below
        APOLLO_KEY=your-graphs-apollo-key \
        rover subgraph publish your-graph-name@current \
        --name products --schema ./products-schema.graphql \
        --routing-url http://products.prod.svc.cluster.local:4001/graphql

        find APOLLO_KEY and APOLLO_GRAPH_REF, fill them in .env
        APOLLO_KEY=your-graphs-apollo-key
        APOLLO_GRAPH_REF=your-graph-name@current
     c. authenticate your graph
        terminal rover config auth, paste APOLLO_KEY
     d. publish subgraphs
        terminal
        
        rover subgraph publish <APOLLO_GRAPH_REF> \
        --name user \
        --schema ./subgraph-user/user.graphql \
        --routing-url http://localhost:4001

        rover subgraph publish <APOLLO_GRAPH_REF> \
        --name article \
        --schema ./subgraph-article/article.graphql \
        --routing-url http://localhost:4002
    e. go http://localhost:4000 and query