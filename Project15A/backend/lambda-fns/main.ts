import createPerson from './createPerson';
import listPerson from './listPerson';
import createRestaurant from './createRestaurant'
import Person from './Person';
import Restaurant from './Restaurant';
import Review from './Review'
import Cuisine from './Cuisine'
import createReview from './createReview'
import createCuisine from './createCuisine'
 



type AppSyncEvent = {
  info: {
    fieldName: string
  },
  arguments: {
    person: Person
    restaurant: Restaurant
    review: Review
    cuisine:Cuisine
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

        case "addCuisine":
        return await createCuisine(event.arguments.cuisine);

   
      case "listPerson":
      return await listPerson();
    default:
      return null;
  }
}