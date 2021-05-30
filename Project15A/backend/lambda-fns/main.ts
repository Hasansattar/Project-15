import createPerson from './createPerson';
import listPerson from './listPerson';
import createRestaurant from './createRestaurant'
import Person from './Person';
import Restaurant from './Restaurant';
import Review from './Review'
import createReview from './createReview'
// const gremlin = require('gremlin')


// const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection
// const Graph = gremlin.structure.Graph
// const uri = process.env.READER

//   function data(){
   

//   let dc = new DriverRemoteConnection(`wss://${uri}/gremlin`, {})
//   const graph = new Graph()
//   const g = graph.traversal().withRemote(dc)
//   console.log("Starting Gremlin data loading");
//   try {
//   var str=  "g.V().drop().iterate();" +
//       "g.V().hasLabel('Person').addE('friends').to(g.V.hasLabel('Person')).next();" +
//       "g.V().hasLabel('Person').addE('writes').to(g.V.hasLabel('Review')).next();"+
//       "g.V().hasLabel('Review').addE('are about').to(g.V.hasLabel('Restaurant')).next();"
    
//       return str
//   }

//    catch (error) {
    
//   }


//   }



type AppSyncEvent = {
  info: {
    fieldName: string
  },
  arguments: {
    person: Person
    restaurant: Restaurant
    review: Review
  }
}

exports.handler = async (event:AppSyncEvent) => {
  switch (event.info.fieldName) {
    case "addPerson":
      return await createPerson(event.arguments.person);
      case "addRestaurant":
      return await createRestaurant(event.arguments.restaurant);

      case "addReview":
        return await createReview(event.arguments.review);

   
      case "listPerson":
      return await listPerson();
    default:
      return null;
  }
}