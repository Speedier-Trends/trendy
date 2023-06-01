const searchController = {};
const sdk = require("api")("@yelp-developers/v1.0#deudoolf6o9f51");
// process.env.YELP_API;
// const data = require("./TEST_DATA"); //comment out after
const cheerio = require("cheerio");

searchController.getBusinesses = async (req, res, next) => {
  res.locals.businesses = [];
  console.time('searchController.getBusinesses');
  sdk.auth("bearer " + process.env.YELP_API);

  try {
    const { interest, radius } = req.query;
    const location = req.query.location.replace(/\s/g, "%20");
    let offset = 20;
    const limit = 20;
    let total;
    const results = [];

    do {
      const { data } = await sdk.v3_business_search({
        location,
        term: interest,
        radius,
        sort_by: "best_match",
        limit: `${limit}`,
        offset: `${offset}`
      });
      console.log(data);
      if (data?.businesses.length > 0) {
        const transformedData = data.businesses.map((business) => {
          const { id, name, image_url, url, categories, location } = business;
          return {
            id,
            name,
            image_url,
            url,
            categories,
            location: location.display_address,
            }
            
        });
        res.locals.businesses.push(...transformedData);
      }
      offset += limit;
      total = data.total;
      total = Math.min(50, total);
      console.log('total: ', total, ', limit: ', limit, ' offset: ', offset);
    } while (offset < total);
    
    console.timeEnd('searchController.getBusinesses');
    // res.locals.businesses = data.business; // COMMENT THIS OUT AS WELL!@!!!!!
    next();
  } catch (error) {
    console.log('searchController.getBusinesses error: ', error);
    return next({error})
  }
};


module.exports = searchController;
