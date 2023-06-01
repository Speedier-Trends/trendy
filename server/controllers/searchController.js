const searchController = {};
const sdk = require("api")("@yelp-developers/v1.0#deudoolf6o9f51");
// process.env.YELP_API;
// const data = require("./TEST_DATA"); //comment out after
const cheerio = require("cheerio");

searchController.getBuisnesses = async (req, res, next) => {
  console.time('searchController.getBuisnesses');
  sdk.auth("bearer " + process.env.YELP_API);
  console.log(req.query)
  const { interest, radius } = req.query;
  const location = req.query.location.replace(/\s/g, "%20");
  const { data } = await sdk.v3_business_search({
    location,
    term: interest,
    radius,
    sort_by: "best_match",
    limit: "20",
  });

  res.locals.businesses = data.businesses.map((business) => {
    console.log(business);
    const { id, name, image_url, url, categories, location } = business;
    return {
      id,
      name,
      image_url,
      url,
      categories,
      location: location.display_address,
    };
  });
  console.timeEnd('searchController.getBuisnesses');
  // res.locals.businesses = data.business; // COMMENT THIS OUT AS WELL!@!!!!!
  next();
};

searchController.getComments = async (req, res, next) => {
  console.time('searchController.getComments');
  Promise.all(
    res.locals.businesses.map((business) => fetch(business.url))
  ).then((YELPres) => {
    Promise.all(YELPres.map((x) => x.text())).then((html) => {
      for (const index in html) {
        const comments = [];
        const $ = cheerio.load(html[index]);
        console.log($);
        const $comment = $("span.raw__09f24__T4Ezm");
        $comment.each((i, e) => {
          comments.push($(e).text().trim());
        });
        res.locals.businesses[index].comments = comments;
      }
      console.timeEnd('searchController.getComments');
      next();
    });
  });
  // next(); /// comment out after
};

async function getRatingsHelper(business) {
  const startTime = Date.now();
  try {
    const data = await Promise.all(
      business.comments.map((comment) => {
        return fetch(
          "https://api.api-ninjas.com/v1/sentiment?text=" + comment,
          {
            headers: {
              "X-Api-Key": process.env.ninja_API,
            },
          }
        );
      })
    );
    const rating = await Promise.all(data.map((rate) => rate.json()));
    let validResponses = 0;
    const avg =
      rating.reduce((acc, curr) => {
        if (curr.score !== undefined) {
          acc += curr.score;
          validResponses++;
        }
        return acc;
      }, 0) / validResponses;
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      console.log(`getRatingsHelper: ${executionTime}ms`);
    return Promise.resolve(+avg + 0.2);
  } catch (error) {
    return Promise.resolve("ERROR");
  }
}

searchController.getRatings = async (req, res, next) => {
  console.time('searchController.getRatings');
  const average = await Promise.all(
    res.locals.businesses.map((buisiness) => {
      return getRatingsHelper(buisiness);
    })
  );

  // const filterBbusinesses = [];
  // for (const index in average) {
  //   if (average[index] !== "ERROR") {
  //     res.locals.businesses[index].averageScore = average[index];
  //     filterBbusinesses.push(res.locals.businesses[index]);
  //   }
  // }

  // const filterBbusinessesReducer = average.reduce((acc, curr, index) => {
  //   if (curr !== "ERROR") {
  //     res.locals.businesses[index].averageScore = curr;
  //     acc.push(res.locals.businesses[index]);
  //   }
  //   return acc;
  // }, []);

  // console.log(filterBbusinesses);
  res.locals.businesses = average.reduce((acc, curr, index) => {
    if (curr !== "ERROR") {
      res.locals.businesses[index].averageScore = curr;
      acc.push(res.locals.businesses[index]);
    }
    return acc;
  }, []);
  console.timeEnd('searchController.getRatings');
  next();
};

module.exports = searchController;
