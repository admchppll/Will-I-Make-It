# Will I Make It? (StudentHack 2016 Submission)

## Inspiration
_"Hmm... What could we do with a set of accident data and an API which provides local business information?"_  
We came up with this idea because it is a light hearted way to provide user-related information (and some humour) about accidents around their desired destinations. Hopefully with this project, users are able to make a more informed decision with the information we provide to them.

## What it does
1. Type in where you want to go
2. Select the category you're interested in (Food, Shopping, Education etc)
3. Select two options and compare
4. Tada! You will then be presented with the businesses' information along with a Road Accident Risk Rating for you to decide on your next course of action.

## How we built it
- Front-end : Bootstrap, HTML, CSS, JS  and JQuery
- Back-end : Node.js with Express
- We are using Yelp Search API to get the list of businesses in based on the location and category
- After selecting the two businesses you want to compare, their locations are used in the CDL Elasticsearch query to get the accident data
- We then process the return data to calculate an estimated road accident risk rating for each of the businesses selected before. Criteria used in the process are: Year of Accident, Accident Severity, Number of Casualties and Number of Vehicles.

## Challenges we ran into
- Learning how to construct a query for elasticsearch
- Working with OAuth + Yelp API
- Coming up with the calculations to estimate the road accident risk rating
- Normalising the risk rating because some areas might have very different data compared to others which caused the rating to either go below 0% or over 100%

## Accomplishments that we're proud of
- Finishing a 10-hour video of Gandalf nodding
- Designing a simple and clean UI that goes well with the main features of the project
- Managing to acquire and process the data returned from various APIs, then output them properly to the front-end

## What we learned
- 

## What's next for Will I Make It or what's more to come?
- Will We Make It? (into the top 10) (Edit: Oh yes, in fact we made it into third place ;D)
- Will Kanye get out of Debt?
- Will the Earth Make It?
- Force be with you, will it?

NOTE: Website is not fully functional because CDL has stopped hosting the data with elasticsearch. Will try to get the data and host it ourselves instead. :) Mean time, you can still search up businesses with the Yelp API.

Taken from our [DevPost](https://devpost.com/software/will-i-make-it) page.
