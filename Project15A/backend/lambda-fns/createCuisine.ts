const gremlin = require('gremlin')
import Cuisine from './Cuisine'

const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection
const Graph = gremlin.structure.Graph
const uri = process.env.WRITER

async function createCuisine(cuisine:Cuisine) {
    let dc = new DriverRemoteConnection(`wss://${uri}/gremlin`, {})
    const graph = new Graph()
    const g = graph.traversal().withRemote(dc)

    const data = await g.addV('Cuisine').property('cuisineName', cuisine.cuisineName).property('cuisineId', cuisine.cuisineId).next();
       await g.addE("Serves").from(g.V().hasLabel("Restaurant").next()).to(g.V().hasLabel("Cuisine").next());
   
    dc.close()
    return cuisine
}
export default createCuisine