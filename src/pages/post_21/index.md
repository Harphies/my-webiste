---
path: "/blogs/recomendation-systems"
date: "2020-01-14"
title: "Recommendation Systems"
author: "Olalekan Taofeek"
timeToRead: "8"
smallTitle: "Recommender Engines"
description: "A recommender engine for personalized contents for a user."
postNum: "21"
---

<img src="./cover_21.png"/>
<br/>

**Recommendation Systems** Recommendation system has become an integral part of many applications in recent time and mostly web applications. it's about recommending something to users based on thier preferences.

**Types of Recommendation Systems**

- Content Based Filtering Techniques: This techniques of recommendation systems use the profile of a user to suggest something new the user might like base on its likes, commemnts, dislike etc.
- Collaborative techniques: This techniques of recommender engine use the profile of one user to recommend something for another user base on something they have in common like gender, location, beliefs(Law of attraction)
- Popularity based recommendation: Recommedning a popular item to users.
- Hybrid Recommender systems. It combines two or three systems together to make a recommendation
  - Knowledge-Based Recommender
  - Content-Filtering Recommender
  - Collaborative Filtering Recommender

## Collaborative filtering based recommender systems.

- Filtering based on comparison between an item and a user profile. The key idea is that similar users share the same interest on similar items, and those similar items are liked by a user.

# Colaborative based filtering approaches.

- Nearest Neighborhood
- Matrix factorization

## User based collaborative filtering: Aim to compute user similarity and can be achived by

- Pearson correlation
- Cosine similarity

## Item-based collaborative filtering. Aim to compute the item similarities by computing the item vector and calculate the similarity score.

**Some Applications of Recommendation Systesm**

- Friends suggestions on social media e.g Facebook,LinkedIn, Twitter etc.
- Shortest Route recommendation for cars, bikes in the case of Uber, lift, Bolt etc.
- Query suggestions in search engine.
- Music, Movie, Books, news & article recommendation
- Cloths and other items recommendation in the case of e-commerce.
- LinkedIn for jobs people maybe Intereted and potential Network Recommendation.

**Algorithms for recommendation system**

- Pearson correlation
- Clustering Algorithms
- Markov chains
- Roccio Classification

**The four phases of Recommendation Systems**

- Collection:
- Storage:
- Analysis:
- Recommendation:

**Architecture of Recommendation Systems**

- Collection of Information from a user on a specific website, on a specific date with a front-end Application.
- Store the information in Database either Relational/Non-Relational database.
- The informtion is then processed by a machine learning Algorithm
- Then saved back in the database.

**Advantages of Recommender Engines**

- Improve customer experience
- Build a better product offering
- Data becoming an asset to every business.
- More personalized recommendation
- Mitigate Information overload.
- Companies collect better markets
- High Revenue.
- Low Risk
- Improve efficiency and Internal operations
- Relevant advertisements
- Detect fraud
- Customer satisfaction
- More robust and specific reports.
- Discover things user already like.

**Disadvantages of Recommendation systems**

- Cold start problem
- Lack of data
- Changing data
- Changing user preferences
- Unpredictable items
- Complex Analysis
- Wrong data.
- Big data
- privacy concerns
- Multiple approaches
- Scalability of the approach
- Context awareness
- Accuracy of prediction

# Guides to building a recommender engine

- Data Mining/gather and cleaning data
- Explore variables to take into considerations
  - participant and Non-participant observing or Implicit and Explicit data.
  - Recommender engine gather the data about the user that is based on either explicit or implicit behavior.
- Imputation methods for missing data; please check [here](https://github.com/Harphies/data_science) for your reference.

  **Deploying Recommendation System**: Software as a services is one of the best way to deploy a recommender system and below are the common SaaS

- Google Cloud Prediction API
- Amazon ML
- Azure ML
- Neo.4j
- IBM Watson

# implemeting Content based filtering

Content based Recommendation system doesn't require any external data from other users, it use the particular user in context to make recommendation.

- item profile is saved
- item feature is saved
- user profile is saved
- classification is performed.
  Often, the cosine similarity is calculated to find the best score for Recommendation.

# Implementation Algortithms for Hybrid Recommendation Systems.

- Cosine Similarity
- SVD for collaborative filtering
- Similarity Injection KNN
- FFA
- SimComb
- Non-Normalized Cosine
- Interleaved.

```
Thanks for your time and efforts in adding value to yourself, check back soon.
```
