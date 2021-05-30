const gremlin = require('gremlin')

const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection
const Graph = gremlin.structure.Graph
const uri = process.env.READER

const listPosts = async () => {
    let dc = new DriverRemoteConnection(`wss://${uri}/gremlin`, {})
    const graph = new Graph()
    const g = graph.traversal().withRemote(dc)
    try {
      let data = await g.V().hasLabel('Person').toList()
      let persons = Array()

      for (const v of data) {
        const _properties = await g.V(v.id).properties().toList()
        let person = _properties.reduce((acc :any, next: any) => {
          acc[next.label] = next.value
          return acc
        }, {})
        person.id = v.id
        persons.push(person)
      }
                
      dc.close()
      return persons
    } catch (err) {
        console.log('ERROR', err)
        return null
    }
}

export default listPosts