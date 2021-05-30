const gremlin = require('gremlin')
import Person from './Person'
 

const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection
const Graph = gremlin.structure.Graph
const uri = process.env.WRITER

async function createPost(person: Person ) {
    let dc = new DriverRemoteConnection(`wss://${uri}/gremlin`, {})
    const graph = new Graph()
    const g = graph.traversal().withRemote(dc)
            //add first person
    const data = await g.addV('Person').as('a').property('first_name',person.first_name).property('last_name', person.last_name).next();
     //add second person
     g.addV('Person').as('b').property('first_name',person.first_name).property('last_name', person.last_name).next();
     //edge
     g.addE('friends').from('a').to('b').next();
    person.id = data.value.id
    dc.close()
    return person
}
export default createPost