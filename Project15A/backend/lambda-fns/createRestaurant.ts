const gremlin = require('gremlin')
import Restaurant from './Restaurant'

const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection
const Graph = gremlin.structure.Graph
const uri = process.env.WRITER

async function createRestaurant(restaurant :Restaurant) {
    let dc = new DriverRemoteConnection(`wss://${uri}/gremlin`, {})
    const graph = new Graph()
    const g = graph.traversal().withRemote(dc)

    const data = await g.addV('Restaurant').property('name', restaurant.name).property('address', restaurant.address).property('city', restaurant.city).property('location', restaurant.location).next();
   
   await  g.addE("are about").from(g.V().hasLabel("Review").next()).to(g.V().hasLabel("Restaurant").next())
    dc.close()
    return restaurant
}
export default createRestaurant