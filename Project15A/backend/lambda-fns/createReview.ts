const gremlin = require('gremlin')
import Review from './Review'

const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection
const Graph = gremlin.structure.Graph
const uri = process.env.WRITER

async function createReview(review :Review) {
    let dc = new DriverRemoteConnection(`wss://${uri}/gremlin`, {})
    const graph = new Graph()
    const g = graph.traversal().withRemote(dc)

    const data = await g.addV('Review').property('date', review.date).property('rating', review.rating).next();
 
             g.addE("writes").from(g.V().hasLabel("Person").next()).to(g.V().hasLabel("Review").next());
    dc.close()
    return review
}
export default createReview