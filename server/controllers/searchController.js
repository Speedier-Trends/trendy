const searchController = {};
const sdk = require("api")("@yelp-developers/v1.0#deudoolf6o9f51");

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

searchController.getRatings = async (req, res, next) => {
  
  console.time('searchController.getRatings');
  
  
  // Get the current date
  const currentDate = new Date();

  // Calculate the date that was 3 months ago
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
  
  try {
    
    const limit = 20;
    const headers = {
      headers: { 
        'Authorization': `Bearer ${process.env.YELP_API}`,
        'Content-Type': 'application/json'
      }
    };
    
    res.locals.businesses.map(async business => {
      const business_id = business.id;
      console.log(business_id);  
      let url = `https://api.yelp.com/v3/businesses/${business_id}/reviews?limit=${limit}&sort_by=newest`;
      let response = await fetch(url, headers);  
      let reviews = await response.json();
    
      let currentReviews = [];
      reviews.forEach(review => {
        const createdDate = new Date(review.time_created);
        console.log('created: ', createdDate);
        if (createdDate > threeMonthsAgo) {
          currentReviews.push(business_id);
        }
        console.log()
      })


    
    })
    console.timeEnd('searchController.getRatings');
    // res.locals.businesses = data.business; // COMMENT THIS OUT AS WELL!@!!!!!
    next();
  } catch (error) {
    console.log('searchController.getRatings error: ', error);
    return next({error})
  }
};

module.exports = searchController;
