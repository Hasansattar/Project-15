const gremlin = require('gremlin')
import Person from './Person'
 

const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection
const Graph = gremlin.structure.Graph
const uri = process.env.WRITER

async function createPerson(person: Person ) {
    let dc = new DriverRemoteConnection(`wss://${uri}/gremlin`, {})
    const graph = new Graph()
    const g = graph.traversal().withRemote(dc)
            //add first person
    const data = await g.addV('Person').property('first_name',person.first_name).property('last_name', person.last_name).next();

     //edge
      g.addE('friends').from(g.V().hasLabel("Person").next()).to(g.V().hasLabel("Person").next());
    person.id = data.value.id
    dc.close()
    return person
}
export default createPerson